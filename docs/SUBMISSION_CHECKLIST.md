# Submission checklist

## Local verification

- [ ] Run `npm ci`.
- [ ] Run `npm audit --audit-level=high`.
- [ ] Run `npm run verify`.
- [ ] Confirm all 31 tests pass.
- [ ] Run `npm run repo:check`.
- [ ] Confirm `git status` is clean.

## GitHub

- [ ] Create a public repository without auto-generated starter files.
- [ ] Push only the `main` branch.
- [ ] Confirm `node_modules`, `dist`, `.env` and secrets are not tracked.
- [ ] Confirm the GitHub Actions workflow passes.
- [ ] Confirm repository size remains below 10 MB.

## Deployment

- [ ] Import the repository into Vercel.
- [ ] Confirm framework preset is Vite.
- [ ] Use `npm run build` and output directory `dist`.
- [ ] Do not configure environment variables.
- [ ] Open the deployment in an incognito browser.
- [ ] Confirm the base URL opens onboarding.
- [ ] Confirm `?demo=1` opens the populated dashboard directly.
- [ ] Confirm the fictional sample-data banner is visible.
- [ ] Test **Start with my own data** from the sample banner.
- [ ] Test **Explore with sample data** from onboarding.
- [ ] Confirm the seven-day chart and previous-week comparison appear.
- [ ] Commit to one recommendation and mark the weekly action completed.
- [ ] Add one backdated activity and confirm it appears on the correct day.
- [ ] Test all four coach questions.
- [ ] Confirm the vegetarian demo has no red-meat simulator option.
- [ ] Test Methodology, refresh persistence and Reset.
- [ ] Test at a mobile viewport.

## LinkedIn

- [ ] Set the audience to **Anyone**.
- [ ] Include a dashboard screenshot or short demo video.
- [ ] Explain the persona and the decision engine.
- [ ] Mention explainability, seven-day progress, direct evaluator access, local-first privacy and 31 tests.
- [ ] Add the final GitHub and deployment links.
- [ ] Verify the post URL while logged out.

## Portal

- [ ] Open all three links while logged out.
- [ ] Confirm the deployed application points to the latest commit.
- [ ] Use an attempt only after all fields are public and stable.
