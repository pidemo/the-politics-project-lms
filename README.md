# the-politics-project-lms

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
    src="https://cdn.jsdelivr.net/gh/pidemo/the-politics-project-lms@main/index.min.js"
    type="text/javascript"
  ></script>
  ```

Those 3 scripts are all bundled into a "Chart Scripts" component in Webflow, so you don't need to worry about getting the latest version.

## Basic Install in Webflow

1. Add the "Chart Scripts" component on any page where you need to render one or more charts (anywhere, but preferably at the bottom of the page/DOM).
2. Add a "Chart Component" component wherever you need to add a chart on the page.
3. Set all the required component properties for the Chart Component, following the guidelines about attributes below.

## Data Attributes Reference

### Required Attributes:

- **Chart Title** (`chart-title`)

  - The title of your chart that will appear in the legend.

- **Chart Type** (`chart-type`)

  - The type of chart to render (e.g., 'pie', 'bar', 'line').

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

## Features

- Responsive charts that maintain aspect ratio
- Automatic data labels for pie charts (shows percentage)
- Customizable legend position (right for pie charts, top for other types)
- Tooltip support showing percentage values
- Flexible color customization
- Automatic multiple bars per label based on data points array length

## Example Usage

### Pie Chart

- chart-title: "Distribution"
- chart-type: "pie"
- chart-labels: ["Red", "Blue", "Yellow"]
- chart-data-points: [30, 50, 20]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]

### Simple Bar Chart (1 bar per label)

- chart-title: "Monthly Sales"
- chart-type: "bar"
- chart-labels: ["January", "February", "March"]
- chart-data-points: [65, 75, 85]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]

### Grouped Bar Chart (2 bars per label)

- chart-title: "Sales Comparison"
- chart-type: "bar"
- chart-labels: ["January", "February", "March"]
- chart-data-points: [65, 75, 85, 45, 55, 65] // First 3 numbers for first bars, last 3 for second bars
- chart-background-colors: ["#FF6384", "#36A2EB"] // One color per dataset

### Triple Bar Chart (3 bars per label)

- chart-title: "Three Year Comparison"
- chart-type: "bar"
- chart-labels: ["Q1", "Q2", "Q3", "Q4"]
- chart-data-points: [65, 75, 85, 95, 45, 55, 65, 75, 35, 45, 55, 65] // 4 values × 3 datasets
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"] // One color per dataset

## Notes

- All JSON arrays must be properly formatted and enclosed in single quotes (except for numerical values)
- Percentage values in data points should add up to 100 for pie charts
- The component automatically adds '%' to values in tooltips and data labels
- Data labels are only displayed on pie charts
- For multiple bars per label, ensure your data points array length is a multiple of your labels array length
- The number of bars per label is automatically determined by dividing data points length by labels length
- Dataset titles will be automatically numbered (e.g., "Sales 1", "Sales 2") when multiple datasets are detected
