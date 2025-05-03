// Register the plugin to all charts
Chart.register(ChartDataLabels);

// setup with attributes
const charts = document.querySelectorAll("[data-chart]");

//console.log(charts);

charts.forEach((chart) => {
  const chartId = chart.getAttribute("data-chart");
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

  // Initialize Chart.js
  const ctx = document
    .getElementById(chartId)
    .querySelector("canvas")
    .getContext("2d");

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

    // Create dataset object
    datasets.push({
      label: numDatasets > 1 ? `${chartTitle} ${i + 1}` : chartTitle,
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
            return context.chart.config.type.toLowerCase() === "pie";
          },
          color: "#fff",
          font: {
            weight: "bold",
            size: 14,
          },
          formatter: function (value) {
            return value + "%";
          },
          anchor: "center",
          align: "center",
          offset: 0,
        },
        legend: {
          position: function (context) {
            const type = context.chart.config.type.toLowerCase();
            return type === "pie" ? "right" : "top";
          },
          labels: {
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `${value}%`;
            },
          },
        },
      },
    },
  });
});
