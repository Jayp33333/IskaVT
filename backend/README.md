# ISKA Virtual Tour Backend

Backend server for the ISKA Virtual Tour logbook feature using Express.js and MongoDB.

## Features

- MongoDB schema for logbook entries
- RESTful API endpoints for logbook management
- CORS restricted to the frontend origin(s) in `CLIENT_ORIGIN`
- Admin endpoints require a JWT (admin or super_admin)
- `helmet` headers, JSON body limit (100kb), rate limits on login and public forms
- Error handling and validation

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iska-vt
NODE_ENV=development
JWT_SECRET=your-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
APP_TIMEZONE=Asia/Manila
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD="your-secure-password"
```

Quote passwords that contain `#` or spaces. Then seed the super admin:

```bash
npm run seed:super-admin
```

### Vercel deployment

Add these environment variables in the Vercel project for the backend:

| Variable | Required |
|----------|----------|
| `MONGODB_URI` | Yes |
| `JWT_SECRET` | Yes (login and admin routes return 503 without it) |
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | Recommended. Comma-separated frontend origins, e.g. `https://iska-vt.vercel.app,https://www.example.edu`. No trailing path. |
| `APP_TIMEZONE` | Optional. IANA zone for dashboard stats day/week/month boundaries. Default `Asia/Manila`. |

### Environment variables

- **`CLIENT_ORIGIN`**: comma-separated list of origins allowed by CORS. If it is
  unset, every origin is still allowed (the old behaviour, so existing
  deployments keep working) and the server logs a one-time warning at startup.
  Set it in production.
- **`APP_TIMEZONE`**: IANA time zone (default `Asia/Manila`) used by the stats
  service for "today", "this week" and "this month" and for per-day/hour charts.
- **`JWT_SECRET`**: required for admin login. Without it, login and every
  protected route return **503** (not 401).

## Security

- **Access:** only these routes are public: `POST /api/logbook`,
  `GET /api/logbook/:id`, `PATCH /api/logbook/:id/timeout`, `POST /api/messages`,
  `POST /api/feedback`, `GET /api/settings/public`, `POST /api/auth/login` and
  `GET /api/health`. Every other route needs `Authorization: Bearer <token>`
  for an `admin` or `super_admin` (users and settings: `super_admin` only).
- **Public logbook creates** ignore `date`, `timeIn` and `timeOut` and use the
  server clock (`timeOut` is `null`). An authenticated admin may set them
  (the dashboard's "Add Visitor" form). A request that sends an invalid or
  expired token gets `401` rather than being treated as public; the tour sends
  no token.
- **Sessions:** JWTs last **12 hours**. Changing an admin's password bumps the
  user's `tokenVersion`, which invalidates all tokens issued before the change.
  Deactivated accounts are rejected immediately.
- **Login:** failed logins return **401** `Invalid username or password`
  whether the username exists or not (a dummy bcrypt compare keeps timing even).
- **Password policy:** at least **8** characters (create and reset).
- **Rate limits** (per client IP, 15-minute window, `429` when exceeded):
  `POST /api/auth/login` 10 failed attempts (`LOGIN_RATE_LIMIT`; successful
  logins don't count); `POST /api/logbook`, `POST /api/messages` and
  `POST /api/feedback` 120 requests each (`PUBLIC_WRITE_RATE_LIMIT`; kept high
  because kiosks and campus Wi-Fi share one IP). Counters are in memory, per
  instance, and reset on restart, so on serverless hosts the effective limit is
  roughly the limit times the number of warm instances. `trust proxy` defaults
  to 1 so the client IP comes from the platform proxy (Vercel); set
  `TRUST_PROXY=0` when clients reach the server directly, otherwise they can
  spoof `X-Forwarded-For`. Limiters are disabled when `NODE_ENV=test`.
- **Errors during auth:** an unexpected failure while checking a token (e.g. a
  database timeout) returns `500`, not `401`, so a brief outage doesn't sign
  every admin out.
- **Input:** JSON/form bodies over 100kb get `413`. Logbook `sortBy` accepts only
  `createdAt`, `timeIn`, `timeOut`, `fullName`, `visitorType` or `destination`
  (optionally prefixed `-`); anything else falls back to `-createdAt`.
- **Validation errors** return `400` with
  `{ "error": "Validation failed", "details": { "<field>": "<message>" } }`.

Super admin is seeded against your MongoDB Atlas database (run `npm run seed:super-admin` locally once).

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iska-vt
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## Testing

```bash
yarn test
```

Tests use Node's built-in runner (`node:test`, Node 22+) and `supertest`, and
live in `test/` as `*.test.js` files. They import the Express app from `app.js`
(which builds routes without connecting to MongoDB or listening); `server.js` is
the runtime entry point that connects and listens.

`test/authMatrix.test.js` checks the unauthenticated (and forged-token)
response of every route and needs no database or `.env`. Add every new route
to its public or protected list. `test/authSession.test.js` covers login and
token versioning with the User model stubbed; `test/hardening.test.js` covers
the pure helpers (public-create sanitizing, `sortBy` whitelist, validation
details, CORS options).

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the server is running

### Logbook Endpoints

#### Create Logbook Entry
- **POST** `/api/logbook` (public; `date`/`timeIn`/`timeOut` are only honoured for an admin token)
- **Body:**
```json
{
  "fullName": "John Doe",
  "visitorType": "Student",
  "purpose": "Campus tour",
  "destination": "Main Building",
  "date": "2024-01-15T10:00:00Z",
  "timeIn": "2024-01-15T10:00:00Z",
  "timeOut": null
}
```

#### Get All Logbook Entries
- **GET** `/api/logbook` (admin)
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 50)
  - `sortBy` (optional, default: "-createdAt"; whitelisted, see Security)

#### Get Single Logbook Entry
- **GET** `/api/logbook/:id` (public; returns only the fields the tour uses)

#### Update Time Out
- **PATCH** `/api/logbook/:id/timeout` (public; called by a keepalive fetch with no auth header)

## MongoDB Schema

The logbook entry schema includes:
- `fullName` (String, required, max 120)
- `visitorType` (String, required, max 60)
- `purpose` (String, required, max 500)
- `destination` (String, required, max 120)
- `date` (Date, default: now)
- `timeIn` (Date, default: now)
- `timeOut` (Date, optional)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

Indexes: `{date:-1}`, `{fullName:1}`, `{createdAt:-1}`, `{timeIn:-1}`,
`{timeOut:1, timeIn:-1}`. Mongoose builds missing indexes on startup
(`autoIndex`); on a large production collection you may prefer to create
them manually first.

## Frontend Integration

Make sure to set the `VITE_API_BASE_URL` environment variable in your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
