import React, { Component, useEffect, useState } from "react";
import Chart from "react-apexcharts";

const BarChart = (props) => {
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
    <Chart
      options={chart.chartOptions}
      series={chart.chartData}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};

export default BarChart;
