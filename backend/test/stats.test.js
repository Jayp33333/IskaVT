import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { computeWindows } from '../services/logbookStatsService.js';
import {
  addDaysInZone,
  formatDateKeyInZone,
  formatMonthKeyInZone,
  getAppTimezone,
  getTimezoneOffsetMs,
  startOfDayInZone,
  startOfIsoWeekInZone,
  startOfMonthInZone,
  zonedParts,
  zonedTimeToUtc,
} from '../utils/timezone.js';

const MANILA = 'Asia/Manila';
const NEW_YORK = 'America/New_York';
const iso = (d) => d.toISOString();
const HOUR = 60 * 60 * 1000;

describe('getAppTimezone', () => {
  test('defaults to Asia/Manila when unset', () => {
    assert.equal(getAppTimezone({}), MANILA);
  });

  test('uses a valid APP_TIMEZONE', () => {
    assert.equal(getAppTimezone({ APP_TIMEZONE: 'Europe/London' }), 'Europe/London');
  });

  test('falls back to Asia/Manila when APP_TIMEZONE is invalid', () => {
    assert.equal(getAppTimezone({ APP_TIMEZONE: 'Not/AZone' }), MANILA);
    assert.equal(getAppTimezone({ APP_TIMEZONE: '   ' }), MANILA);
  });
});

describe('timezone helpers', () => {
  test('zonedParts reports Manila wall-clock time and weekday', () => {
    const p = zonedParts(new Date('2026-03-02T01:00:00Z'), MANILA);
    assert.deepEqual(p, {
      year: 2026, month: 3, day: 2, hour: 9, minute: 0, second: 0, weekday: 1,
    });
  });

  test('offsets are correct on both sides of a DST change', () => {
    assert.equal(getTimezoneOffsetMs(new Date('2026-03-08T06:00:00Z'), NEW_YORK), -5 * HOUR);
    assert.equal(getTimezoneOffsetMs(new Date('2026-03-08T08:00:00Z'), NEW_YORK), -4 * HOUR);
    assert.equal(getTimezoneOffsetMs(new Date('2026-03-02T01:00:00Z'), MANILA), 8 * HOUR);
  });

  test('a wall time inside a DST gap resolves to just after the gap', () => {
    // 02:30 on 2026-03-08 never happens in New York; 03:30 EDT does.
    const t = zonedTimeToUtc({ year: 2026, month: 3, day: 8, hour: 2, minute: 30 }, NEW_YORK);
    assert.equal(iso(t), '2026-03-08T07:30:00.000Z');
  });

  test('date and month keys use the zone, not UTC', () => {
    const justAfterMidnight = new Date('2026-03-04T16:05:00Z'); // Mar 5 00:05 Manila
    assert.equal(formatDateKeyInZone(justAfterMidnight, MANILA), '2026-03-05');
    assert.equal(formatMonthKeyInZone(new Date('2026-03-31T16:30:00Z'), MANILA), '2026-04');
  });
});

describe('computeWindows: Asia/Manila', () => {
  test('Monday 09:00 Manila (2026-03-02T01:00Z)', () => {
    const w = computeWindows(new Date('2026-03-02T01:00:00Z'), MANILA);
    assert.equal(iso(w.startOfToday), '2026-03-01T16:00:00.000Z');
    assert.equal(iso(w.startOfWeek), '2026-03-01T16:00:00.000Z');
    assert.equal(iso(w.startOfMonth), '2026-02-28T16:00:00.000Z');

    assert.equal(iso(w.previous.today.start), '2026-02-28T16:00:00.000Z');
    assert.equal(iso(w.previous.today.end), '2026-03-01T01:00:00.000Z');
    assert.equal(iso(w.previous.week.start), '2026-02-22T16:00:00.000Z');
    assert.equal(iso(w.previous.week.end), '2026-02-23T01:00:00.000Z');
    // Feb 1 00:00 Manila + 1d 9h elapsed in March
    assert.equal(iso(w.previous.month.start), '2026-01-31T16:00:00.000Z');
    assert.equal(iso(w.previous.month.end), '2026-02-02T01:00:00.000Z');

    // 84 days including today: Dec 9 2025 .. Mar 2 2026
    assert.equal(iso(w.timelineStart), '2025-12-08T16:00:00.000Z');
    assert.equal(formatDateKeyInZone(w.timelineStart, MANILA), '2025-12-09');
    assert.equal(
      Math.round((w.startOfToday - w.timelineStart) / (24 * HOUR)) + 1,
      84
    );
    // 12 months including current: Apr 2025 .. Mar 2026
    assert.equal(iso(w.monthsStart), '2025-03-31T16:00:00.000Z');
    assert.equal(iso(w.recentStart), '2026-01-31T01:00:00.000Z');
  });

  test('just after Manila midnight while UTC is still the previous day', () => {
    const now = new Date('2026-03-04T16:05:00Z'); // Thu Mar 5 00:05 Manila
    const w = computeWindows(now, MANILA);
    assert.equal(now.getUTCDate(), 4);
    assert.equal(iso(w.startOfToday), '2026-03-04T16:00:00.000Z');
    assert.equal(iso(w.startOfWeek), '2026-03-01T16:00:00.000Z');
    assert.equal(iso(w.startOfMonth), '2026-02-28T16:00:00.000Z');
    assert.equal(iso(w.previous.today.start), '2026-03-03T16:00:00.000Z');
    assert.equal(iso(w.previous.today.end), '2026-03-03T16:05:00.000Z');
  });

  test('first minutes of a new Manila month', () => {
    const w = computeWindows(new Date('2026-03-31T16:30:00Z'), MANILA); // Apr 1 00:30
    assert.equal(iso(w.startOfMonth), '2026-03-31T16:00:00.000Z');
    assert.equal(iso(w.previous.month.start), '2026-02-28T16:00:00.000Z');
    assert.equal(iso(w.previous.month.end), '2026-02-28T16:30:00.000Z');
  });

  test('previous-month window is clamped to the end of a shorter month', () => {
    const w = computeWindows(new Date('2026-03-31T02:00:00Z'), MANILA); // Mar 31 10:00
    assert.equal(iso(w.previous.month.start), '2026-01-31T16:00:00.000Z');
    // Feb 1 + 30d 10h would run into March; clamp to end of Feb (= start of March).
    assert.equal(iso(w.previous.month.end), '2026-02-28T16:00:00.000Z');
    assert.equal(iso(w.previous.month.end), iso(w.startOfMonth));
  });

  test('January compares against December of the previous year', () => {
    const w = computeWindows(new Date('2026-01-15T04:00:00Z'), MANILA);
    assert.equal(iso(w.startOfMonth), '2025-12-31T16:00:00.000Z');
    assert.equal(iso(w.previous.month.start), '2025-11-30T16:00:00.000Z');
    assert.equal(iso(w.previous.month.end), '2025-12-15T04:00:00.000Z');
    assert.equal(iso(w.monthsStart), '2025-01-31T16:00:00.000Z'); // Feb 2025
  });
});

describe('computeWindows: DST zone (America/New_York)', () => {
  test('on the spring-forward day (Sun 2026-03-08)', () => {
    const w = computeWindows(new Date('2026-03-08T12:00:00Z'), NEW_YORK); // 08:00 EDT
    assert.equal(iso(w.startOfToday), '2026-03-08T05:00:00.000Z'); // midnight EST
    assert.equal(iso(w.startOfWeek), '2026-03-02T05:00:00.000Z'); // Monday Mar 2, EST
    assert.equal(iso(w.startOfMonth), '2026-03-01T05:00:00.000Z');
  });

  test('the day after spring-forward starts at midnight EDT', () => {
    const w = computeWindows(new Date('2026-03-09T12:00:00Z'), NEW_YORK);
    assert.equal(iso(w.startOfToday), '2026-03-09T04:00:00.000Z');
    assert.equal(iso(w.startOfWeek), '2026-03-09T04:00:00.000Z');
    // Yesterday (the 23-hour day) started at midnight EST.
    assert.equal(iso(w.previous.today.start), '2026-03-08T05:00:00.000Z');
    // Previous ISO week started at local midnight EST, not now-minus-7x24h.
    assert.equal(iso(w.previous.week.start), '2026-03-02T05:00:00.000Z');
  });

  test('fall-back day boundaries (Sun 2026-11-01)', () => {
    assert.equal(iso(startOfDayInZone(new Date('2026-11-01T12:00:00Z'), NEW_YORK)), '2026-11-01T04:00:00.000Z');
    assert.equal(iso(startOfDayInZone(new Date('2026-11-02T12:00:00Z'), NEW_YORK)), '2026-11-02T05:00:00.000Z');
    assert.equal(
      iso(addDaysInZone(new Date('2026-11-02T05:00:00Z'), -1, NEW_YORK)),
      '2026-11-01T04:00:00.000Z'
    );
  });

  test('every local midnight across the transitions is 00:00 local', () => {
    let day = startOfDayInZone(new Date('2026-02-25T12:00:00Z'), NEW_YORK);
    for (let i = 0; i < 260; i += 1) {
      const p = zonedParts(day, NEW_YORK);
      assert.equal(p.hour, 0, `hour at ${iso(day)}`);
      assert.equal(p.minute, 0);
      const weekStart = zonedParts(startOfIsoWeekInZone(day, NEW_YORK), NEW_YORK);
      assert.equal(weekStart.weekday, 1);
      assert.equal(weekStart.hour, 0);
      assert.equal(zonedParts(startOfMonthInZone(day, NEW_YORK), NEW_YORK).day, 1);
      day = addDaysInZone(day, 1, NEW_YORK);
    }
  });
});
