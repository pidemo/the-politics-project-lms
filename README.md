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
- Confetti/celebration on completion milestones

### Required/Supported Selectors & Attributes

- Page metadata (on `<body>`):
  - `page-atid` (string id of current item)
  - `page-type` (e.g., `module`, `survey`)
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
  - Optional `target-success-text` to set label after completion
  - Optional `target-auto-complete` (truthy) on `#complete-module-button` to append `?auto-complete` to its href
- Quiz/Survey forms:
  - Form: `#quiz-form`; Submit button: `#quiz-submit`
  - Submit attributes: `target-type="quiz"|"survey"`, `target-atid`
  - Surveys add: `target-stage="start"|"end"`, `target-course-atid`
  - UI hooks: `#quiz-notification`, `#quiz-loader`
  - Quiz building:
    - Questions: `[data-question-atid]` with radio options found by `[data-parent-question-atid="QUESTION_ATID"]`
    - Options contain `.radio-group[data-option-tf]`, `.w-radio-input`, `data-option-atid`, `data-option-name`
    - Detailed answers use `.detailed-answer` (hidden on load, revealed on save)
    - Optional container `#quiz-options-wrapper` is removed once options are nested
  - Survey inputs: elements with `[data-input-name]` (names are applied automatically)
- Navigation helpers:
  - Prev/Next wrapper: `#prev-next` containing `[fs-cmsprevnext-element="next"] a`
  - Redirect notice: `#redirection-notification`
- Other hooks:
  - Course back links: elements with `[data-course-slug]` → href becomes `/courses/<slug>`
  - Page loader: `#page-loader` (removed once ready)
  - Survey gating: `#disabled-overlay[disabled-atid]` and `#form-wrapper`
  - Auto-complete button: `#module-complete-button` (clicked when `?auto-complete` is present)

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

### Webhooks

- Progress save: posts to a Make.com webhook with `memberATID`, `targetATID`, `targetType`
- Quiz/Survey submit: posts JSON payload to a Make.com webhook

Note: Replace webhook URLs with environment-specific values as needed.

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
