// Register the plugin to all charts
Chart.register(ChartDataLabels);

console.log("test running");

// setup with attributes
const charts = document.querySelectorAll("[chart-title]");

charts.forEach((chart) => {
  const chartTitle = chart.getAttribute("chart-title");
  const chartType = chart.getAttribute("chart-type");
  const labels = JSON.parse(chart.getAttribute("chart-labels"));
  const dataPoints = JSON.parse(chart.getAttribute("chart-data-points"));
  const backgroundColors = chart.getAttribute("chart-background-colors")
    ? JSON.parse(chart.getAttribute("chart-background-colors"))
    : [];
  const borderColors = chart.getAttribute("chart-border-colors")
    ? JSON.parse(chart.getAttribute("chart-border-colors"))
    : [];
  const showLegend = chart.getAttribute("chart-show-legend");
  const chartUnit = chart.getAttribute("chart-unit");
  const chartAriaLabel = chart.getAttribute("chart-aria-label");

  // Parse custom dataset labels if provided
  const datasetLabels = chart.getAttribute("chart-data-labels")
    ? JSON.parse(chart.getAttribute("chart-data-labels"))
    : [];

  // If pie chart and no unit specified, default to '%'
  let finalChartUnit = chartUnit;
  if (chartType && chartType.toLowerCase() === "pie" && !chartUnit) {
    finalChartUnit = "%";
  }

  // Set Aria Label for the canvas element
  const canvas = chart.querySelector("canvas");
  canvas.setAttribute("aria-label", chartAriaLabel);

  // Initialize Chart.js
  const ctx = chart.querySelector("canvas").getContext("2d");

  // Calculate number of datasets based on data points length
  const numDatasets = Math.floor(dataPoints.length / labels.length);

  // Create datasets array
  const datasets = [];
  for (let i = 0; i < numDatasets; i++) {
    // Extract data points for this dataset
    const start = i * labels.length;
    const end = start + labels.length;
    const datasetPoints = dataPoints.slice(start, end);

    // Handle colors differently for pie charts vs other types
    let backgroundColor, borderColor;
    if (chartType.toLowerCase() === "pie") {
      // For pie charts, use all colors for a single dataset
      backgroundColor = backgroundColors;
      borderColor = borderColors;
    } else {
      // For other chart types, use one color per dataset
      backgroundColor = backgroundColors[i] || backgroundColors[0] || "#000000";
      borderColor = borderColors[i] || borderColors[0] || "#000000";
    }

    // Set dataset label
    let datasetLabel;
    if (numDatasets === 1) {
      datasetLabel = chartTitle;
    } else if (datasetLabels && datasetLabels[i]) {
      datasetLabel = datasetLabels[i];
    } else {
      datasetLabel = `Dataset ${i + 1}`;
    }

    // Create dataset object
    datasets.push({
      label: datasetLabel,
      data: datasetPoints,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 0,
    });
  }

  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: function (context) {
            // Only apply to pie charts
            if (context.chart.config.type.toLowerCase() !== "pie") return false;
            const dataset = context.dataset.data;
            const value = context.dataset.data[context.dataIndex];
            const total = dataset.reduce((a, b) => a + b, 0);
            const percent = (value / total) * 100;
            return percent >= 6;
          },
          color: "#fff",
          font: {
            weight: "bold",
            size: 14,
            family: "var(--_typography---paragraph-body--font)",
          },
          formatter: function (value) {
            return value + finalChartUnit;
          },
          anchor: "center",
          align: "center",
          offset: 0,
        },
        legend: {
          display: showLegend === "true",
          position: function (context) {
            const type = context.chart.config.type.toLowerCase();
            return type === "pie" ? "right" : "bottom";
          },
          align: "start",
          labels: {
            padding: 20,
            position: "bottom",
            font: {
              size: 12,
              family: "var(--_typography---paragraph-body--font)",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `${value}${finalChartUnit}`;
            },
          },
        },
        title: {
          display: false,
          text: chartTitle,
        },
      },
    },
  });
});
