# Sanjuli Site — Firebase Google Sign-In

Minimal Node.js site (Express) serving a static `index.html` that implements Google Sign-In using Firebase Web SDK.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run in development (requires `nodemon`)

```bash
npm run dev
```

3. Open http://localhost:3000 and click "Sign in with Google".

Notes
- Ensure `http://localhost:3000` (or your host) is added to your Firebase project's authorized domains in the Authentication settings.
- The Firebase config is currently embedded in `public/firebase-client.js`. For production, consider using environment vars or a build-time injection and avoid committing sensitive values.
