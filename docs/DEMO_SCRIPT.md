# 75-second demo script

## 0–9 seconds — Problem

“Most personal carbon calculators give one number and generic advice. CarbonCue shows the assumptions, tracks change over time and ranks actions around what the user can actually control.”

## 9–18 seconds — Persona setup

Show housing, household size, diet, budget and goal. Explain that these choices change recommendation ranking. For the evaluator path, click **Explore with sample data**.

## 18–31 seconds — Explain the footprint and progress

Show the category breakdown, confidence label and seven-day chart. Point out the previous-week comparison and the warning that incomplete logging can distort trends.

## 31–46 seconds — Dynamic coach

Ask:

- “What is my largest source?”
- “Give me one free action”
- “How reliable is this?”

Explain that responses are deterministic, inspectable and based on recorded activities—not an exposed LLM key.

## 46–61 seconds — Decision support

Open the top recommendation and its “Why this” rationale. Change the what-if scenario and repeat frequency. Mention that weekly calculations use only the latest seven-day activity window, preventing old history from inflating savings.

## 61–75 seconds — Engineering evidence

Mention:

- Date-aware browser-only storage
- No account, analytics or API secret
- Validation of untrusted stored data
- 29 automated tests
- Automated branch, tracked-file and repository-size checks
- axe-core accessibility checks
- Public React/TypeScript source and Vercel deployment
