/**
 * Login and token checks (roadmap 4.1) with the User model stubbed, so no
 * database is needed.
 */
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import User from '../models/User.js';

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const ID = '64b7f0f0f0f0f0f0f0f0f0f0';
const PASSWORD = 'correct-horse';

let app;
let fakeUser;
const original = { findById: User.findById, findOne: User.findOne };

before(async () => {
  ({ default: app } = await import('../app.js'));
  fakeUser = {
    _id: ID,
    username: 'admin1',
    email: '',
    role: 'admin',
    isActive: true,
    tokenVersion: 2,
    passwordHash: await bcrypt.hash(PASSWORD, 4),
  };
  User.findById = () => ({ select: async () => fakeUser });
  User.findOne = async ({ username }) => (username === fakeUser.username ? fakeUser : null);
});

after(() => {
  User.findById = original.findById;
  User.findOne = original.findOne;
});

const tokenWith = (claims) =>
  jwt.sign({ sub: ID, role: 'admin', ...claims }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('POST /api/auth/login', () => {
  test('unknown user gets 401 with a generic message', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nobody', password: 'whatever1' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid username or password');
  });

  test('wrong password gets the same 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin1', password: 'wrong-pass' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid username or password');
  });

  test('missing fields get 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin1' });
    assert.equal(res.status, 400);
  });

  test('success returns a 12h token carrying the token version', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'Admin1 ', password: PASSWORD });
    assert.equal(res.status, 200);
    const payload = jwt.verify(res.body.data.token, process.env.JWT_SECRET);
    assert.equal(payload.tv, 2);
    assert.equal(payload.exp - payload.iat, 12 * 60 * 60);
  });
});

describe('authenticate + tokenVersion', () => {
  test('token with the current version is accepted', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenWith({ tv: 2 })}`);
    // /me reaches the controller (the stub returns the user), so not 401.
    assert.equal(res.status, 200);
  });

  test('token with an old version is rejected', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenWith({ tv: 1 })}`);
    assert.equal(res.status, 401);
  });

  test('legacy token without tv only matches tokenVersion 0', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenWith({})}`);
    assert.equal(res.status, 401);
  });

  test('inactive account is rejected', async () => {
    fakeUser.isActive = false;
    try {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenWith({ tv: 2 })}`);
      assert.equal(res.status, 401);
    } finally {
      fakeUser.isActive = true;
    }
  });
});

describe('auth failures vs server errors', () => {
  test('a DB error while loading the user is a 500, not a 401 sign-out', async () => {
    const findById = User.findById;
    User.findById = () => ({
      select: async () => {
        throw new Error('connection timed out');
      },
    });
    try {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenWith({ tv: 2 })}`);
      assert.equal(res.status, 500);
    } finally {
      User.findById = findById;
    }
  });
});

describe('POST /api/logbook with optional auth', () => {
  const body = { fullName: 'A', visitorType: 'Guest', purpose: 'Visit', destination: 'Library' };

  test('an invalid bearer token is rejected instead of silently treated as public', async () => {
    const res = await request(app).post('/api/logbook').set('Authorization', 'Bearer not-a-real-token').send(body);
    assert.equal(res.status, 401);
  });

  test('an outdated token version is rejected', async () => {
    const res = await request(app).post('/api/logbook').set('Authorization', `Bearer ${tokenWith({ tv: 1 })}`).send(body);
    assert.equal(res.status, 401);
  });
});
