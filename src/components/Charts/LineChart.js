import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { lineChartData, lineChartOptions } from "variables/charts";

const LineChart = (props) => {
  const { chartData, chartOptions } = props;
  const [chart, setChart] = useState({
    chartData: [],
    chartOptions: {},
  });
  useEffect(() => {
    setChart({
      ...chart,
      chartData,
      chartOptions,
    });
  }, [chartData, chartOptions]);

  return (
    <ReactApexChart
      options={chart.chartOptions}
      series={chart.chartData}
      type="area"
      width="100%"
      height="100%"
    />
  );
}

export default LineChart;
