# Judges quick start

## Fastest evaluation path

1. Open the public deployment with `?demo=1`.
2. Confirm the **Sample workspace** banner states that the entries are fictional.
3. Review the total, category breakdown and seven-day comparison.
4. Ask **What is my largest source?** in the coach.
5. Expand the first recommendation to inspect its rationale.
6. Commit to the first recommendation, inspect the contextual nudge and mark the weekly action completed.
7. Change the scenario frequency and compare weekly and annual savings.
8. Open **Methodology** to inspect factors, sources and limitations.
9. Select **Start with my own data** to confirm the clean onboarding path.

## Suggested URLs

```text
Normal onboarding: https://YOUR_DEPLOYMENT.vercel.app/
Direct demo:       https://YOUR_DEPLOYMENT.vercel.app/?demo=1
Source:            https://github.com/YOUR_USERNAME/carboncue
```

## Engineering verification

```bash
npm ci
npm audit --audit-level=high
npm run verify
npm run repo:check
```

The application requires no account, backend, analytics service, API key or environment variable.
