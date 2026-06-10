# ISKA Virtual Tour Backend

Backend server for the ISKA Virtual Tour logbook feature using Express.js and MongoDB.

## Features

- MongoDB schema for logbook entries
- RESTful API endpoints for logbook management
- CORS enabled for frontend integration
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
| `JWT_SECRET` | Yes (login returns 500 without it) |
| `NODE_ENV` | `production` |

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

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the server is running

### Logbook Endpoints

#### Create Logbook Entry
- **POST** `/api/logbook`
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
- **GET** `/api/logbook`
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 50)
  - `sortBy` (optional, default: "-createdAt")

#### Get Single Logbook Entry
- **GET** `/api/logbook/:id`

#### Update Time Out
- **PATCH** `/api/logbook/:id/timeout`

## MongoDB Schema

The logbook entry schema includes:
- `fullName` (String, required)
- `visitorType` (String, required)
- `purpose` (String, required)
- `destination` (String, required)
- `date` (Date, default: now)
- `timeIn` (Date, default: now)
- `timeOut` (Date, optional)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Frontend Integration

Make sure to set the `VITE_API_BASE_URL` environment variable in your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
