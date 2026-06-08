# Security and privacy model

CarbonCue is a client-side educational application. It intentionally avoids collecting identity, precise location and account credentials.

## Data boundary

- Profile and activity data are stored in the current browser using `localStorage`.
- No application backend, analytics service or third-party AI API receives the data.
- Users can remove all saved data through the Reset control.

## Defensive controls

- Stored JSON is treated as untrusted and validated before use.
- Numeric inputs are bounded.
- The application does not render user-controlled HTML.
- No secrets or environment variables are required.
- Deployment headers restrict MIME sniffing and access to camera, microphone and geolocation.
- CI runs a high-severity dependency audit, automated tests and a production build.

## Scope limitation

CarbonCue is not certified carbon accounting, financial advice or an offset-verification service. Estimates are directional and disclose material assumptions.
