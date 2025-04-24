# the-politics-project-lms

# Chart Component Documentation

This component allows you to create dynamic charts using Chart.js with a simple data attribute configuration system.

## Prerequisites

- Chart.js library
- Chart.js DataLabels plugin

Make sure to include the following scripts for both those elements in the <head> of each page where charts will be used:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>

## Basic Setup

Add the following data attributes to your Chart Component to create a chart:

## Data Attributes Reference

### Required Attributes:

- **Chart ID** (`data-chart`): Unique identifier for the chart. Must be unique.
- **Chart Title** (`chart-title`): The title of your chart that will appear in the legend.
- **Chart Type** (`chart-type`): The type of chart to render (e.g., 'pie', 'bar', 'line').
- **[] Chart Labels** (`chart-labels`): Labels for your data points. Must be a valid JSON string array, like this: ["Monday", "Tuesday", "Wednesday"]
- **[] Chart Data Points** (`chart-data-points`): Numerical values for your chart. Must be a valid JSON array of numbers, like this: [12, 32, 31]

### Optional Attributes:

- **[] Chart Background Colors** (`chart-background-colors`): Background colors for chart elements. Must be a valid JSON array of color strings (hex, rgb, etc.), like this: ["#fff", "#ffb600", "#c1c1c1"]
- **[] Chart Border Colors** (`chart-border-colors`): Border colors for chart elements. Must be a valid JSON array of color strings (hex, rgb, etc.), like this: ["#fff", "#ffb600", "#c1c1c1"]

## Features

- Responsive charts that maintain aspect ratio
- Automatic data labels for pie charts (shows percentage)
- Customizable legend position (right for pie charts, top for other types)
- Tooltip support showing percentage values
- Flexible color customization

## Example Usage

### Pie Chart

### Pie Chart

- data-chart: "pie-chart"
- chart-title: "Distribution"
- chart-type: "pie"
- chart-labels: ["Red", "Blue", "Yellow"]
- chart-data-points: [30, 50, 20]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]

### Bar Chart

- data-chart: "bar-chart"
- chart-title: "Monthly Sales"
- chart-type: "bar"
- chart-labels: ["January", "February", "March"]
- chart-data-points: [65, 75, 85]
- chart-background-colors: ["#FF6384", "#36A2EB", "#FFCE56"]

## Notes

- All JSON arrays must be properly formatted and enclosed in single quotes (except for numerical values).
- Percentage values in data points should add up to 100 for pie charts
- The component automatically adds '%' to values in tooltips and data labels
- Data labels are only displayed on pie charts
- Each chart must have a unique `data-chart` identifier
