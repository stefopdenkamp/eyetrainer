# Overhoren app

This is a SvelteKit project, with a SQLite database. It holds the front- and backend for an "eyetrainer" app.

## web routes

eytrainer
eytrainer/training
eyetrainer/settings

## api routes

GET /api/settings <br>
PATCH /api/words <br>

## data

### settings

{
    tbd
}

## database tables

- settings

### functionalities per page

## start page

1. The app has an openning page.
2. On the opening page is a start button in the middle of the screen and a settings button on the top right.
3. The start button opens the training page.
4. The settings button opens the settings page

## training page

1. The training page has 3 tabs (1 uri but looks like 3 pages): sunlight, tracking and zooming
2. On the sunlight page is only a checkbox in the middle with the text: Get sunlight
3. On the tracking page there is a countdown timer on the top and a box that span the rest of page.
4. There are 2 parts to the tracker. Moving and flashing.
4. For moving, as long as the timer runs down a ball bounces around the page (with the goal to track it with your eyes).
5. The time of the countdown timer and the speed of the balls movement is set with the settings.
6. Once the timer is down you automatically go to the 2nd part the flashing.
7. The same timer and box are used.
8. There is a ball showing and disappearing at random spots, but not too close to where the previous one was.
9. The timer, the duration of showing and pause in between flases is set in the settings.
10. Once that timer is done you go to the last part, zooming.
11. This is a random letter sequence per row (letters per row set in the settings) of letter arragened multiple times from top to bottom getting progressively smaller.
12. Next to one line I can put a marker via the settings.

## settings page

1. On the settings page you can edit the settings.

## Coding workflow
1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

    State your assumptions explicitly. If uncertain, ask.
    If multiple interpretations exist, present them - don't pick silently.
    If a simpler approach exists, say so. Push back when warranted.
    If something is unclear, stop. Name what's confusing. Ask.

2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

    No features beyond what was asked.
    No abstractions for single-use code.
    No "flexibility" or "configurability" that wasn't requested.
    No error handling for impossible scenarios.
    If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

    Don't "improve" adjacent code, comments, or formatting.
    Don't refactor things that aren't broken.
    Match existing style, even if you'd do it differently.
    If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

    Remove imports/variables/functions that YOUR changes made unused.
    Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.
4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

    "Add validation" → "Write tests for invalid inputs, then make them pass"
    "Fix the bug" → "Write a test that reproduces it, then make it pass"
    "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
