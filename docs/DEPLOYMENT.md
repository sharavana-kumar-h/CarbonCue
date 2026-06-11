# Public deployment procedure

## 1. Create the GitHub repository

Create an empty public repository named `carboncue`. Do not initialize it with a README, licence or `.gitignore`, because those files already exist locally.

From the project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/carboncue.git
git push -u origin main
```

Verify on GitHub:

- Repository visibility is Public.
- `main` is the only branch.
- The Actions workflow passes.
- No `node_modules`, `dist` or secret file is present.

## 2. Deploy on Vercel

1. Sign in to Vercel with GitHub.
2. Select **Add New → Project**.
3. Import the public `carboncue` repository.
4. Confirm the framework preset is **Vite**.
5. Use build command `npm run build`.
6. Use output directory `dist`.
7. Add no environment variables.
8. Deploy.

The included `vercel.json` provides SPA routing and basic security headers.

## 3. Create the direct evaluator URL

Keep the normal deployment URL for first-time users. For judges and the LinkedIn post, append `?demo=1`:

```text
https://YOUR_DEPLOYMENT.vercel.app/?demo=1
```

This route opens the fictional two-week sample workspace immediately, even when stale personal state exists in the browser. A visible banner identifies the data as fictional and allows the evaluator to return to clean onboarding.

## 4. Validate the public deployment

Open the final URL in a logged-out/incognito browser and verify:

1. The base URL opens onboarding.
2. The `?demo=1` URL opens the populated dashboard directly.
3. The sample-workspace banner is visible and describes the data as fictional.
4. **Start with my own data** returns to onboarding.
5. The seven-day chart and previous-week comparison render.
6. The coach answers all four questions.
7. A recommendation can be committed as a weekly action and marked completed.
8. The simulator excludes irrelevant scenarios for the vegetarian demo profile.
9. Methodology opens and shows factor assumptions.
10. Refresh preserves the selected workspace locally.
11. Reset deletes the local state.
12. The mobile layout has no horizontal overflow.

## 5. Final pre-submission commands

```bash
npm ci
npm audit --audit-level=high
npm run verify
npm run repo:check
git status
git branch -a
git count-objects -vH
```
