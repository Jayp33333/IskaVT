/**
 * Unit tests for the backend hardening helpers (roadmap 1.1 / 4.1).
 * Pure functions only: no database, no HTTP server.
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import mongoose from 'mongoose';

import { mapValidationErrors } from '../middleware/errorHandler.js';
import Logbook from '../models/Logbook.js';
import {
  DEFAULT_SORT,
  parseSortBy,
  sanitizeCreatePayload,
} from '../services/logbookService.js';

process.env.NODE_ENV = 'test';
const { buildCorsOptions, parseAllowedOrigins } = await import('../app.js');

const VISITOR = {
  fullName: 'Juan Dela Cruz',
  visitorType: 'Student',
  purpose: 'Campus tour',
  destination: 'Main Building',
};

describe('sanitizeCreatePayload (public POST /logbook)', () => {
  const now = new Date('2026-01-15T02:00:00.000Z');
  const supplied = {
    ...VISITOR,
    date: '2020-01-01T00:00:00.000Z',
    timeIn: '2020-01-01T00:00:00.000Z',
    timeOut: '2020-01-01T01:00:00.000Z',
  };

  test('ignores client date/timeIn/timeOut when not an admin', () => {
    const doc = sanitizeCreatePayload(supplied, false, now);
    assert.equal(doc.date.getTime(), now.getTime());
    assert.equal(doc.timeIn.getTime(), now.getTime());
    assert.equal(doc.timeOut, null);
    assert.equal(doc.fullName, VISITOR.fullName);
  });

  test('defaults isAdmin to false', () => {
    const doc = sanitizeCreatePayload(supplied, undefined, now);
    assert.equal(doc.timeIn.getTime(), now.getTime());
  });

  test('keeps client date/timeIn/timeOut for an admin', () => {
    const doc = sanitizeCreatePayload(supplied, true, now);
    assert.equal(doc.date.toISOString(), supplied.date);
    assert.equal(doc.timeIn.toISOString(), supplied.timeIn);
    assert.equal(doc.timeOut.toISOString(), supplied.timeOut);
  });

  test('admin without times falls back to server time', () => {
    const doc = sanitizeCreatePayload(VISITOR, true, now);
    assert.equal(doc.timeIn.getTime(), now.getTime());
    assert.equal(doc.timeOut, null);
  });

  test('admin with an invalid date gets a 400', () => {
    assert.throws(
      () => sanitizeCreatePayload({ ...VISITOR, timeIn: 'nope' }, true, now),
      (err) => err.status === 400
    );
  });

  test('drops unknown fields such as _id or createdAt', () => {
    const doc = sanitizeCreatePayload(
      { ...VISITOR, _id: 'x', createdAt: '2000-01-01' },
      false,
      now
    );
    assert.deepEqual(Object.keys(doc).sort(), [
      'date',
      'destination',
      'fullName',
      'purpose',
      'timeIn',
      'timeOut',
      'visitorType',
    ]);
  });
});

describe('parseSortBy', () => {
  test('accepts whitelisted fields, with or without "-"', () => {
    for (const field of ['createdAt', 'timeIn', 'timeOut', 'fullName', 'visitorType', 'destination']) {
      assert.equal(parseSortBy(field), field);
      assert.equal(parseSortBy(`-${field}`), `-${field}`);
    }
  });

  test('falls back to the default for anything else', () => {
    for (const value of [undefined, '', 'purpose', '-passwordHash', 'fullName timeIn', '--createdAt', ['timeIn'], { $gt: 1 }]) {
      assert.equal(parseSortBy(value), DEFAULT_SORT);
    }
  });
});

describe('Logbook model limits', () => {
  test('rejects over-long fields with a ValidationError', () => {
    const doc = new Logbook({ ...VISITOR, fullName: 'x'.repeat(121), purpose: 'y'.repeat(501) });
    const err = doc.validateSync();
    assert.ok(err);
    assert.ok(err.errors.fullName);
    assert.ok(err.errors.purpose);
  });

  test('declares the list/stats indexes', () => {
    const keys = Logbook.schema.indexes().map(([fields]) => JSON.stringify(fields));
    assert.ok(keys.includes(JSON.stringify({ createdAt: -1 })));
    assert.ok(keys.includes(JSON.stringify({ timeIn: -1 })));
    assert.ok(keys.includes(JSON.stringify({ timeOut: 1, timeIn: -1 })));
  });
});

describe('mapValidationErrors', () => {
  test('maps a Mongoose ValidationError to { field: message }', () => {
    const err = new Logbook({ fullName: 'x'.repeat(121), timeIn: 'not-a-date' }).validateSync();
    const details = mapValidationErrors(err);
    assert.equal(details.fullName, 'Full name must be 120 characters or fewer');
    assert.equal(details.visitorType, 'Visitor type is required');
    // Cast errors never echo the raw input value.
    assert.equal(details.timeIn, 'Invalid value for timeIn');
    assert.ok(!JSON.stringify(details).includes('not-a-date'));
  });

  test('handles an error without per-field entries', () => {
    assert.deepEqual(mapValidationErrors(new mongoose.Error.ValidationError()), {});
  });
});

describe('CORS options', () => {
  test('parses a comma-separated CLIENT_ORIGIN', () => {
    assert.deepEqual(
      parseAllowedOrigins(' https://a.example.com/, https://b.example.com ,,'),
      ['https://a.example.com', 'https://b.example.com']
    );
  });

  test('restricts origins when CLIENT_ORIGIN is set', () => {
    assert.deepEqual(buildCorsOptions({ CLIENT_ORIGIN: 'https://a.example.com', NODE_ENV: 'test' }), {
      origin: ['https://a.example.com'],
    });
  });

  test('allows every origin when CLIENT_ORIGIN is unset', () => {
    assert.deepEqual(buildCorsOptions({ NODE_ENV: 'test' }), {});
  });
});

describe('legacy rows over the new maxlength limits', () => {
  test('setTimeoutNow uses an atomic update that skips full-document validation', async () => {
    const { setTimeoutNow } = await import('../services/logbookService.js');
    const original = Logbook.findOneAndUpdate;
    let captured;
    Logbook.findOneAndUpdate = async (filter, update, opts) => {
      captured = { filter, update, opts };
      return { _id: filter._id, fullName: 'x'.repeat(500), timeOut: update.$set.timeOut };
    };
    try {
      const out = await setTimeoutNow('64b7f0f0f0f0f0f0f0f0f0f0');
      assert.deepEqual(captured.filter, { _id: '64b7f0f0f0f0f0f0f0f0f0f0', timeOut: null });
      assert.ok(captured.update.$set.timeOut instanceof Date);
      assert.ok(out.timeOut instanceof Date);
    } finally {
      Logbook.findOneAndUpdate = original;
    }
  });

  test('validateModifiedOnly lets an unrelated edit save', async () => {
    const doc = Logbook.hydrate({
      _id: '64b7f0f0f0f0f0f0f0f0f0f0',
      fullName: 'x'.repeat(500),
      visitorType: 'Guest',
      purpose: 'Visit',
      destination: 'Library',
      date: new Date(),
      timeIn: new Date(),
      timeOut: null,
    });
    doc.timeOut = new Date();
    await assert.rejects(doc.validate());
    await doc.validate({ validateModifiedOnly: true });
  });
});
