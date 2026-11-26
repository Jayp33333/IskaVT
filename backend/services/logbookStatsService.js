import Logbook from '../models/Logbook.js';
import {
  addDaysInZone,
  addMonthsToStartOfMonthInZone,
  getAppTimezone,
  startOfDayInZone,
  startOfIsoWeekInZone,
  startOfMonthInZone,
} from '../utils/timezone.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TIMELINE_DAYS = 84; // 12 weeks, including today
const MONTHS_WINDOW = 12; // including the current month
const RECENT_DAYS = 30; // hour / weekday / duration stats

const DURATION_BUCKETS = [
  { key: 'bucket_0_15', label: '0-15m', min: 0, max: 15 },
  { key: 'bucket_15_30', label: '15-30m', min: 15, max: 30 },
  { key: 'bucket_30_60', label: '30-60m', min: 30, max: 60 },
  { key: 'bucket_60_plus', label: '60m+', min: 60, max: Infinity },
];

/**
 * Pure date-window computation for the stats summary. Every boundary is a
 * real instant at local midnight in `tz`; ranges are half-open [start, end).
 */
export function computeWindows(now, tz) {
  const nowDate = new Date(now);
  const nowMs = nowDate.getTime();

  const startOfToday = startOfDayInZone(nowDate, tz);
  const startOfWeek = startOfIsoWeekInZone(nowDate, tz);
  const startOfMonth = startOfMonthInZone(nowDate, tz);

  const startOfYesterday = addDaysInZone(startOfToday, -1, tz);
  const startOfPrevWeek = addDaysInZone(startOfWeek, -7, tz);
  const startOfPrevMonth = addMonthsToStartOfMonthInZone(nowDate, -1, tz);

  const elapsedInMonth = nowMs - startOfMonth.getTime();
  const prevMonthEnd = new Date(
    Math.min(startOfPrevMonth.getTime() + elapsedInMonth, startOfMonth.getTime())
  );

  return {
    now: nowDate,
    startOfToday,
    startOfWeek,
    startOfMonth,
    previous: {
      today: { start: startOfYesterday, end: addDaysInZone(nowDate, -1, tz) },
      week: { start: startOfPrevWeek, end: addDaysInZone(nowDate, -7, tz) },
      month: { start: startOfPrevMonth, end: prevMonthEnd },
    },
    timelineStart: addDaysInZone(startOfToday, -(TIMELINE_DAYS - 1), tz),
    monthsStart: addMonthsToStartOfMonthInZone(nowDate, -(MONTHS_WINDOW - 1), tz),
    recentStart: new Date(nowMs - RECENT_DAYS * MS_PER_DAY),
  };
}

function emptyDurationStats() {
  return {
    avgDurationMinutes: 0,
    durationBuckets: DURATION_BUCKETS.map((bucket) => ({
      label: bucket.label,
      count: 0,
    })),
  };
}

function countSince(start) {
  return Logbook.countDocuments({ timeIn: { $gte: start } });
}

function countBetween({ start, end }) {
  return Logbook.countDocuments({ timeIn: { $gte: start, $lt: end } });
}

function destinationsAgg() {
  return Logbook.aggregate([
    { $group: { _id: '$destination', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

function visitorTypeAgg() {
  return Logbook.aggregate([
    { $group: { _id: '$visitorType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

// Groups visits by a tz-aware date expression, optionally from `start` onward.
function groupedAgg(groupKey, start) {
  const pipeline = [];
  if (start) pipeline.push({ $match: { timeIn: { $gte: start } } });
  pipeline.push(
    { $group: { _id: groupKey, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  );
  return Logbook.aggregate(pipeline);
}

function makeDurationCondition({ min, max }) {
  const gte = { $gte: ['$durationMinutes', min] };
  if (!Number.isFinite(max)) {
    return { $cond: [gte, 1, 0] };
  }
  return {
    $cond: [{ $and: [gte, { $lt: ['$durationMinutes', max] }] }, 1, 0],
  };
}

function durationAgg(startRange) {
  const bucketAccumulators = DURATION_BUCKETS.reduce((acc, bucket) => {
    acc[bucket.key] = { $sum: makeDurationCondition(bucket) };
    return acc;
  }, {});

  return Logbook.aggregate([
    {
      $match: {
        timeIn: { $gte: startRange },
        timeOut: { $ne: null },
      },
    },
    {
      $project: {
        durationMinutes: {
          $divide: [{ $subtract: ['$timeOut', '$timeIn'] }, 60000],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgDurationMinutes: { $avg: '$durationMinutes' },
        ...bucketAccumulators,
      },
    },
  ]);
}

function shapeDurationStats(agg) {
  if (!agg || agg.length === 0) return emptyDurationStats();
  const root = agg[0];
  return {
    avgDurationMinutes: root.avgDurationMinutes || 0,
    durationBuckets: DURATION_BUCKETS.map((bucket) => ({
      label: bucket.label,
      count: root[bucket.key] || 0,
    })),
  };
}

function toPairs(agg, key) {
  return agg.map((d) => ({ [key]: d._id, count: d.count }));
}

export async function getSummary() {
  const timezone = getAppTimezone();
  const w = computeWindows(new Date(), timezone);
  const date = '$timeIn';

  const [
    todayCount,
    weekCount,
    monthCount,
    activeCount,
    prevTodayCount,
    prevWeekCount,
    prevMonthCount,
    destinationAggregation,
    visitorTypeAggregation,
    timelineAggregation,
    monthAggregation,
    yearAggregation,
    hourAggregation,
    dayOfWeekAggregation,
    durationAggregation,
  ] = await Promise.all([
    countSince(w.startOfToday),
    countSince(w.startOfWeek),
    countSince(w.startOfMonth),
    Logbook.countDocuments({ timeOut: null, timeIn: { $gte: w.startOfToday } }),
    countBetween(w.previous.today),
    countBetween(w.previous.week),
    countBetween(w.previous.month),
    destinationsAgg(),
    visitorTypeAgg(),
    groupedAgg({ $dateToString: { format: '%Y-%m-%d', date, timezone } }, w.timelineStart),
    groupedAgg({ $dateToString: { format: '%Y-%m', date, timezone } }, w.monthsStart),
    groupedAgg({ $year: { date, timezone } }),
    groupedAgg({ $hour: { date, timezone } }, w.recentStart),
    groupedAgg({ $dayOfWeek: { date, timezone } }, w.recentStart),
    durationAgg(w.recentStart),
  ]);

  const visitsPerDestination = destinationAggregation.map((d) => ({
    destination: d._id || 'Unknown',
    count: d.count,
  }));

  const visitsByVisitorType = visitorTypeAggregation.map((d) => ({
    visitorType: d._id || 'Unknown',
    count: d.count,
  }));

  const durationStats = shapeDurationStats(durationAggregation);

  return {
    timezone,
    todayCount,
    weekCount,
    monthCount,
    activeCount,
    previous: {
      todayCount: prevTodayCount,
      weekCount: prevWeekCount,
      monthCount: prevMonthCount,
    },
    visitsTimeline: toPairs(timelineAggregation, 'date'),
    visitsByMonth: toPairs(monthAggregation, 'month'),
    visitsByYear: toPairs(yearAggregation, 'year'),
    visitsPerDestination,
    visitsByVisitorType,
    visitsByHour: toPairs(hourAggregation, 'hour'),
    visitsByDayOfWeek: toPairs(dayOfWeekAggregation, 'day'),
    avgDurationMinutes: durationStats.avgDurationMinutes,
    durationBuckets: durationStats.durationBuckets,
  };
}
