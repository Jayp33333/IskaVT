import Logbook from '../models/Logbook.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const DURATION_BUCKETS = [
  { key: 'bucket_0_15', label: '0-15m', min: 0, max: 15 },
  { key: 'bucket_15_30', label: '15-30m', min: 15, max: 30 },
  { key: 'bucket_30_60', label: '30-60m', min: 30, max: 60 },
  { key: 'bucket_60_plus', label: '60m+', min: 60, max: Infinity },
];

function emptyDurationStats() {
  return {
    avgDurationMinutes: 0,
    durationBuckets: DURATION_BUCKETS.map((bucket) => ({
      label: bucket.label,
      count: 0,
    })),
  };
}

function getStartOfToday(now) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getStartOfIsoWeek(startOfToday) {
  const start = new Date(startOfToday);
  const day = start.getDay();
  const diffToMonday = (day + 6) % 7;
  start.setDate(start.getDate() - diffToMonday);
  return start;
}

function getStartOfMonth(startOfToday) {
  return new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
}

function destinationsAgg() {
  return Logbook.aggregate([
    { $group: { _id: '$destination', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

function timelineAgg(startRange) {
  return Logbook.aggregate([
    { $match: { timeIn: { $gte: startRange } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timeIn' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

function visitorTypeAgg() {
  return Logbook.aggregate([
    { $group: { _id: '$visitorType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

function hourAgg(startRange) {
  return Logbook.aggregate([
    { $match: { timeIn: { $gte: startRange } } },
    { $group: { _id: { $hour: '$timeIn' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
}

function dayOfWeekAgg(startRange) {
  return Logbook.aggregate([
    { $match: { timeIn: { $gte: startRange } } },
    { $group: { _id: { $dayOfWeek: '$timeIn' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
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

export async function getSummary() {
  const now = new Date();
  const startOfToday = getStartOfToday(now);
  const startOfWeek = getStartOfIsoWeek(startOfToday);
  const startOfMonth = getStartOfMonth(startOfToday);

  const startOf30Days = new Date(now.getTime() - 30 * MS_PER_DAY);
  const startOfTimeline = new Date(startOfToday);
  startOfTimeline.setDate(startOfTimeline.getDate() - 29);

  const [
    todayCount,
    weekCount,
    monthCount,
    destinationAggregation,
    timelineAggregation,
    visitorTypeAggregation,
    hourAggregation,
    dayOfWeekAggregation,
    durationAggregation,
  ] = await Promise.all([
    Logbook.countDocuments({ timeIn: { $gte: startOfToday } }),
    Logbook.countDocuments({ timeIn: { $gte: startOfWeek } }),
    Logbook.countDocuments({ timeIn: { $gte: startOfMonth } }),
    destinationsAgg(),
    timelineAgg(startOfTimeline),
    visitorTypeAgg(),
    hourAgg(startOf30Days),
    dayOfWeekAgg(startOf30Days),
    durationAgg(startOf30Days),
  ]);

  const visitsPerDestination = destinationAggregation.map((d) => ({
    destination: d._id || 'Unknown',
    count: d.count,
  }));

  const visitsTimeline = timelineAggregation.map((d) => ({
    date: d._id,
    count: d.count,
  }));

  const visitsByVisitorType = visitorTypeAggregation.map((d) => ({
    visitorType: d._id || 'Unknown',
    count: d.count,
  }));

  const visitsByHour = hourAggregation.map((d) => ({
    hour: d._id,
    count: d.count,
  }));

  const visitsByDayOfWeek = dayOfWeekAggregation.map((d) => ({
    day: d._id,
    count: d.count,
  }));

  const durationStats = shapeDurationStats(durationAggregation);

  return {
    todayCount,
    weekCount,
    monthCount,
    visitsPerDestination,
    visitsTimeline,
    visitsByVisitorType,
    visitsByHour,
    visitsByDayOfWeek,
    avgDurationMinutes: durationStats.avgDurationMinutes,
    durationBuckets: durationStats.durationBuckets,
  };
}
