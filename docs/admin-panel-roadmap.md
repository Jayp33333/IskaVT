# ISKA Admin Panel — Assessment & Improvement Roadmap

## Context
You asked for a full review of the Admin Panel (`/admin`) and Super Admin (`/super-admin`), with a phased improvement plan. Midway through, you asked for multi-agent collaboration, parallel QA, code review, testing, and implementation. Every finding below comes from reading the actual code: about 60 admin/super-admin frontend files, the services layer, and the whole Express/Mongoose backend. Three read-only review agents then checked the findings in parallel. Functionality, business logic, API contracts, and the maroon brand direction are all kept. Nothing is removed just to redesign.

**Stack:** React 19, Vite (rolldown), Tailwind v4, Recharts, react-router 7. The frontend lives in `client/src/features/admin` and is structured as `AdminProvider` (in `context/AdminContext.tsx`) composing hooks in `hooks/`. The backend is Express + Mongoose + JWT and is organized as routes → controllers → services.

---

## 1. Current System Assessment

### Strengths (keep these)
- Clean feature-folder layout. A typed services layer (`services/apiClient.ts` with `ApiError` and `buildQuery`). Small, focused components.
- Shared primitives already exist in `components/common/adminUi.tsx`: `AdminCard`, `AdminButton`, `AdminSearchInput`, `FilterPills`, `AdminPagination`, `AdminEmptyState`. Also `ModalShell` and `ConfirmDialog`.
- Responsive groundwork is in place:
  - a desktop sidebar plus a mobile bottom nav (`AdminSidebar`, `AdminMobileNav`)
  - table-to-card switching (`VisitorsTable`)
  - a list/detail split with a back bar (Messages, Feedback)
  - bottom-sheet modals on mobile
- Messages and Feedback have server-side search, read filter, and pagination, with debounced search input.
- Configurable auto-refresh, activity toasts, a notification "last seen" marker, and CSV/PDF export (CSV includes a BOM for Excel).
- The backend is layered, with `asyncHandler`, `HttpError`, and capped pagination (`utils/parsePagination.js`). Super-admin routes are role-guarded.

### Weaknesses at a glance
| Area | Problem |
|---|---|
| Security | Visitor, message, and feedback admin endpoints are **public**. There is stored XSS in the PDF export. 401 responses are never handled. |
| Data accuracy | "Total Visitors" actually shows this month. Trend arrows are fake. "Active Sessions" counts only 10 rows. Monthly/yearly charts only ever see 30 days of data. Timezone drift. |
| Consistency | Admin and Super Admin use two different visual languages. `#660B05` is hard-coded 141× while the theme token is `--color-maroon #800000`. Admin and public lists of destinations and visitor types differ. |
| Navigation | Tabs live in React state, so there are no URLs, no deep links, and refresh/back are broken. |
| Data management | Visitor search covers only the current page. No sorting, column filters, date ranges, or bulk actions. Export downloads the entire database to filter it in the browser. |
| Code | Messages and Feedback are about 90% duplicated (hooks, tabs, lists, services). The context re-renders everything. Dead credential code ships in the bundle. No tests, no code splitting. |

---

## 2. Roadmap
Each item gives **What / Why / How / Affected / Priority**.

### Phase 1 — Critical issues & quick improvements

**1.1 Lock down admin data endpoints** — Priority: **High (critical)**
- **What:** `backend/routes/logbookRoutes.js`, `messageRoutes.js`, and `feedbackRoutes.js` have no `authenticate`. Anyone can list every visitor's name and purpose, read contact emails, read stats, and PATCH or DELETE records.
- **Why:** This leaks personal data and allows data destruction. It's the biggest risk in the system.
- **How:** Add `authenticate, requireRole('admin','super_admin')` to every route except the five the public site uses:
  - `POST /logbook` (`LogbookFormDialog`)
  - `GET /logbook/:id` (`LogHistory`, `FeedbackNative`)
  - `PATCH /logbook/:id/timeout` (`useLogbookTimeout`, `LogHistory`)
  - `POST /feedback`
  - `POST /messages` (`useContactForm`)

  Keep `/:id/timeout` declared before `/:id`. Also keep `GET /settings/public` and `POST /auth/login` public. The keepalive `fetch` in `useLogbookTimeout.ts:17` sends no auth header, so the timeout route has to stay public. Optionally trim the public `GET /logbook/:id` to the fields the tour actually needs.
- **QA-confirmed attack chain:** public `GET /logbook` exposes every ID, then public `PATCH /logbook/:id` lets anyone overwrite `fullName` with script, and the next PDF export (1.2) runs that script with the admin's token. The same routes let anyone delete all records. That makes this item and 1.2 a single fix to ship together.
- **Also in this item:** an unauthenticated `POST /logbook` currently accepts any `date`, `timeIn`, or `timeOut`, which lets anyone back-date entries and skew stats. Ignore those fields on public creates and use the server time.
- **Affected:** the 3 route files and `logbookService.createEntry`. No client changes, because `apiClient` already sends the Bearer token.

**1.2 Fix stored XSS in PDF export and CSV formula injection** — **High**
- **What:** `utils/exporters/pdfExport.ts` interpolates `fullName`, `purpose`, and `destination` into `document.write` in a same-origin `window.open('')`. `csvExport.ts` doesn't neutralize cells that start with `= + - @`.
- **Why:** A visitor who types `<img src=x onerror=…>` into the public logbook form gets script running in the admin's origin. That script can read the JWT in sessionStorage. CSV cells can run formulas in Excel.
- **How:** Add an `escapeHtml()` that covers `& < > " '` and apply it to every cell and the title. Prefix risky CSV cells with `'`. Add unit tests for both.
- **Affected:** `pdfExport.ts`, `csvExport.ts`.

**1.3 Session expiry and 401 handling** — **High**
- **What:** The JWT lasts 7 days and is stored in sessionStorage. A 401 never logs the user out, so a disabled admin or an expired token leaves a broken UI. `authAPI.me()` exists but is never called.
- **How:**
  - Add a `setUnauthorizedHandler()` in `apiClient.ts`, following the same pattern as `setAuthTokenGetter`. On a 401 from an authenticated call, clear the session and redirect to `/admin/login` with a "Session expired" notice.
  - Validate the session with `/auth/me` when the admin shell mounts.
  - Check the JWT `exp` in `isAdminAuthenticated()`.
- **Affected:** `services/apiClient.ts`, `features/admin/utils/adminAuth.ts`, `AdminProtectedRoute`, `SuperAdminProtectedRoute`, `AdminLoginForm`.

**1.4 Make dashboard metrics truthful** — **High**
- **What:** In `StatsGrid.tsx`:
  - "Total Visitors" actually shows `monthCount`.
  - Every card has a hard-coded "↑ Increased" arrow.
  - "Active Sessions" counts entries with no `timeOut` among only the latest 10 entries.

  In `logbookStatsService.timelineAgg`, data covers only the last 30 days. Yet `VisitorsBarChart` offers Weekly (12 weeks), Monthly (12 months), and Yearly (all years). Those views show 30 days of data under a misleading label.
- **How:**
  - Rename the card to "This Month".
  - Have the backend return `activeCount` (timeOut null, timeIn today).
  - Have the backend return previous-period counts (yesterday / last week / last month, same-to-date) so the trends are real, and show "—" when there's no baseline.
  - Extend the timeline to match the chosen period, either through `?period=` or a 12-month and per-year aggregate.
- **Affected:** `StatsGrid.tsx`, `StatCard.tsx`, `VisitorsBarChart.tsx`, `utils/aggregateTimeline.ts`, `backend/services/logbookStatsService.js`, the `LogbookStatsSummary` type in `logbookApi.ts`.

**1.5 Timezone-correct statistics** — **High**
- **What:** Day, week, and month boundaries use server-local midnight. `$dateToString`, `$hour`, and `$dayOfWeek` run in UTC. If the backend is hosted in UTC (e.g., Vercel), "Today" and the daily buckets are shifted 8 hours for users in the Philippines. Separately, the client parses `"YYYY-MM-DD"` with `new Date()`, which treats it as UTC midnight.
- **How:** Add an `APP_TIMEZONE` env var (default `Asia/Manila`). Compute boundaries in that zone, pass `timezone` to the Mongo date operators, and parse date keys as local dates on the client.
- **Affected:** `logbookStatsService.js`, `aggregateTimeline.ts`.

**1.6 One source of truth for destinations and visitor types** — **Medium-High**
- **What:** The admin `constants.ts` lists "Lab 1", "Gymnasium", and "Parent". The public form uses names from `sampleData.DESTINATIONS` (e.g., "PUP Gymnasium") and visitor types that include "Guest". As a result, the edit modal shows a blank select for real records, and admin-created entries add destinations that don't exist.
- **How:** Create a shared `client/src/constants/logbookOptions.ts` that derives destination names from `sampleData.DESTINATIONS` and defines one visitor-type list. Use it in both the public form and the admin forms. In edit mode, always include the record's current value as an option.
- **Affected:** `features/admin/constants.ts`, `AddVisitorModal`, `EditVisitorModal`, `components/Home/LogbookFormDialog.tsx`.

**1.7 Visitor form validation and date consistency** — **Medium**
- **What:** `EditVisitorModal` has no required-field validation (the backend returns a raw 400). It stores `date` as a full ISO string, while the Add form stores a date only. Neither form checks that `timeOut ≥ timeIn`.
- **How:** Add a shared `validateVisitorForm()`, following the pattern in `features/contact/utils/validateContactForm.ts`. Show inline field errors. Normalize dates with the existing but unused `toDateInputValue()` from `utils/time.ts`.
- **Affected:** `AddVisitorModal`, `EditVisitorModal`.

**1.8 Server-side visitor search and filters** — **Medium-High**
- **What:** `useVisitors.filteredVisitors` filters only the 200 rows currently loaded, so "Found N" is wrong.
- **How:**
  - `listEntries` accepts `search` (regex via the existing `escapeRegex`), `visitorType`, `destination`, `status=active|completed`, and `from`/`to`.
  - Whitelist `sortBy`.
  - Debounce input the same way `useMessages` does.
  - Lower the default page size to 25–50.
- **Affected:** `useVisitors.ts`, `VisitorsTab.tsx`, `logbookApi.ts`, `logbookController.js`, `logbookService.js`.

**1.9 Real identity and real help content** — **Low-Medium (quick)**
- **What:** `AccountDropdown` is hard-coded to "Admin / admin@iska.edu". `HelpModal` shows a placeholder email and phone and says export is PDF only.
- **How:** Read `getAdminSession()` for the username, email, and role. Put the contact details in config. Update the help copy to cover CSV, Messages, Feedback, and Settings.

**1.10 Remove dead or risky code and duplicate requests** — **Low (quick)**
- **What:**
  - `validateAdminCredentials` / `getExpectedCredentials` ship a dev default password in the bundle.
  - `isAdminAuthConfigured`, `CHART_COLORS`, and `LATEST_VISITOR_COLORS` overlap with `MODERN_CHART_PALETTE`.
  - `VisitorTypePieChart` is actually a bar chart.
  - Messages and Feedback load twice on first visit: the debounce effect fires, and `useAdminLifecycle`'s tab effect fires too.
- **How:** Delete the unused code and rename the chart to `VisitorTypeChart`. Pick a single owner for the initial load: either let the hook load when it's enabled, or drop the tab effect.

**1.11 Keyboard access for modals and dropdowns** — **Medium**
- **What:** `ModalShell`, `AdminDropdownPanel`, and `ExportDropdown` have no Escape-to-close, no focus trap or restore, and no `aria-labelledby`. Buttons are missing `type`.
- **How:** Fix it once in `ModalShell` and `AdminDropdownPanel` with an Escape handler, initial focus, focus restore, and `aria-labelledby`. Every modal inherits the fix.

**1.12 Admin reliability bugs (found by the frontend QA review)** — **High**
- **What, and how to fix each:**
  - **Error lock-out.** If loading fails at mount, `AdminPage.tsx:39-50` hides every tab behind the error. `refreshTick` never clears it and there's no Retry, so only a full page reload recovers. Fix: clear the error on any successful refresh and add a Retry button. 2.6 later makes this per-section.
  - **Spurious activity toast on every load.** `useAdminNotifications.ts:120-124` seeds the "known IDs" set before data arrives, so the first load fires "New visitor … (and N more)". Fix: seed the set only after the first non-empty load.
  - **Auto-refresh keeps restarting.** Unstable context deps restart the `useAutoRefresh` interval on every render, so refreshes slip while the admin is typing or using the page. Fix: make `onTick` stable via a ref. 4.4 fixes the underlying cause.
  - **Eager inbox fetch.** The Messages and Feedback hooks fetch 50 rows each about 250ms after mount, even on the Dashboard, then fetch again when the tab opens. Fix: gate the fetch on an `enabled` flag.
  - **Stale responses can win.** List and search calls don't drop out-of-order responses, so an older result can overwrite a newer search. Fix: use an `AbortController` or a request id in the `load*` functions.
  - **Wrong daily and weekly chart views.**
    - The daily view shows the last 7 days that had data, not the last 7 calendar days (`aggregateTimeline.ts:6`). Fix: fill missing days with 0.
    - Weekly buckets start on Sunday, but "This Week" starts on Monday. Fix: use Monday.
  - **Wrong default date in Add Visitor.** It uses `toISOString()`, so before 08:00 Manila time it defaults to yesterday. Fix: use a local date.
  - **Unhandled visitor paging.** Prev/next have no error handling and no loading state. Fix: add both. The Messages Refresh button also swallows errors; fix that too.
- **Affected:** `AdminPage`, `useAdminNotifications`, `useAutoRefresh`, `useMessages`, `useFeedback`, `useVisitors`, `aggregateTimeline`, `AddVisitorModal`, `VisitorsTab`, `MessagesTab`.

### Phase 2 — UI/UX redesign & usability

**2.1 URL-based navigation** — **High**
- **What:** `tab` is `useState` in `AdminContext`. Refresh resets to Dashboard, the back button leaves the admin, and there are no shareable links.
- **How:** Use nested routes: `/admin` (dashboard), `/admin/visitors`, `/admin/messages/:id?`, `/admin/feedback/:id?`. Store filters, page, and search in query params. `AdminProvider` becomes a layout route with `<Outlet/>`. Sidebar, mobile nav, notifications, and "View all" links switch to `<NavLink>`.
- **Affected:** `App.tsx`, `AdminPage`, `AdminSidebar`, `AdminMobileNav`, `NotificationsDropdown`, `EmailDropdown`, `LatestFeedbackList`, `LatestVisitorsList`, `useAdminLifecycle`.

**2.2 One admin shell with role-aware navigation** — **High**
- **What:** `SuperAdminPage.tsx` (499 lines, one component) uses the marketing site's neo-brutalist style (`border-ink`, `font-black uppercase`). The admin dashboard uses a soft maroon style. The two have separate shells and no way to move between them, even though the `/admin` login already accepts `super_admin`.
- **How:**
  - Add an "Administration" sidebar group (Admin Accounts, Site Settings) that shows only when `role === 'super_admin'`.
  - Split `SuperAdminPage` into `AdminAccountsPage` and `SiteSettingsPage` and rebuild both with the admin primitives.
  - Keep `/super-admin` and `/super-admin/login` as redirects.
  - Replace `window.confirm` with `ConfirmDialog`.
  - Login pages keep their brand style; that's intentional.

**2.3 Design tokens and a complete component kit** — **High**
- **What:** `#660B05` is hard-coded 141× in `features/admin`. That conflicts with the `--color-maroon: #800000` token in `index.css`. Corner radii are mixed (`rounded-lg` vs `rounded-xl`). Modal footers use raw `<button>`s. Input classes are copy-pasted across the Add, Edit, and Settings forms.
- **How:**
  - Add admin tokens to the Tailwind v4 `@theme` in `index.css`: `--color-admin-primary`, `-primary-hover`, `-surface`, `-border`, `-muted`. Pick one maroon.
  - Replace the arbitrary color values with the tokens.
  - Add the missing primitives to `adminUi.tsx`: `FormField` (label, hint, error), `AdminInput`, `AdminSelect`, `AdminTextarea`, `StatusBadge`, `IconButton`, `Skeleton`, `ErrorState` (with retry), and `DataTable` (sortable headers, sticky head, row actions, responsive card fallback).
  - Standardize on radius `xl` for cards and buttons and `lg` for small controls. Use a type scale of 11/12/14/16/20/24.

**2.4 Top bar clean-up** — **Medium**
- **What:** The Email dropdown and the Notifications dropdown both list messages. Notifications ignore feedback. Only Messages has a refresh control, and nothing shows how fresh the data is. Opening either dropdown triggers a full dashboard reload.
- **QA note:** clicking a message notification does open the message, because it's built from `recentMessages`. The real gap is visitor notifications: they only switch tabs and never point to the record.
- **How:**
  - Make one Notifications center covering visitors, messages, and feedback, with deep links from 2.1. The mail icon becomes a direct link to the Messages unread count.
  - Add a global "Updated 12s ago · Refresh" control.
  - Stop dropdowns from refetching everything.

**2.5 Data tables (Visitors first)** — **High**
- **How:**
  - Sortable columns using the backend `sortBy`.
  - A filter bar for type, destination, status, and date range.
  - "Showing 1–25 of 1,234", numbered pagination, and a page-size picker.
  - A Duration column.
  - A one-click **Check out** action for active rows, reusing the existing `PATCH /logbook/:id/timeout`.
  - Compact icon actions or a kebab menu.
  - An "Active" filter chip.
- **Affected:** `VisitorsTab`, `VisitorsTable`, `useVisitors`, plus the backend from 1.8.

**2.6 Loading, empty, and error states** — **Medium**
- **What:** `AdminPage` replaces all content with one spinner on load and one error banner on failure. `DashboardTab` returns `null` when there are no stats.
- **How:** Use per-section skeletons, an inline `ErrorState` with Retry for each widget or tab, and a stale-data banner instead of wiping the page.

**2.7 Toast system** — **Medium**
- **What:** There's one toast at a time, so activity toasts overwrite error toasts. There's no info variant and no `aria-live`.
- **How:** Queue up to 3 toasts. Support success, error, and info kinds. Add `role="status"`. Support an optional action button (e.g., Undo, see 3.6).
- **Affected:** `useToast.ts`, `Toast.tsx`.

**2.8 Forms and modals** — **Medium**
- **How:**
  - Merge the Add and Edit visitor modals into one `VisitorFormModal` (`mode: 'create' | 'edit'`).
  - Disable Save until the form changes.
  - Warn about unsaved changes on close.
  - Show field-level errors from the backend (see 4.8).

**2.9 Inbox UX (Messages & Feedback)** — **Medium**
- **How:**
  - Show counts on the filter pills ("Unread 4").
  - Add a rating filter for feedback.
  - Show the linked visitor in `FeedbackDetail` via `logbookEntryId`.
  - Highlight low-rating feedback.
  - Use one consistent unread indicator. Today, amber means "unread" in one place and "new today" in another.

**2.10 Responsiveness** — **Medium**
- **What:**
  - The fixed 272px sidebar starts at `md` (768px), which squeezes tablets.
  - On mobile, `PageHeader` stacks search, export, and add full-width above the content.
  - Weekly chart labels ("Jan 1 – Jan 7") are forced with `interval={0}` and crowd small screens.
  - Message panes nest scroll areas with `max-h-[70vh]`.
- **How:**
  - Collapse the sidebar to an icon rail at `md`–`lg` and show it in full at `xl`.
  - On mobile, move filters into a "Filters" bottom sheet.
  - Use short responsive chart labels and auto tick intervals.
  - Have a single scroll container per pane.

**2.11 Accessibility polish** — **Low-Medium**
- `aria-current` on the active nav item.
- Visible focus rings.
- Don't signal unread by color alone; add a text or icon cue.
- Raise `text-gray-400` on `gray-50` to an AA-compliant contrast.

### Phase 3 — New features & functionality

**3.1 Dashboard upgrade** — **High**
- **Use data the backend already returns but the UI ignores** (no backend work): `visitsByHour` (peak hours), `visitsByDayOfWeek` (busiest days), `avgDurationMinutes` plus `durationBuckets` (visit length).
- **"Needs attention" panel:** unread messages, unread feedback, feedback rated ≤2★, and stale active sessions (no time-out after more than 12h) with a one-click check-out.
- **Quick actions:** Add visitor, Export today, Open inbox.
- **Dashboard date-range selector:** Today / 7d / 30d / custom. Stats accept `from`/`to`, and Top Destinations and Visitor Types follow the range instead of always showing all time.
- **Feedback rating distribution** (1–5★ breakdown) and an average-rating trend. Extend `feedbackService.getStatsSummary`.
- **Combined recent-activity feed**, reusing `useAdminNotifications`' merged list.
- **Proposed layout:** a KPI row (5 cards) → Visitors trend (2/3 width) beside Needs attention (1/3) → Peak hours, Visitor types, and Top destinations → Latest visitors and Latest feedback.
- **Affected:** the `components/dashboard/*` files, `useDashboardData`, `logbookStatsService`, `feedbackService`.

**3.2 Server-side export with custom ranges** — **High**
- **What:** `fetchAllVisitors()` downloads every record 200 at a time and then filters by date in the browser. Only today, week, and month are available.
- **How:** Add `GET /logbook/export?format=csv&from&to&<filters>`, which streams CSV and honors the current table filters. Also allow a custom date range. PDF stays print-based, but it is built from the filtered server result. Add CSV export for Messages and Feedback.
- **Affected:** `ExportDropdown`, `VisitorsTab`, `exporters/*`, the logbook routes and controller.

**3.3 Bulk actions** — **Medium**
- Multi-select on visitors (check out, delete) and in the inboxes (mark read/unread, delete).
- Backend: `POST /<resource>/bulk { ids, action }`.

**3.4 Audit log** — **Medium**
- **Why:** Admins can permanently edit and delete records with no record of who did what.
- **How:** An `AuditLog` model (actor, action, resource, id, before/after summary, timestamp), written from the mutation services. A super-admin "Activity Log" page with filters.

**3.5 Role-based access** — **Medium**
- **How:**
  - Keep the two roles, but enforce them on the backend (1.1).
  - Add a frontend `useCan(permission)` helper so the UI hides actions a role can't perform.
  - Super admin gets an admin **password reset** (`PATCH /users/:id` already accepts `password`, but there's no UI), email editing, and a `lastLoginAt` field on `User`.
  - Admins can change their own password via `PATCH /auth/me/password`.
  - An optional read-only `viewer` role is **Low** and only worth adding if staff actually need it.

**3.6 Safer deletes** — **Low-Medium**
- Soft delete (`deletedAt`) for logbook, messages, and feedback, with an Undo toast. A 30-day purge is optional.

**3.7 Settings stored on the server** — **Low**
- Today, auto-refresh, alerts, and export format live in localStorage on each device. Store them per user instead.

**3.8 Live updates** — **Low / optional**
- Polling works fine. `socket.io-client` is installed but unused, and serverless hosting limits WebSockets. Revisit only if polling cost becomes a problem (see 4.3).

### Phase 4 — Performance, security & code quality

**4.1 Backend hardening** — **High**
- `helmet`.
- Restrict CORS to a `CLIENT_ORIGIN` env var. Today `cors()` allows any origin.
- `express-rate-limit` on `/auth/login` and on the public POSTs (logbook, messages, feedback spam).
- Return 401 for failed logins.
- Set a JSON body size limit.
- Whitelist `sortBy`.
- Add `maxlength` to the `Logbook` model fields (currently unlimited).
- Raise the password minimum from 6 to 8 characters.
- Shorten the JWT lifetime from 7d to about 12h.
- Add a `tokenVersion` on `User`, bumped on password reset, so old tokens stop working. Today a reset leaves existing tokens valid for up to 7 days.
- Run a dummy `bcrypt.compare` when the user doesn't exist, so response timing doesn't reveal valid usernames.
- Keep a missing `JWT_SECRET` as a 503 instead of letting it be caught and reported as a 401.
- Add a `maxlength` to `Message.email`.
- Stop echoing raw Mongoose validation messages; return mapped field `details` instead (4.8).
- Validate `logbookEntryId` on feedback so a visitor can't post feedback under another visitor's name. Low priority.
- Later, consider httpOnly cookie sessions.

**4.2 Database indexes** — **Medium**
- `Logbook` is sorted by `-createdAt` and filtered on `timeIn` and `timeOut`, but it only has indexes on `date` and `fullName`. Add `{createdAt:-1}`, `{timeIn:-1}`, and `{timeOut:1, timeIn:-1}`.

**4.3 Lighter polling and stats** — **Medium**
- **What:** Every refresh tick runs 9 aggregations, two of them full-collection scans, plus 4 list calls, whichever tab is open.
- **How:**
  - Combine the aggregations with `$facet`.
  - Cache the result in memory for 30–60s.
  - Fetch dashboard stats only on the Dashboard.
  - Add a lightweight `GET /admin/activity?since=` endpoint for badges and notifications.
  - Pause polling when `document.hidden`.

**4.4 Frontend server-state architecture** — **Medium**
- **What:** `AdminContext`'s `useMemo` depends on hook return objects that are recreated every render, so every `useAdmin()` consumer re-renders on any change.
- **How (incremental, no big rewrite):** Adopt **TanStack Query** one hook at a time, keeping the same hook APIs. It gives caching, deduplication, retries, background refetch, and invalidation after mutations. That replaces most of `useAdminLifecycle`, `useAutoRefresh`, and the ad-hoc `refreshAfterMutation`. UI state such as filters and selection moves to URL params (2.1) or small local state.

**4.5 Remove the Messages/Feedback duplication** — **Medium**
- **Frontend:** `useMessages` and `useFeedback`, `MessagesTab` and `FeedbackTab`, the List and ListItem and Toolbar components, and the delete-confirm flows are near-identical. Replace them with a generic `useInbox(api)` plus an `InboxLayout` component that takes render props for the item and detail views.
- **Backend:** `messageService` and `feedbackService` share the same `buildFilters`, list, unread, update, and delete logic. Replace them with a `createInboxService(Model, searchFields)`.
- **Helpers:** the repeated `formatDate`/`formatTime` helpers (`LatestFeedbackList`, `LatestVisitorsList`, `pdfExport`) move to `utils/format.ts`.

**4.6 Route-level code splitting** — **Medium**
- `App.tsx` imports every page eagerly. Public visitors download the admin bundle and Recharts, and admins download three.js. Use `React.lazy` with `Suspense` per route.

**4.7 Testing** — **Medium-High**
- **Baseline (checked by QA):** there are no tests, test scripts, or CI (no `.github/`) in either package. `tsc -p tsconfig.app.json --noEmit` passes with 0 errors. ESLint on the admin code reports 4× `react-refresh/only-export-components` (in `adminUi.tsx`, `chartShared.tsx`, `AdminSidebar.tsx`, `AdminContext.tsx`) and 1 `exhaustive-deps` warning (`VisitorTypePieChart.tsx:30`, where `raw` makes the memo recompute every render).
- Both lockfiles are committed: `package-lock.json` and `yarn.lock`, and `resolutions` suggests Yarn. Pick one and delete the other.
- The backend can't be tested as-is. `server.js` calls `connectDB()` (which runs `process.exit(1)` on failure) and `app.listen` on import, and exports nothing.
- **Recommended stack:**
  - Client: a separate `vitest.config.ts` (the PWA plugin and `git rev-parse` in `vite.config.ts` run on load) with jsdom and `@testing-library/react`.
  - Backend: `node:test` + supertest + `mongodb-memory-server`.
  - CI: a GitHub Actions workflow running lint, typecheck, and tests for both packages.
- **Client:** Vitest for the utils (`aggregateTimeline`, `dateRanges`, CSV/HTML escaping, validators) and React Testing Library for key flows.
- **Backend:** export `app` separately from `listen`, then use supertest with mongodb-memory-server. Write an **auth-matrix test** that checks every route, public or protected, so 1.1 can't regress.

**4.8 Error handling** — **Low-Medium**
- Many `.catch(() => {})` calls swallow errors from user actions such as pagination and opening a message. Show a toast for user-initiated actions. Keep silent failure only for background polling, and show a "last refresh failed" indicator there.
- The backend should return per-field `details` on validation errors so forms can map them to fields.

---

## 3. Multi-agent execution plan (after approval)
Work goes in dependency-ordered **waves**. Within a wave, independent workstreams run in parallel: each in its own git worktree session or isolated subagent, never two writers on the same files. Every workstream has to clear the same gate before merging:
1. implement
2. `npm run lint` and `tsc -b` in `client/`
3. tests for the change
4. a `/code-review` pass by a separate reviewer agent
5. a browser QA check of the affected screens at desktop, tablet, and mobile widths

| Wave | Parallel workstreams (disjoint files) | Depends on |
|---|---|---|
| **0 — Test harness** | A: split `backend/app.js` from `server.js`, add `node:test` + supertest + mongodb-memory-server, and write the auth-matrix test failing first. B: client `vitest.config.ts` + util tests, and fix the 4 existing lint errors. C: CI workflow and a single lockfile. | — |
| **1 — Critical fixes** | A: backend auth + public-create date stripping (1.1), hardening (4.1), stats timezone/activeCount/timeline (1.4 backend, 1.5), indexes (4.2). B: client exporters XSS/CSV (1.2). C: client session/401 (1.3) + identity/help (1.9) + dead code (1.10). D: shared logbook options + visitor form validation (1.6, 1.7). E: reliability bugs (1.12) in admin hooks, `AdminPage`, `aggregateTimeline`. Before starting, check that E's files don't overlap with C or D. If they do, run E after C. | Wave 0 |
| **2 — Foundations** | A: design tokens + component kit (2.3) + modal/dropdown a11y (1.11) + toast queue (2.7). B: URL routing (2.1) + code splitting (4.6). C: backend visitor search/filter/sort/export endpoints (1.8, 3.2 backend). | Wave 1 |
| **3 — Screens** | A: Visitors table + forms (2.5, 2.8, 1.8 client). B: generic inbox refactor + inbox UX (4.5, 2.9). C: dashboard truthful KPIs + new widgets (1.4 client, 3.1). D: unified shell + super-admin pages (2.2, 2.4). | Wave 2 |
| **4 — Features & polish** | Bulk actions (3.3), audit log (3.4), RBAC/password reset (3.5), loading/error states (2.6), responsive + a11y polish (2.10, 2.11), polling/stats perf (4.3), incremental TanStack Query (4.4). | Wave 3 |

**QA loop for each wave:** one QA agent runs the full test suite and an end-to-end browser pass in the built-in browser. It covers the public flows (logbook sign-in, tour time-out, native feedback, contact form) to confirm nothing public broke, plus each admin screen. A separate review agent reads the merged diff. Findings go back to the workstream that owns the code before the next wave starts. Each wave lands as one PR.

## 4. Verification
- **1.1:** `curl` without a token gets **401** on `GET/PATCH/DELETE /api/logbook*`, `/api/messages*`, and `/api/feedback*` (except the 5 public routes). The public flows still work in the browser. The supertest auth matrix is green.
- **1.2:** A visitor named `<img src=x onerror=alert(1)>` exports to PDF as literal text with no alert. A CSV cell `=1+1` opens as text.
- **1.3:** Changing the JWT or disabling the admin in Super Admin redirects to login with a notice on the next request.
- **1.4/1.5:** Seed data with `npm run seed:logbook`. Check that the KPI numbers match direct Mongo counts in Asia/Manila time. Check that the monthly and yearly charts span more than 30 days.
- **Every wave:** `client` lint and typecheck pass, the Vitest and supertest suites pass, and a browser QA pass happens at 375px, 768px, and 1440px.
- **First step on approval:** save this roadmap to `docs/admin-panel-roadmap.md` so the team can track it, then start Wave 0.
