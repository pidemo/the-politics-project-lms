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

  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: chartTitle,
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 0,
        },
      ],
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
