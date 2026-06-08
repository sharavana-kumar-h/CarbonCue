# LinkedIn post template

I built **CarbonCue** for PromptWars Virtual Main Challenge 3: Carbon Footprint Awareness Platform.

Most personal carbon calculators produce one number and then show generic advice. I wanted to address the harder problem: **which action is actually relevant for this user, and why?**

CarbonCue is an explainable carbon coach for urban students and young professionals. It considers housing, household size, diet, budget, personal goal and recorded activities before ranking actions.

What I implemented:

- Date-aware transport, meal and electricity tracking
- A seven-day progress view with previous-week comparison
- Confidence labels instead of false precision
- A dynamic coach for “largest source”, “next action”, “free action” and estimate reliability
- Personalized recommendations with a visible reasoning trail
- What-if scenarios generated from the user’s latest seven-day context
- Browser-only data storage with no account, analytics or exposed API key
- Validation of untrusted browser data
- 29 automated tests, including trend, direct-demo, repository-integrity and axe-core accessibility checks

One deliberate engineering choice was **not** to attach an LLM merely to make the product look intelligent. The decision engine is deterministic, testable and inspectable, so every recommendation can be traced to user context and disclosed assumptions.

Live demo: [ADD DEPLOYED LINK]/?demo=1

Start from scratch: [ADD DEPLOYED LINK]

Source code: [ADD GITHUB LINK]

#PromptWars #Sustainability #ClimateTech #ReactJS #TypeScript #Accessibility #BuildInPublic
