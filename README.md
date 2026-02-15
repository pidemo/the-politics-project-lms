# the-politics-project-lms

## LMS Client Script (index.js)

This client script powers the LMS behaviors across course/module pages. It initializes after Memberstack is ready and wires up progress tracking, prerequisites, quiz/survey submission, and navigation helpers.

### Prerequisites

- Memberstack present on the page; the script runs after `memberstack.ready`.
- Include the LMS client script (served via CDN):

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/index.min.js"
  type="text/javascript"
></script>
```

### Key Features

- Progress tracking with visual bars for `module` and `sub-module`
- Prerequisite gating (disables buttons/links until prerequisites are met)
- Quiz and survey form handling (validations, submission, success/error UI)
- Automatic next-item navigation and optional auto-complete
- Member progress sync via webhooks
- Confetti/celebration animations on completion milestones (regular and final course completion)
- Course completion celebrations with "Next Steps" section reveal
- Rich text link handling (auto-opens in new tabs)
- Course back link generation
- **Internationalization (i18n) support** for English and Welsh languages

### Internationalization (i18n)

The script supports bilingual text (English and Welsh) for all dynamically set text strings. Text can be customized via HTML attributes on specific elements, allowing content managers to update text without modifying JavaScript code.

#### How It Works

1. **Language Detection**: The script checks the `data-is-welsh` attribute on the `<body>` element:
   - If `data-is-welsh="true"`, Welsh text is used
   - Otherwise, English text is used

2. **Text Resolution Priority**:
   - **Priority 1**: Element attribute with language suffix (e.g., `text-saving-cy` for Welsh, `text-saving-en` for English)
   - **Priority 2**: Base element attribute (e.g., `text-saving`) for backward compatibility
   - **Priority 3**: Default text from JavaScript configuration object

3. **Where to Add Attributes**:
   - **Submit Button** (`#quiz-submit`): For button state text (initial text, saving, error)
   - **Notification Element** (`#quiz-notification`): For notification messages
   - **Any Button Element**: For final/success text after completion (`target-final-text-*`)

#### Text Strings Reference

All text strings that can be customized via attributes:

| Text String                         | Default English                                                                  | Default Welsh                                                                | Recommended Attribute Name                                      | Element Location                    |
| ----------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| **Submit Button - Initial Text**    | "Submit Answers & Finish Course" (end) / "Submit Answers & Start Course" (start) | "[CY] Submit Answers & Finish Course" / "[CY] Submit Answers & Start Course" | `text-initial` (for start stage) / `text-final` (for end stage) | `#quiz-submit`                      |
| **Submit Button - Saving**          | "Saving Answers..."                                                              | "[CY] Saving Answers..."                                                     | `text-saving`                                                   | `#quiz-submit`                      |
| **Submit Button - Error**           | "Error.."                                                                        | "[CY] Error.."                                                               | `text-error`                                                    | `#quiz-submit`                      |
| **Notification - Validation Error** | "Please fill out all required fields!"                                           | "[CY] Please fill out all required fields!"                                  | `text-validation-error`                                         | `#quiz-notification`                |
| **Notification - Redirecting**      | "You will be redirected shortly.."                                               | "[CY] You will be redirected shortly.."                                      | `text-redirect`                                                 | `#quiz-notification`                |
| **Notification - Success**          | "Answers saved successfully!"                                                    | "[CY] Answers saved successfully!"                                           | `text-success`                                                  | `#quiz-notification`                |
| **Notification - Save Error**       | "There was a problem saving your Answers.. Please try again!"                    | "[CY] There was a problem saving your Answers.. Please try again!"           | `text-error`                                                    | `#quiz-notification`                |
| **Button Final/Success Text**       | (from `target-final-text` attribute)                                             | (from `target-final-text` attribute)                                         | `target-final-text`                                             | Any button with `target-final-text` |

#### Attribute Naming Convention

For each text string, use the following pattern:

- **English**: `[attribute-name]-en` (e.g., `text-finish-en`)
- **Welsh**: `[attribute-name]-cy` (e.g., `text-finish-cy`)
- **Fallback**: `[attribute-name]` (e.g., `text-finish`) - used if language-specific attributes are not found

#### Examples

**Example 1: Customizing Submit Button Text**

```html
<!-- Submit button with custom English and Welsh text -->
<!-- Note: text-initial is used when target-stage="start", text-final when target-stage="end" -->
<button
  id="quiz-submit"
  target-stage="end"
  text-initial-en="Submit Answers & Start Course"
  text-initial-cy="Cyflwyno Atebion a Dechrau'r Cwrs"
  text-final-en="Submit Answers & Finish Course"
  text-final-cy="Cyflwyno Atebion a Gorffen y Cwrs"
  text-saving-en="Saving..."
  text-saving-cy="Arbed..."
  text-error-en="Oops! Try again"
  text-error-cy="Wps! Ceisiwch eto"
>
  Submit
</button>
```

**Example 2: Customizing Notification Messages**

```html
<!-- Notification element with custom messages -->
<div
  id="quiz-notification"
  text-validation-error-en="Please complete all fields"
  text-validation-error-cy="Cwblhewch yr holl feysydd"
  text-redirect-en="Redirecting..."
  text-redirect-cy="Ailgyfeirio..."
  text-success-en="All done!"
  text-success-cy="Wedi gorffen!"
  text-error-en="Something went wrong"
  text-error-cy="Aeth rhywbeth o'i le"
></div>
```

**Example 3: Customizing Button Final/Success Text**

```html
<!-- Button with custom final text for both languages -->
<button
  target-final-text-en="Completed ✓"
  target-final-text-cy="Wedi cwblhau ✓"
  target-atid="MODULE_123"
  target-type="module"
>
  Mark as Complete
</button>
```

#### Notes

- If you only provide the base attribute (e.g., `text-initial`), it will be used for both languages
- Submit button uses `text-initial` when `target-stage="start"` and `text-final` when `target-stage="end"`
- The `target-final-text` attribute replaces the older `target-success-text` attribute (which is still supported for backward compatibility)
- If you provide language-specific attributes, they take precedence over the base attribute
- The Welsh placeholders (`[CY]`) in the default text should be replaced with actual Welsh translations
- All text attributes are optional - if not provided, the script falls back to the default English/Welsh text defined in the JavaScript configuration

### Required/Supported Selectors & Attributes

- Page metadata (on `<body>`):
  - `page-atid` (string id of current item)
  - `page-type` (e.g., `module`, `survey`)
  - `data-is-welsh` (set to `"true"` for Welsh language pages - enables Welsh text strings)
- Member fields:
  - `#member-atid` (input containing current member ATID)
- Visual progress:
  - Wrapper: `[visual-progress-wrapper]` with `visual-progress-type="module"|"sub-module"`
  - Children: `[visual-progress="progress-bar"]`, `[visual-progress="percentage"]`, `[visual-progress="confetti"]`
  - Trackable items: `[data-progress="module"|"sub-module"]` with `id` matching target ATID; add class `is-complete` when completed
- Prerequisites:
  - Elements with `prerequisite-atid` and `prerequisite-type="module"|"sub-module"` (auto-disabled until the referenced item is complete)
- Completion/Tracking triggers:
  - Clickable elements with `[target-tracking="true"]`, and attributes `target-atid`, `target-type`
  - Optional `target-final-text` to set label after completion (supports `target-final-text-en` and `target-final-text-cy` for i18n)
  - Optional `target-success-text` (deprecated, use `target-final-text` instead) for backward compatibility
  - Optional `target-auto-complete` (truthy) on `#complete-module-button` to append `?auto-complete` to its href
- Quiz/Survey forms:
  - Form: `#quiz-form`; Submit button: `#quiz-submit`
  - Submit attributes: `target-type="quiz"|"survey"`, `target-atid`
  - Surveys add: `target-stage="start"|"end"`, `target-course-atid`
  - UI hooks: `#quiz-notification`, `#quiz-loader`
    - **i18n attributes on `#quiz-submit`**: `text-initial` (for `target-stage="start"`), `text-final` (for `target-stage="end"`), `text-saving`, `text-error` (with `-en`/`-cy` suffixes)
  - **i18n attributes on `#quiz-notification`**: `text-validation-error`, `text-redirect`, `text-success`, `text-error` (with `-en`/`-cy` suffixes)
  - Quiz building:
    - Questions: `[data-question-atid]` with radio options found by `[data-parent-question-atid="QUESTION_ATID"]`
    - Options contain `.radio-group[data-option-tf]`, `.w-radio-input`, `data-option-atid`, `data-option-name`
    - Detailed answers use `.detailed-answer` (hidden on load, revealed on save)
    - Optional container `#quiz-options-wrapper` is removed once options are nested
  - Survey inputs: elements with `[data-input-name]` (names are applied automatically)
- Navigation helpers:
  - Prev/Next wrapper: `#prev-next` containing `[fs-list-element="next-item"] a` (Finsweet Attributes v2)
  - Redirect notice: `#redirection-notification`
- Other hooks:
  - Course back links: elements with `[data-course-slug]` → href becomes `/courses/<slug>`
  - Page loader: `#page-loader` (removed once ready)
  - Survey gating: `#disabled-overlay[disabled-atid]` and `#form-wrapper`
  - Auto-complete button: `#module-complete-button` (clicked when `?auto-complete` is present)
  - Next Steps section: `#next-steps` (revealed on course completion with `?confettis` parameter)
  - Next Steps rich text: `#next-steps-rich-text` (links converted to buttons on course completion)
  - Rich text links: All links in `.rich-text` elements automatically open in new tabs with `rel="noopener noreferrer"`

### Behaviors

- On load (after Memberstack):
  - Reads `completed-modules` and `completed-submodules` from member custom fields and applies state (adds `is-complete`, disables buttons, sets success text)
  - Initializes visual progress, tracking triggers, prerequisites, prev/next navigation
  - Prepares quiz/survey forms and sets submit button text based on stage
  - Ensures rich-text links open in a new tab with `rel="noopener noreferrer"`
  - If URL contains `?auto-complete`, auto-clicks `#module-complete-button`
- On submit (quiz/survey):
  - Validates required fields, shows loader, disables button
  - Builds a formatted string and JSON payload (excluding internal fields) and posts to a webhook
  - On success: updates visual progress, shows notifications, reveals answers (quiz), auto-redirects (survey), enables prerequisites, updates prev/next
  - On error: shows error notification and resets UI state
- Navigation behavior:
  - Redirect notification (`#redirection-notification`) appears immediately when a redirect is confirmed (not after delay)
  - Navigation checks for next item link first, falls back to course breadcrumb link if no next item found
- Confetti animations:
  - Regular confetti (`confettis()`) fires on module completion and when `?confettis` parameter is present (non-course pages)
  - Final confetti (`finalConfettis()`) fires on course completion when `?confettis` parameter is present and URL contains `/courses/`
  - Final confetti includes cannon particles from left/right and top shower particles
- Course completion celebrations:
  - When `?confettis` parameter is present and page is in `/courses/` folder:
    - Converts rich text links in `#next-steps-rich-text` to button-styled links
    - Reveals `#next-steps` section
    - Triggers final confetti animation
- URL parameters:
  - `?auto-complete`: Automatically clicks `#module-complete-button` on page load
  - `?confettis`: Triggers confetti animation (regular for non-course pages, final for course pages)

### Webhooks

- Progress save: posts to a Make.com webhook with `memberATID`, `targetATID`, `targetType`
- Quiz/Survey submit: posts JSON payload to a Make.com webhook

Note: Replace webhook URLs with environment-specific values as needed.

---

# Additional Scripts

This section documents additional utility scripts that complement the main LMS functionality.

## final-confettis.js

Advanced confetti animation script for course completion celebrations. Provides a more elaborate confetti effect than the standard confetti used for module completion.

### Features

- **Cannon Particles**: 140 particles fired from left and right sides of the screen
- **Top Shower**: 80 particles falling from the top of the screen
- **Multiple Shapes**: Supports square, dot, and streamer particle shapes
- **Physics-Based Animation**: Realistic particle physics with gravity, wind, drag, and rotation
- **Brand Colors**: Uses custom brand colors (`#e63a11`, `#303D87`, `#3c405d`)

### Usage

The script is automatically called by `index.js` when:

- URL contains `?confettis` parameter
- Page URL includes `/courses/` (indicating a course completion page)

```javascript
// Called automatically by index.js
finalConfettis();
```

### Technical Details

- Total particles: 220 (140 cannon + 80 shower)
- Particle sizes: 5-12px for shower, 6-12px for cannon
- Animation duration: 3.2-4.6 seconds per particle
- Uses `requestAnimationFrame` for smooth 60fps animation
- Particles automatically clean up when off-screen or animation completes

### Integration

The script is integrated into `index.js` and fires automatically on course completion. No manual integration required if using the main LMS script.

## backlinks.js

Generates dynamic backlinks for related programmes and schemes of work based on CMS data.

### Features

- **Dynamic Link Generation**: Creates clickable links from comma-separated slugs and names
- **Template-Based**: Uses a template element to clone and create multiple links
- **Auto-Hide Empty**: Removes wrapper elements if no slugs or names are provided
- **Path Configuration**: Supports different base paths for different link types

### Usage

Include the script in your HTML:

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/backlinks.min.js"
  type="text/javascript"
></script>
```

### Required HTML Structure

**For Programmes:**

```html
<div id="related-programmes">
  <div class="backlinks-slugs">slug1,slug2,slug3</div>
  <div class="backlinks-names">Programme 1,Programme 2,Programme 3</div>
  <a class="tag is-hidden-onload" href="#">Template Link</a>
</div>
```

**For Schemes of Work:**

```html
<div id="related-schemes-of-work">
  <div class="backlinks-slugs">scheme1,scheme2</div>
  <div class="backlinks-names">Scheme 1,Scheme 2</div>
  <a class="tag is-hidden-onload" href="#">Template Link</a>
</div>
```

### Behavior

1. **Finds Wrapper**: Looks for `#related-programmes` or `#related-schemes-of-work`
2. **Reads Data**: Extracts slugs and names from `.backlinks-slugs` and `.backlinks-names` elements
3. **Validates**: Removes wrapper if slugs or names are empty
4. **Generates Links**: Clones template link for each slug/name pair
5. **Sets Href**: Sets href to `/{path}/{slug}` (e.g., `/lms-programmes/slug1`)
6. **Sets Text**: Sets link text to corresponding name
7. **Reveals**: Removes `is-hidden-onload` class from generated links and parent wrapper
8. **Cleans Up**: Removes template and data elements

### Paths

- **Programmes**: `/lms-programmes/{slug}`
- **Schemes of Work**: `/schemes-of-work/{slug}`

### Notes

- Slugs and names must be comma-separated and in the same order
- Template element must have `is-hidden-onload` class initially
- Parent wrapper will be hidden until links are generated
- Empty wrappers are automatically removed

## e-learning.js

Manages course status display and button text for e-learning courses based on member progress.

### Features

- **Course Status Detection**: Reads member's `completed-courses` and `started-courses` custom fields
- **Dynamic Button Text**: Updates button text based on course status
- **Status Badges**: Shows/hides status badges for "in-progress" and "completed" courses
- **Memberstack Integration**: Waits for Memberstack to be ready before executing

### Usage

Include the script in your HTML:

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/e-learning.min.js"
  type="text/javascript"
></script>
```

### Required HTML Structure

**For In-Progress Courses:**

```html
<div class="button-row">
  <div
    data-course-atid="COURSE_ATID"
    data-course-status="in-progress"
    class="is-hidden-onload"
  >
    <!-- Status badge or indicator -->
  </div>
  <div class="component-button-text">Start Course</div>
</div>
```

**For Completed Courses:**

```html
<div class="button-row">
  <div
    data-course-atid="COURSE_ATID"
    data-course-status="completed"
    class="is-hidden-onload"
  >
    <!-- Status badge or indicator -->
  </div>
  <div class="component-button-text">Start Course</div>
</div>
```

### Behavior

1. **Waits for Memberstack**: Ensures Memberstack is ready before executing
2. **Reads Member Data**: Gets `completed-courses` and `started-courses` from member custom fields
3. **Filters Started**: Finds courses that are started but not completed
4. **Updates In-Progress**: For each in-progress course:
   - Finds elements with matching `data-course-atid` and `data-course-status="in-progress"`
   - Removes `is-hidden-onload` class to reveal status badge
   - Updates button text to "Continue Learning"
5. **Updates Completed**: For each completed course:
   - Finds elements with matching `data-course-atid` and `data-course-status="completed"`
   - Removes `is-hidden-onload` class to reveal status badge
   - Updates button text to "Review Learnings"

### Text Strings

The script currently uses hardcoded English text:

- **In-Progress**: "Continue Learning"
- **Completed**: "Review Learnings"

**Note**: These strings are planned for internationalization (i18n) support in a future update to support English and Welsh languages, similar to the i18n implementation in `index.js`.

### Member Custom Fields

- `completed-courses`: Array of course ATIDs that are completed
- `started-courses`: Array of course ATIDs that have been started (may include completed)

## request-form.js

Handles form submission for request forms, posting data to a Make.com webhook and managing UI feedback.

### Features

- **Form Submission**: Collects form data and posts to webhook endpoint
- **Loading States**: Shows/hides loader during submission
- **Success/Error Handling**: Displays appropriate messages based on response
- **Target ATID Integration**: Automatically includes target ATID from page element
- **Response Validation**: Validates webhook response (expects "success" text)

### Usage

Include the script in your HTML:

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/request-form.min.js"
  type="text/javascript"
></script>
```

### Required HTML Structure

```html
<form id="request-form">
  <!-- Form fields -->
  <button id="request-submit">Submit Request</button>
</form>

<div id="request-loader" style="display: none;">Loading...</div>
<div id="request-success" style="display: none;">
  Request submitted successfully!
</div>
<div id="request-error" style="display: none;">
  There was an error submitting your request.
</div>
<div id="target-atid">TARGET_ATID_VALUE</div>
```

### Behavior

1. **Form Submission**: Listens for click on `#request-submit` button
2. **Prevents Default**: Prevents default form submission behavior
3. **Shows Loader**: Displays `#request-loader` during processing
4. **Collects Data**: Gathers all form field values via FormData
5. **Adds Target ATID**: Includes `target-atid` value from `#target-atid` element
6. **Posts to Webhook**: Sends JSON payload to Make.com webhook
7. **Handles Response**:
   - **Success**: Hides form, shows success message, updates button text to "Request Submitted!", disables button
   - **Error**: Shows error message, hides loader
8. **Response Validation**: Only accepts response with text content "success" (other responses treated as errors)

### Webhook

- **Endpoint**: `https://hook.eu2.make.com/b91v1unvfhepdkxnvo6mi784kliwlty3`
- **Method**: POST
- **Content-Type**: application/json
- **Expected Response**: Text "success" (200 status)

### Notes

- Webhook URL is hardcoded and should be updated for different environments
- Form is hidden on success (not reset)
- Button is disabled after successful submission
- Target ATID is automatically included from `#target-atid` element text content
- Response must be exactly "success" text to be considered successful

---

# Welsh Language & Weglot Integration Scripts

This section documents scripts that handle Welsh language support, Weglot translation integration, and Finsweet PrevNext link preprocessing for Welsh pages.

## Overview

The Welsh language integration consists of several scripts that work together:

- **welsh-attr.js**: Unified script for Weglot attribute setting and language redirection
- **redirect.js**: Standalone script for Welsh language redirection (alternative to welsh-attr.js)
- **notranslate.js**: Standalone script for applying Weglot bypass attributes (alternative to welsh-attr.js)
- **prevnext.js**: Pre-processes Finsweet PrevNext links for Welsh pages

## welsh-attr.js

Unified script that handles both Weglot attribute application and Welsh language redirection.

### Features

- **Bypass Attribute Application**: Finds all elements with `data-notranslate="true"` and applies `data-wg-notranslate` to prevent Weglot from translating them
- **Early Execution**: Applies bypass attributes on `DOMContentLoaded` (or immediately if DOM is ready) for better timing
- **Welsh Language Redirection**: Automatically switches to Welsh (`cy`) if `data-is-welsh="true"` is set on `<body>`
- **Error Handling**: Wrapped in try-catch blocks to prevent one function's failure from blocking the other
- **No-Redirect Support**: Skips language switch if URL contains `?noredirect` query parameter

### Usage

Include the script in your HTML:

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/welsh-attr.min.js"
  type="text/javascript"
></script>
```

### Required Attributes

- **On `<body>`**: `data-is-welsh="true"` (to trigger Welsh language switch)
- **On elements to exclude from translation**: `data-notranslate="true"` (will be converted to `data-wg-notranslate`)

### Behavior

1. **On DOM Ready**: Immediately applies `data-wg-notranslate` to all elements with `data-notranslate="true"`
2. **On Weglot Initialized**:
   - Re-applies bypass attributes (ensures they're set before translation)
   - Checks for `?noredirect` parameter
   - If `data-is-welsh="true"` and no `?noredirect`, switches to Welsh language
   - Ensures bypass attributes are set right before `Weglot.switchTo("cy")`

### Example

```html
<body data-is-welsh="true">
  <!-- This element will not be translated -->
  <div data-notranslate="true">Technical term that should stay in English</div>
</body>
```

## redirect.js

Standalone script for handling Welsh language redirection only. Use this if you want to separate redirection logic from attribute application.

### Features

- **Welsh Language Redirection**: Automatically switches to Welsh if `data-is-welsh="true"`
- **No-Redirect Support**: Skips language switch if URL contains `?noredirect` query parameter

### Usage

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/redirect.min.js"
  type="text/javascript"
></script>
```

## notranslate.js

Standalone script for applying Weglot bypass attributes only. Use this if you want to separate attribute logic from redirection.

### Features

- **Bypass Attribute Application**: Finds all elements with `data-notranslate="true"` and applies `data-wg-notranslate`
- **Early Execution**: Applies attributes on `DOMContentLoaded` for better timing

### Usage

```html
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/notranslate.min.js"
  type="text/javascript"
></script>
```

## prevnext.js

Pre-processes Finsweet Attributes CMS PrevNext links for Welsh pages by updating hrefs before Finsweet initializes.

### Purpose

On Welsh pages, Weglot adds a `/cy/` prefix to URLs. This script ensures that Prev/Next navigation links in the `#prev-next` container have the correct `/cy/` prefix before Finsweet Attributes processes them, preventing navigation issues on Welsh pages.

### Features

- **Link Pre-processing**: Updates hrefs for links with `data-wg-notranslate` (or inside elements with this attribute) to prefix with `/cy`
- **Always Initializes Finsweet**: Ensures Finsweet PrevNext is initialized regardless of whether links are found
- **Smart Link Detection**: Checks both the link element itself and parent elements for `data-wg-notranslate`
- **Safe URL Handling**: Skips external URLs, anchors, query strings, and URLs already prefixed with `/cy/`

### Prerequisites

- Finsweet Attributes v2 library loaded
- `fs-attributes-preventload="true"` attribute set in the head script to prevent auto-initialization
- `#prev-next` container with Prev/Next links

### Usage

Include the script before Finsweet Attributes initializes:

```html
<!-- In head -->
<script
  src="https://cdn.jsdelivr.net/gh/finsweet/attributes@2/attributes.js"
  fs-attributes-preventload="true"
></script>

<!-- Before closing body tag -->
<script
  src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/prevnext.min.js"
  type="text/javascript"
></script>
```

### How It Works

1. **DOM Ready**: Script waits for DOM to be ready
2. **Link Update**: Searches `#prev-next` for links with `data-wg-notranslate` (on link or parent)
3. **Href Modification**: Updates hrefs from `/course/xyz` to `/cy/course/xyz` (only for relative URLs starting with `/`)
4. **Finsweet Initialization**: Always calls `window.fsAttributes.init()` to initialize Finsweet PrevNext
5. **Callback Registration**: Registers callback with `window.FinsweetAttributes.push(['cmsprevnext', callback])` for logging

### Required HTML Structure

```html
<div id="prev-next">
  <!-- Links with data-wg-notranslate will be updated -->
  <div data-wg-notranslate>
    <a href="/course/module-1">Previous</a>
  </div>
  <div fs-list-element="next-item" data-wg-notranslate>
    <a href="/course/module-2">Next</a>
  </div>
</div>
```

### Behavior

- **If links found**: Updates hrefs, then initializes Finsweet
- **If no links found**: Still initializes Finsweet (prevents navigation from breaking)
- **Link detection**: Checks both `a[data-wg-notranslate]` and `a` inside `[data-wg-notranslate]` elements

### Console Logging

The script provides detailed console logging:

- `prevnext.js loaded` - Script loaded
- `prevnext.js: Found X links to update` - Links found and updated
- `prevnext.js: No links with data-wg-notranslate found - skipping link updates` - No links to update
- `prevnext.js: Called fsAttributes.init()` - Finsweet initialization called
- `prevnext.js: Finsweet CMS PrevNext initialized!` - Finsweet callback fired

### Notes

- Links must already exist in the HTML (Finsweet doesn't generate them)
- Only relative URLs starting with `/` are updated
- External URLs (`http://`, `https://`), anchors (`#`), and query strings (`?`) are skipped
- URLs already prefixed with `/cy/` are skipped
- The script always initializes Finsweet, even if no links need updating

---

# Chart Component Documentation

This component allows you to create dynamic charts using Chart.js with a simple data attribute configuration system.

## Prerequisites

- Chart.js library:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  ```

- Chart.js DataLabels plugin:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
  ```

- The Actual Script to render all charts:
  ```html
  <script
    src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/charts.min.js"
    type="text/javascript"
  ></script>
  ```

These 3 scripts are bundled into a "Chart Scripts" component in Webflow, so you don't need to worry about getting the latest version.

## Basic Install in Webflow

1. Add the "Chart Scripts" component on any page where you need to render one or more charts (anywhere, but preferably at the bottom of the page/DOM).
2. Add a "Chart Component" component wherever you need to add a chart on the page.
3. Set all the required component properties for the Chart Component, following the guidelines about attributes below.

## Data Attributes Reference

### Required Attributes:

- **Chart Title** (`chart-title`)
  - The title of your chart that will appear in the legend. (No quotation marks needed)

- **Chart Type** (`chart-type`)
  - The type of chart to render (e.g., 'pie', 'bar', 'line'). (No quotation marks needed)

- **[] Chart Labels** (`chart-labels`)
  - Labels for your data points.
  - Must be a valid JSON string array, like this: `["Monday", "Tuesday", "Wednesday"]`

- **[] Chart Data Points** (`chart-data-points`)
  - Numerical values for your chart.
  - Must be a valid JSON array of numbers.
  - For multiple bars per label, provide N × labels.length values, where N is the number of bars you want per label.

### Optional Attributes:

- **[] Chart Background Colors** (`chart-background-colors`)
  - Background colors for chart elements.
  - For multiple bars, you can provide one color per dataset.
  - If fewer colors than datasets are provided, colors will be reused.

- **[] Chart Border Colors** (`chart-border-colors`)
  - Border colors for chart elements.
  - For multiple bars, you can provide one color per dataset.
  - If fewer colors than datasets are provided, colors will be reused.

- **Show/Hide Legend** (`chart-show-legend`)
  - Set to `true` to show the chart legend, or `false` to hide it.
  - Example: `chart-show-legend="true"` or `chart-show-legend="false"`

- **Custom Units** (`chart-unit`)
  - A string to append to each value in tooltips and data labels (e.g., %, pts, €).
  - For pie charts, the unit will default to `%` unless you specify a different unit with this attribute.
  - Example: `chart-unit=%` or `chart-unit=pts`

- **Aria Label** (`chart-aria-label`)
  - Sets an accessible label for the chart's `<canvas>` element for screen readers.
  - Example: `chart-aria-label="Monthly Sales Bar Chart"`

- **Dataset Labels** (`chart-data-labels`)
  - A JSON array of strings to use as labels for each dataset (useful for grouped/multi-dataset charts).
  - Example: `chart-data-labels='["2022", "2023"]'`
  - If not provided, defaults to `Dataset 1`, `Dataset 2`, etc.

## Features

- Responsive charts that maintain aspect ratio
- Automatic data labels for pie charts (shows percentage or custom unit)
- Custom legend position:
  - For pie charts, the legend appears on the right and is vertically centered
  - For all other chart types, the legend appears at the bottom and is left-aligned
- Show or hide the legend with a single attribute
- Tooltip support showing percentage or custom unit values
- Flexible color customization
- Automatic multiple bars per label based on data points array length
- Accessible charts with ARIA labels
- Chart title is not displayed on the chart itself by default (legend and tooltips only)
- Automatic wrapping of long axis labels for better readability (max Length = 14 Characters)
- Global font set to OpenSans for all chart elements, with a size of 12px

## Example Usage

### Pie Chart

- chart-title: Distribution
- chart-type: pie
- chart-labels: ["Red", "Blue", "Yellow"]
- chart-data-points: [30, 50, 20]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]
- chart-show-legend: true
- chart-unit: %
- chart-aria-label: Distribution of Colors Pie Chart

### Simple Bar Chart (1 bar per label)

- chart-title: Monthly Sales
- chart-type: bar
- chart-labels: ["January", "February", "March"]
- chart-data-points: [65, 75, 85]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]
- chart-show-legend: false
- chart-unit: pts
- chart-aria-label: Monthly Sales Bar Chart

### Grouped Bar Chart (2 bars per label)

- chart-title: Sales Comparison
- chart-type: bar
- chart-labels: ["January", "February", "March"]
- chart-data-points: [65, 75, 85, 45, 55, 65] // First 3 numbers for first bars, last 3 for second bars
- chart-background-colors: ["#FF6384", "#36A2EB"] // One color per dataset
- chart-show-legend: true
- chart-unit: €
- chart-aria-label: Sales Comparison Bar Chart
- chart-data-labels: ["2022", "2023"]

### Triple Bar Chart (3 bars per label)

- chart-title: Three Year Comparison
- chart-type: bar
- chart-labels: ["Q1", "Q2", "Q3", "Q4"]
- chart-data-points: [65, 75, 85, 95, 45, 55, 65, 75, 35, 45, 55, 65] // 4 values × 3 datasets
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"] // One color per dataset
- chart-show-legend: true
- chart-unit: k
- chart-aria-label: Three Year Comparison Bar Chart
- chart-data-labels: ["2021", "2022", "2023"]

## Notes

- All JSON arrays must be properly formatted and enclosed in single quotes (except for numerical values)
- Percentage values in data points should add up to 100 for pie charts
- The component automatically adds the custom unit (or % for pie charts) to values in tooltips and data labels
- For pie charts, if you do not specify a unit, `%` will be used by default
- For multiple bars per label, ensure your data points array length is a multiple of your labels array length
- The number of bars per label is automatically determined by dividing data points length by labels length
- Use `chart-aria-label` to improve accessibility for screen readers
- Use `chart-show-legend` to control the display of the chart legend
- Use `chart-unit` to append a custom unit to all displayed values
- For grouped/multi-dataset charts, use `chart-data-labels` to set custom labels for each dataset
- For pie charts, the legend is on the right and vertically centered; for all other chart types, the legend is at the bottom and left-aligned
- The chart title is not displayed on the chart itself by default (only in the legend and tooltips)
- All charts use the OpenSans font globally, with a font size of 12px
- Long axis labels are automatically wrapped to a new line if they exceed 14 characters (you can adjust this in the code by changing the `labelMaxLength` constant)
