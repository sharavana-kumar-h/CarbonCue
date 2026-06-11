# CarbonCue

**Change what matters, not everything.**

CarbonCue is an explainable, local-first carbon footprint awareness platform built for PromptWars Virtual Main Challenge 3. It helps urban students and young professionals record everyday activities, understand what drives the estimate and choose actions ranked around impact, effort, cost and personal constraints.

> CarbonCue is an educational awareness tool. It is not a certified greenhouse-gas inventory, lifecycle assessment or offset certificate.

## Why this is not another generic calculator

Many footprint tools stop at a total and then show the same sustainability tips to everyone. That creates three weaknesses:

1. The assumptions behind the number are hidden.
2. Advice ignores constraints such as rented housing, a vegetarian diet or a free-only budget.
3. Broad estimates are presented with unjustified precision.

CarbonCue exposes its factors, labels uncertainty and uses inspectable decision logic instead of an uncontrolled chatbot.

## Chosen vertical and persona

- **Vertical:** Personal sustainability and carbon awareness
- **Persona:** Urban Indian students and young professionals

The persona may live in a hostel, PG, rented home or family home; use mixed transport; share electricity; and have limited money or control over infrastructure. Recommendations therefore prioritize controllable actions rather than expensive upgrades.

## Core experience

- Five-part persona setup: housing, household size, diet, budget and goal
- Date-aware transport, meal and electricity logging
- Seven-day footprint trend with previous-week comparison
- Category-level footprint breakdown
- High, medium and low confidence labels
- Dynamic coach answering four practical questions
- Weekly action commitment loop with contextual nudges and completion tracking
- Context-aware ranked actions with visible reasoning
- Personalized what-if scenarios normalized to the latest seven-day activity window
- Open methodology and source notes
- Browser-only persistence and delete-all-data control
- Evaluator-ready sample-data mode with a visible fictional-data notice
- Direct evaluator route using `?demo=1`
- Responsive, keyboard-accessible interface

## Dynamic coach

The coach answers:

- What should I do next?
- What is my largest source?
- Give me one free action
- How reliable is this?

Responses are generated from the recorded activities, category shares, estimate confidence and ranked recommendations. No external LLM, exposed API key or network request is required.

## Context-aware decision logic

Examples:

- Vegetarian and plant-based users do not receive red-meat reduction advice.
- Renters and hostel residents are not led with infrastructure purchases.
- Free-only users receive a ranking penalty on paid actions.
- “Learn” users favour recommendations with stronger evidence.
- “Track” users favour easy, repeatable actions.
- Car and cab kilometres in the latest recorded seven-day window unlock relevant substitution scenarios.
- Red-meat scenarios appear only for mixed-diet users who recorded red-meat meals.
- Shared electricity savings are allocated across the entered household size.
- Historical entries outside the latest seven-day window do not inflate weekly action estimates.
- A recommendation can be converted into a weekly commitment, then completed or skipped, so the behavior-change loop is visible instead of only advisory.

A simplified ranking model is:

```text
priority = saving × feasibility × profile match × confidence × budget match × goal match
           ------------------------------------------------------------------------------
                                      effort + cost penalty
```

## Calculation model

```text
estimated kg CO₂e = activity quantity × emission factor ÷ allocation
```

- Car and motorbike values are allocated across entered occupants.
- Shared electricity can be allocated across household members.
- Results are rounded to avoid false precision.
- Walking and cycling use zero direct operational emissions; lifecycle and food-energy effects are excluded and disclosed.

## Data sources and limitations

### Electricity

- Central Electricity Authority, Government of India, **CO₂ Baseline Database v21.0**.
- The app uses the FY 2024–25 weighted-average Indian grid factor of **0.710 kg CO₂/kWh**.

### Transport

- UK Department for Energy Security and Net Zero, **Government GHG Conversion Factors for Company Reporting 2025**.
- These are disclosed international proxies where a consistent India-specific personal-travel dataset was not used.
- Metro uses the light-rail/tram passenger-kilometre factor as a proxy.

### Food

- Broad meal estimates are informed by Poore and Nemecek, *Reducing food's environmental impacts through producers and consumers*, Science, 2018.
- Ingredients, serving size, farm, processing, cooking and waste can materially change meal results, so food estimates are marked medium or low confidence.

Sources:

- https://cea.nic.in/cdm-co2-baseline-database/?lang=en
- https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025
- https://www.science.org/doi/10.1126/science.aaq0216

## Technology

- React 18
- TypeScript
- Vite
- Native CSS
- `localStorage`
- Vitest
- Testing Library and user-event
- axe-core
- Lucide icons

No backend, authentication service, analytics SDK or external AI API is required.

## Project structure

```text
src/
├── components/       Accessible interface components
├── data/             Versioned factors and source metadata
├── engine/           Calculation, trend, coach, scenario and ranking logic
├── hooks/            Application-state orchestration
├── storage/          Validating browser-persistence adapter
├── tests/            Unit, UI, accessibility and storage tests
├── types/            Shared domain types
├── App.tsx
└── styles.css
```

## Run locally

Requirements: Node.js 22.x.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm audit --audit-level=high
npm run verify
npm run repo:check
```

The current suite contains **31 automated tests** across calculations, ranking, personalized scenarios, malformed persisted data, evaluator interactions and axe-core structural accessibility.

## Direct evaluator route

After deployment, append `?demo=1` to the public URL to open a populated fictional workspace immediately:

```text
https://YOUR_DEPLOYMENT.vercel.app/?demo=1
```

The direct route intentionally overrides stale browser state, labels the workspace as sample data and offers a one-click return to clean onboarding. The normal deployment URL continues to open the standard setup flow.

## Deploy to Vercel

1. Push this repository to a public GitHub repository using only the `main` branch.
2. Import the repository into Vercel.
3. Keep the framework preset as **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add no environment variables.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the complete public-validation process.

## Security and privacy

- No account, email or precise address required
- No API keys or secrets
- No user data sent to a server
- Stored browser data validated before use
- Bounded numeric inputs
- No unsafe HTML rendering
- No advertising or analytics tracker
- Local data deletion control
- Basic deployment security headers

See [`SECURITY.md`](SECURITY.md).

## Accessibility

- Semantic landmarks and headings
- Keyboard-operable forms, disclosures and actions
- Visible focus states, including custom radios
- Labels, legends and live status text
- Correct progress-bar semantics
- Text equivalents for visual category and seven-day trend bars
- Reduced-motion support
- Responsive layout
- Automated axe-core structural checks

## Known limitations

- Transport proxies are not India-fleet-specific.
- Meal entries are broad categories, not ingredient-level lifecycle assessments.
- Data is local to one browser and does not synchronize across devices.
- The current MVP evaluates recorded activities rather than producing a complete annual consumption inventory.
- Week-over-week comparisons depend on comparable logging completeness; missing days are not proof of zero emissions.
- Colour contrast requires browser-level manual verification because jsdom has no rendered layout.

## Evaluator resources

- [`docs/JUDGES_QUICKSTART.md`](docs/JUDGES_QUICKSTART.md) — fastest evaluator path
- [`docs/EVALUATION.md`](docs/EVALUATION.md) — scoring-area evidence map
- [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) — 75-second walkthrough
- [`docs/AI_BUILD_JOURNEY.md`](docs/AI_BUILD_JOURNEY.md) — prompt evolution, AI tool usage and build decisions
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — GitHub and Vercel procedure
- [`docs/SUBMISSION_CHECKLIST.md`](docs/SUBMISSION_CHECKLIST.md) — final gate
- [`docs/LINKEDIN_POST_TEMPLATE.md`](docs/LINKEDIN_POST_TEMPLATE.md) — public build post
- [`docs/CAPTURE_PLAN.md`](docs/CAPTURE_PLAN.md) — screenshot and demo evidence plan
- [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md) — version history
- [`docs/SUBMISSION_FIELDS.md`](docs/SUBMISSION_FIELDS.md) — portal-ready link template
