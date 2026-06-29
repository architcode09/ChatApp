# ChatApp

This repository contains a chat application with:

- a Vite + React frontend in `frontend/`
- an Express backend in `backend/`
- a Docker-based deployment that serves the built frontend from the backend container

## Deployment Note: Render UI Not Loading

### Error Seen In Browser Console

```text
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html".
```

### What Was Happening

The Render deployment was live, but the UI showed a blank page because the browser was requesting the built Vite asset files from `/assets/...`.

Instead of returning the real JavaScript files, the backend was returning `index.html` for those requests. Because of that, the browser received HTML when it expected a JavaScript module and refused to load the app bundle.

### Root Cause

In `backend/src/index.js`, the backend had an SPA fallback route that sent `public/index.html` for all GET requests, but it was not serving the static files from the built frontend output first.

### Fix Applied

Added static asset serving in the backend before the catch-all route:

```js
app.use(express.static(publicDir));
```

This ensures:

- `/assets/*.js` and `/assets/*.css` return the real built files
- application routes still fall back to `index.html`

### Files Updated

- `backend/src/index.js`

### Result

After redeploying, the frontend assets should load correctly and the UI should render on Render instead of showing a blank page.


___________________________________________________________
we are using the free renderer plan so it will make our app inactive so for that we will send get requests to our app and make it active 
this can be implemented using the cron jobs package

## Deployment Note: `job is not defined`

### Error

```text
ReferenceError: job is not defined
```

### In Simple Words

The backend was trying to start a background cron job with `job.start()`, but the `job` variable was not imported into `backend/src/index.js`.

So the app could start the server, but it crashed right after that line because Node.js did not know what `job` meant.

### Fix Applied

- imported the cron job into `backend/src/index.js`
- fixed the cron helper in `backend/src/lib/cron.js`
- corrected the health check URL from `/health:` to `/health`

### Result

After redeploying, the backend should start normally and the keep-alive cron job should run without crashing the app.
