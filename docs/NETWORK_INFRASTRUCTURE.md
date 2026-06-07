# ISKA Virtual Tour — Network Infrastructure

This document describes how the ISKA-VT system is structured, how components communicate, and which external services are involved.

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Users["End Users"]
        Browser["Web Browser"]
    end

    subgraph Frontend["Frontend (Vite + React SPA)"]
        direction TB
        SPA["React Application"]
        Static["Static Assets<br/>GLB · VRM · MP3 · Images"]
        Vercel["Hosting / CDN<br/>(Vercel — inferred)"]
    end

    subgraph Backend["Backend (Express API)"]
        API["REST API<br/>Port 5000 (default)"]
    end

    subgraph Data["Data Layer"]
        MongoDB[("MongoDB<br/>Database: iska-vt")]
    end

    subgraph External["External Services"]
        GFonts["Google Fonts CDN"]
        YouTube["YouTube Embeds"]
        VIVERSE["HTC VIVERSE SDK"]
        VercelAnalytics["Vercel Analytics<br/>& Speed Insights"]
        SpeechAPI["Browser Web Speech API<br/>(TTS — local)"]
    end

    Browser -->|"HTTPS"| Vercel
    Vercel --> SPA
    Vercel --> Static

    SPA -->|"HTTPS REST<br/>JSON · fetch()"| API
    API -->|"MongoDB wire protocol"| MongoDB

    SPA -.->|"HTTPS"| GFonts
    SPA -.->|"HTTPS iframe"| YouTube
    SPA -.->|"HTTPS (optional)"| VIVERSE
    SPA -.->|"HTTPS telemetry"| VercelAnalytics
    Browser -.->|"No network"| SpeechAPI

    style Users fill:#e8f4fc,stroke:#2196F3
    style Frontend fill:#e8f5e9,stroke:#4CAF50
    style Backend fill:#fff3e0,stroke:#FF9800
    style Data fill:#f3e5f5,stroke:#9C27B0
    style External fill:#fce4ec,stroke:#E91E63
```

---

## Component Topology

```mermaid
flowchart LR
    subgraph Client["client/ — React 19 + Vite"]
        Router["React Router"]
        Tour["3D Campus Tour<br/>(Three.js + VIVERSE)"]
        Marketing["Marketing Pages<br/>(Home, Contact, Handbook)"]
        Admin["Admin Dashboard"]
        ApiClient["apiClient.ts<br/>VITE_API_BASE_URL"]
    end

    subgraph Server["backend/ — Express 4"]
        CORS["CORS Middleware<br/>(open — all origins)"]
        Logbook["/api/logbook"]
        Messages["/api/messages"]
        Feedback["/api/feedback"]
        Health["/api/health"]
    end

    subgraph Storage["MongoDB Collections"]
        LogbookCol[("Logbook")]
        MessageCol[("Messages")]
        FeedbackCol[("Feedback")]
    end

    Router --> Tour & Marketing & Admin
    Tour & Marketing & Admin --> ApiClient
    ApiClient -->|"HTTP REST"| CORS
    CORS --> Logbook & Messages & Feedback & Health
    Logbook --> LogbookCol
    Messages --> MessageCol
    Feedback --> FeedbackCol
```

---

## Request Flows

### Visitor Logbook (3D Tour)

```mermaid
sequenceDiagram
    actor User
    participant SPA as React SPA
    participant API as Express API
    participant DB as MongoDB

    User->>SPA: Open /experience
    User->>SPA: Submit logbook form
    SPA->>API: POST /api/logbook
    API->>DB: Insert Logbook document
    DB-->>API: _id
    API-->>SPA: 201 Created
    SPA->>SPA: Store logbookEntryId in localStorage

    Note over User,SPA: User explores campus...

    User->>SPA: Leave tour / close tab
    SPA->>API: PATCH /api/logbook/:id/timeout (keepalive)
    API->>DB: Update timeOut
```

### Contact Form

```mermaid
sequenceDiagram
    actor User
    participant SPA as React SPA
    participant API as Express API
    participant DB as MongoDB

    User->>SPA: Submit contact form
    SPA->>API: POST /api/messages
    API->>DB: Insert Message document
    API-->>SPA: 201 Created
```

### Admin Dashboard

```mermaid
sequenceDiagram
    actor Admin
    participant SPA as React SPA
    participant Storage as sessionStorage
    participant API as Express API
    participant DB as MongoDB

    Admin->>SPA: POST credentials to /admin/login
    SPA->>SPA: Validate against VITE_ADMIN_* env vars
    SPA->>Storage: Write iska_admin_auth session
    SPA->>API: GET /api/logbook, /api/messages, /api/feedback
    API->>DB: Query collections
    DB-->>API: Results
    API-->>SPA: JSON response

    loop Auto-refresh (15s – 5m polling)
        SPA->>API: GET endpoints
        API->>DB: Query
        API-->>SPA: Updated data
    end
```

> **Note:** Admin authentication is client-side only. The API has no server-side auth middleware.

---

## API Endpoints

| Prefix | Method | Path | Purpose |
|--------|--------|------|---------|
| Health | `GET` | `/api/health` | Service health check |
| Logbook | `POST` | `/api/logbook` | Create visitor entry |
| Logbook | `GET` | `/api/logbook` | List entries (paginated) |
| Logbook | `GET` | `/api/logbook/stats/summary` | Dashboard statistics |
| Logbook | `GET` | `/api/logbook/:id` | Get single entry |
| Logbook | `PATCH` | `/api/logbook/:id` | Update entry |
| Logbook | `PATCH` | `/api/logbook/:id/timeout` | Record session end time |
| Logbook | `DELETE` | `/api/logbook/:id` | Delete entry |
| Messages | `POST` | `/api/messages` | Submit contact message |
| Messages | `GET` | `/api/messages` | List messages |
| Messages | `GET` | `/api/messages/unread-count` | Unread count |
| Messages | `GET` | `/api/messages/:id` | Get single message |
| Messages | `PATCH` | `/api/messages/:id` | Update (e.g. mark read) |
| Messages | `DELETE` | `/api/messages/:id` | Delete message |
| Feedback | `POST` | `/api/feedback` | Submit tour feedback |
| Feedback | `GET` | `/api/feedback` | List feedback |
| Feedback | `GET` | `/api/feedback/unread-count` | Unread count |
| Feedback | `GET` | `/api/feedback/stats/summary` | Rating statistics |
| Feedback | `GET` | `/api/feedback/:id` | Get single feedback |
| Feedback | `PATCH` | `/api/feedback/:id` | Update feedback |
| Feedback | `DELETE` | `/api/feedback/:id` | Delete feedback |

**Default base URL (development):** `http://localhost:5000/api`

---

## Ports & Protocols

| Connection | Protocol | Endpoint |
|------------|----------|----------|
| Browser → Frontend | HTTPS | Vercel CDN (prod) or `localhost:5173` (dev) |
| Browser → Backend API | HTTP(S) REST | `localhost:5000/api/*` (configurable via `VITE_API_BASE_URL`) |
| Backend → MongoDB | MongoDB wire | `localhost:27017` (local) or Atlas `mongodb+srv://` |
| Browser → YouTube | HTTPS (iframe) | `youtube.com/embed/...` |
| Browser → Google Fonts | HTTPS | `fonts.googleapis.com` |
| Browser → VIVERSE | HTTPS | VIVERSE platform APIs (when `VITE_VIVERSE_APP_ID` is set) |
| Browser → Vercel Analytics | HTTPS | Vercel telemetry endpoints |

---

## Environment Variables

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Backend API base URL. Default: `http://localhost:5000/api` |
| `VITE_VIVERSE_APP_ID` | No | HTC VIVERSE app ID for production 3D features |
| `VITE_ADMIN_USERNAME` | Prod only | Admin dashboard username |
| `VITE_ADMIN_PASSWORD` | Prod only | Admin dashboard password |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | HTTP listen port. Default: `5000` |
| `MONGODB_URI` | No | MongoDB connection string. Default: `mongodb://localhost:27017/iska-vt` |
| `NODE_ENV` | No | `development` or `production` (affects error detail in 500 responses) |

---

## Static Asset Delivery

All 3D models, audio, and images are bundled with the frontend — no separate object storage (S3, Cloudinary, etc.).

| Asset Type | Path | Examples |
|------------|------|----------|
| 3D models | `client/public/models/` | `PUP_CAMPUS.glb`, `avatars/Iska.vrm` |
| Audio | `client/public/audio/` | `welcome.mp3`, `arrived.mp3`, `teleported.mp3` |
| Images | `client/public/images/` | Campus map, building photos, FAQ screenshots |

---

## External Service Dependencies

| Service | Used For | Network Required |
|---------|----------|------------------|
| MongoDB | Persistent data (logbook, messages, feedback) | Yes — backend only |
| Google Fonts | Inter typeface | Yes — on page load |
| YouTube | Embedded campus/hymn videos | Yes — iframe embed |
| HTC VIVERSE SDK | 3D physics, locomotion, avatars | Optional — when app ID configured |
| Vercel Analytics | Usage telemetry | Yes — in production |
| Web Speech API | FAQ / marketing text-to-speech | No — browser-native |

---

## Development vs Production

```mermaid
flowchart TB
    subgraph Dev["Development"]
        DevBrowser["Browser<br/>localhost:5173"]
        DevAPI["Express<br/>localhost:5000"]
        DevDB[("MongoDB<br/>localhost:27017")]
        DevBrowser --> DevAPI --> DevDB
    end

    subgraph Prod["Production (inferred)"]
        ProdBrowser["Browser"]
        VercelCDN["Vercel CDN<br/>Static SPA + assets"]
        ProdAPI["Express API<br/>(host TBD)"]
        Atlas[("MongoDB Atlas<br/>mongodb+srv://")]
        ProdBrowser --> VercelCDN
        ProdBrowser -->|"VITE_API_BASE_URL"| ProdAPI --> Atlas
    end
```

| Aspect | Development | Production |
|--------|-------------|------------|
| Frontend | `npm run dev` → Vite `:5173` | Vercel (SPA rewrites via `vercel.json`) |
| Backend | `npm run dev` → Express `:5000` | Deployment target not configured in repo |
| Database | Local MongoDB `:27017` | Likely MongoDB Atlas |
| API URL | `http://localhost:5000/api` | Set at build time via `VITE_API_BASE_URL` |
| Admin auth | Fallback `admin` / `iska-admin` | Requires `VITE_ADMIN_*` env vars |

---

## Security Considerations

| Area | Current State | Recommendation |
|------|---------------|----------------|
| API authentication | None — all endpoints are public | Add server-side auth for admin CRUD operations |
| Admin login | Client-side only (`VITE_ADMIN_*` bundled in JS) | Move to server-side session/JWT auth |
| CORS | Open (`cors()` with default settings) | Restrict to known frontend origins in production |
| Credentials in frontend | `VITE_*` vars are visible in built bundle | Never store secrets in `VITE_` variables |

---

## What Is Not Used

The following are **not** part of the current network architecture:

- WebSockets / Socket.IO (dependency exists in `package.json` but is unused)
- Server-Sent Events (SSE)
- Cloud storage (S3, Cloudinary)
- Third-party TTS APIs (ElevenLabs, etc.)
- OAuth / SSO providers
- Redis, Postgres, or other databases
- Docker / nginx / reverse proxy configs
- CI/CD pipelines

Real-time admin updates use **HTTP polling** (`setInterval` at 15s–5m intervals), not persistent connections.
