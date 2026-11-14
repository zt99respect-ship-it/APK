# Project memory

## Product intent & audience

- App centered on KICK streaming platform integration: users link KICK accounts and receive notifications when streamers go live.
- Includes login, feed, and admin flows.
- Audience: viewers/fans of KICK streamers.

## Brand personality & voice

- Not yet inferred from available context.

## Visual design & UX direction

- Framework: Vite + React.
- No specific visual/UX direction inferred yet from this turn.

## Decisions, constraints & rationale

- **KICK linking:** currently username-only; full OAuth not yet implemented. Token exchange requires a client secret and therefore a server function — cannot be done browser-side.
- **Push notifications:** browser can register for notifications with a VAPID key, but sending pushes requires a server function. Firebase Cloud Messaging requires the paid Blaze plan.
- **Image uploads:** planned via ImgBB (API key not yet provided).
- **Backend services:** Firebase is the intended backend (config not yet provided). Supabase is already set up and available as an alternative for the two server functions.
- **Build status:** app builds successfully; Firebase integration pending credentials.
- Remaining unfinished features are blocked on secrets/credentials and a server-side decision, not on frontend code.

## Open questions & assumptions

- Firebase config values (API key, project ID, app ID, etc.) needed from user.
- ImgBB API key needed.
- Firebase Web Push VAPID key needed (if notifications are desired).
- Kick developer app client ID and client secret needed (if OAuth linking is desired).
- Server-side hosting decision pending: upgrade Firebase to Blaze plan vs. host the two functions on Supabase.
- Assumed Vite + React is the sole frontend stack; no additional frameworks inferred.