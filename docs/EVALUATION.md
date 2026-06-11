# Evaluation map

## Code quality

- Domain types are centralized in `src/types`.
- Versioned emission data is separate from calculation logic.
- Calculation, trend, coach, scenario and recommendation engines are pure functions.
- Browser persistence is isolated behind a validating storage adapter.
- UI components are split by responsibility.
- The user goal is not decorative: it changes recommendation ranking. “Learn” favours stronger evidence, while “Track” favours easy repeatable actions.

## Security

- No backend, authentication or API secret is required.
- No unsafe HTML rendering is used.
- Numeric inputs have explicit range restrictions.
- Data loaded from `localStorage` is treated as untrusted and validated before use.
- No analytics, third-party font, advertising or location request is made.
- Vercel response headers disable MIME sniffing, geolocation, camera and microphone.
- `npm audit --audit-level=high` reports zero vulnerabilities at packaging time.

## Efficiency

- Static client-side deployment with no idle server workload.
- No charting, state-management or component-framework dependency.
- Production JavaScript is approximately 61.0 kB gzip at packaging time.
- Browser persistence prevents unnecessary network requests.

## Testing

Thirty-one automated tests cover:

- Vehicle occupancy allocation
- Shared household allocation
- Meal calculations
- Category summaries
- Diet-specific recommendation exclusions
- Housing-specific recommendation exclusions
- Red-meat recommendation eligibility
- Recommendation ordering
- Contextual transport and electricity scenarios
- Seven-day trend construction and previous-week comparison
- Date-boundary handling across months and years
- Prevention of historical activity inflating weekly savings
- Persona-incompatible scenario exclusion
- Corrupt and maliciously malformed stored data
- Onboarding structural accessibility
- Demo dashboard structural accessibility
- Dynamic coach interaction
- Evaluator demo flow
- Direct `?demo=1` routing over stale browser state
- Sample-workspace disclosure and clean exit
- Weekly action commitment, contextual nudges and completion tracking
- Validation of persisted weekly-action data

The UI suite uses Testing Library, user-event and axe-core. Browser-dependent colour contrast is still checked manually because jsdom does not calculate rendered contrast.

The GitHub Actions workflow runs dependency audit, tests, production build and repository-compliance checks on every push to `main`. The compliance script verifies the branch, forbidden tracked paths, tracked-source size, Git object size and working-tree cleanliness.

## Accessibility

- Semantic HTML and heading structure
- Keyboard-operable forms, disclosures and actions
- Visible focus indicators, including custom radio controls
- Labels, legends and live status text
- Proper progress-bar semantics for category shares
- Text values accompany visual category and seven-day trend bars
- Reduced-motion support
- Responsive layout
- Automated axe-core structural checks

## Smart assistant and decision logic

`src/engine/generateCoachResponse.ts` answers four contextual questions using the user’s recorded data:

- What should I do next?
- What is my largest source?
- Give me one free action
- How reliable is this?

`src/engine/rankRecommendations.ts` scores actions using estimated reduction, feasibility, profile match, confidence, cost, effort, budget compatibility and the user’s stated goal. Each visible recommendation includes a rationale so evaluators can inspect why it was selected.

`src/engine/scenarios.ts` generates scenarios from the profile and actual logged activities. A vegetarian user is not shown a red-meat scenario, and travel substitutions appear only when relevant travel exists.

The weekly action loop turns one recommendation into an explicit commitment. The dashboard then shows a category-specific nudge when relevant activity appears in the latest seven-day window and lets the user mark the action completed or skipped.

## Progress tracking

`src/engine/trends.ts` creates a seven-day footprint window, compares it against the previous seven days and reports active-day coverage. The interface explicitly warns that missing days are not assumed to be zero-emission days. Recommendation and scenario engines use only the latest recorded seven-day window so older history cannot inflate weekly savings.


## Evaluator access

The deployed `?demo=1` route provides a zero-setup path to the populated dashboard. It is deliberately transparent: a visible banner identifies all entries as fictional, and the evaluator can return to clean onboarding without hunting for reset controls.

## AI-assisted build process

`docs/AI_BUILD_JOURNEY.md` documents the prompt-driven build process, AI tools used, weaknesses discovered during iteration and how the product evolved from a generic calculator into an explainable behavioral-change prototype.
