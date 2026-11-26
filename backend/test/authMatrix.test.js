/**
 * Auth matrix: asserts the unauthenticated response for every API route.
 *
 * Runs with NO database. bufferCommands is disabled so any Mongoose call
 * fails immediately (500) instead of hanging; that is fine for "public"
 * routes, which only need to prove they are not rejected with 401/403.
 *
 * Cases marked `todo` are admin routes that are currently public. That is a
 * known critical bug tracked in docs/admin-panel-roadmap.md (Wave 1 / 1.1).
 * When it is fixed, remove the `todo` option so the case is enforced.
 */
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import mongoose from 'mongoose';
import request from 'supertest';

process.env.JWT_SECRET = 'test-secret';
mongoose.set('bufferCommands', false);

const ID = '64b7f0f0f0f0f0f0f0f0f0f0';
const WAVE_1 = { todo: 'Wave 1 / roadmap 1.1' };

/** Routes anyone (visitors, the public tour) must be able to call. */
const PUBLIC_ROUTES = [
  ['post', '/api/logbook'],
  ['get', `/api/logbook/${ID}`],
  ['patch', `/api/logbook/${ID}/timeout`],
  ['post', '/api/messages'],
  ['post', '/api/feedback'],
  ['get', '/api/settings/public'],
  ['post', '/api/auth/login'],
  ['get', '/api/health'],
];

/** Routes that must reject a request without a token (401). */
const PROTECTED_ROUTES = [
  ['get', '/api/logbook', WAVE_1],
  ['get', '/api/logbook/stats/summary', WAVE_1],
  ['patch', `/api/logbook/${ID}`, WAVE_1],
  ['delete', `/api/logbook/${ID}`, WAVE_1],
  ['get', '/api/messages', WAVE_1],
  ['get', '/api/messages/unread-count', WAVE_1],
  ['get', `/api/messages/${ID}`, WAVE_1],
  ['patch', `/api/messages/${ID}`, WAVE_1],
  ['delete', `/api/messages/${ID}`, WAVE_1],
  ['get', '/api/feedback', WAVE_1],
  ['get', '/api/feedback/unread-count', WAVE_1],
  ['get', '/api/feedback/stats/summary', WAVE_1],
  ['get', `/api/feedback/${ID}`, WAVE_1],
  ['patch', `/api/feedback/${ID}`, WAVE_1],
  ['delete', `/api/feedback/${ID}`, WAVE_1],
  ['get', '/api/users'],
  ['post', '/api/users'],
  ['patch', `/api/users/${ID}`],
  ['delete', `/api/users/${ID}`],
  ['get', '/api/settings'],
  ['patch', '/api/settings'],
  ['get', '/api/auth/me'],
];

let app;
let errorSpy;

before(async () => {
  // Imported after env/mongoose setup so modules see the test config.
  ({ default: app } = await import('../app.js'));
  // The error handler logs expected DB failures (no connection); keep output clean.
  errorSpy = console.error;
  console.error = () => {};
});

after(async () => {
  console.error = errorSpy;
  await mongoose.disconnect();
});

describe('public routes (no token) are not rejected by auth', () => {
  for (const [method, path] of PUBLIC_ROUTES) {
    test(`${method.toUpperCase()} ${path}`, async () => {
      const res = await request(app)[method](path).send({});
      assert.notEqual(res.status, 401, `got 401: ${JSON.stringify(res.body)}`);
      assert.notEqual(res.status, 403, `got 403: ${JSON.stringify(res.body)}`);
      assert.notEqual(res.status, 404, 'route is not mounted');
    });
  }
});

describe('protected routes (no token) return 401', () => {
  for (const [method, path, options = {}] of PROTECTED_ROUTES) {
    test(`${method.toUpperCase()} ${path}`, options, async () => {
      const res = await request(app)[method](path).send({});
      assert.equal(res.status, 401, `expected 401, got ${res.status}`);
    });
  }
});
