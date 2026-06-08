# Release notes

## v1.2.0 — Evaluator access and repository integrity

- Added a direct `?demo=1` route for a zero-setup populated dashboard.
- Made direct-demo mode override stale browser state so evaluator links behave predictably.
- Added a visible fictional-data banner and one-click return to clean onboarding.
- Extracted sample-state generation from the application hook into a testable data module.
- Added repository checks for branch count, forbidden tracked files, tracked size, Git object size and working-tree cleanliness.
- Added a judge quick-start document and portal-field template.
- Added three regression tests for direct demo access, sample disclosure and demo-mode persistence.
- Increased the verified test suite from 26 to 29 tests.

## v1.1.0 — Time-aware tracking and weekly integrity

- Added an activity-date selector for backfilling recent entries.
- Added a seven-day footprint chart with previous-week comparison.
- Added active-day and per-active-day summaries.
- Added explicit warning that missing days are not zero-emission evidence.
- Expanded sample data to demonstrate two comparable weeks.
- Restricted weekly recommendations and scenarios to the latest seven-day activity window.
- Sorted the audit trail by activity date rather than insertion order.
- Switched date defaults from UTC to the browser’s local calendar date.
- Added seven regression tests for trend windows, local-date handling and weekly-normalization logic.
- Increased the verified test suite from 19 to 26 tests.
