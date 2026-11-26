/**
 * Auth matrix: asserts the unauthenticated response for every API route.
 *
 * Runs with NO database. bufferCommands is disabled so any Mongoose call
 * fails immediately (500) instead of hanging; that is fine for "public"
 * routes, which only need to prove they are not rejected with 401/403.
 *
 * Every admin route must answer 401 without a token (roadmap 1.1). Add new
 * routes to one of the two lists so this matrix keeps covering the whole API.
 */
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test'; // disables rate limiters
mongoose.set('bufferCommands', false);

const ID = '64b7f0f0f0f0f0f0f0f0f0f0';

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
  ['get', '/api/logbook'],
  ['get', '/api/logbook/stats/summary'],
  ['patch', `/api/logbook/${ID}`],
  ['delete', `/api/logbook/${ID}`],
  ['get', '/api/messages'],
  ['get', '/api/messages/unread-count'],
  ['get', `/api/messages/${ID}`],
  ['patch', `/api/messages/${ID}`],
  ['delete', `/api/messages/${ID}`],
  ['get', '/api/feedback'],
  ['get', '/api/feedback/unread-count'],
  ['get', '/api/feedback/stats/summary'],
  ['get', `/api/feedback/${ID}`],
  ['patch', `/api/feedback/${ID}`],
  ['delete', `/api/feedback/${ID}`],
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
  for (const [method, path] of PROTECTED_ROUTES) {
    test(`${method.toUpperCase()} ${path}`, async () => {
      const res = await request(app)[method](path).send({});
      assert.equal(res.status, 401, `expected 401, got ${res.status}`);
    });
  }
});

describe('protected routes reject a token with a bad signature (401)', () => {
  const forged = jwt.sign(
    { sub: ID, role: 'super_admin', username: 'mallory', tv: 0 },
    'not-the-server-secret',
    { expiresIn: '1h' }
  );

  for (const [method, path] of PROTECTED_ROUTES) {
    test(`${method.toUpperCase()} ${path}`, async () => {
      const res = await request(app)
        [method](path)
        .set('Authorization', `Bearer ${forged}`)
        .send({});
      assert.equal(res.status, 401, `expected 401, got ${res.status}`);
    });
  }
});

describe('auth edge cases', () => {
  test('an expired token gets 401', async () => {
    const expired = jwt.sign(
      { sub: ID, role: 'admin', tv: 0, exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .get('/api/logbook')
      .set('Authorization', `Bearer ${expired}`);
    assert.equal(res.status, 401);
  });

  test('missing JWT_SECRET is reported as 503, not 401', async () => {
    const secret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      const res = await request(app)
        .get('/api/logbook')
        .set('Authorization', 'Bearer some.token.value');
      assert.equal(res.status, 503);
    } finally {
      process.env.JWT_SECRET = secret;
    }
  });

  test('public POST /api/logbook without a token is not an auth failure', async () => {
    const res = await request(app).post('/api/logbook').send({});
    assert.notEqual(res.status, 401);
    assert.notEqual(res.status, 403);
  });

  // A token that is sent but invalid means a lapsed admin session: reject it
  // so admin-only fields aren't silently dropped. The tour sends no token.
  test('a bad token on public POST /api/logbook is rejected with 401', async () => {
    const res = await request(app)
      .post('/api/logbook')
      .set('Authorization', 'Bearer not-a-jwt')
      .send({});
    assert.equal(res.status, 401);
  });
});
