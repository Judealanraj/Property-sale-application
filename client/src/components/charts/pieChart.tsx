import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import Chart from "react-apexcharts";

type PieChartProps = {
  title?: string;
  series?: number[];
  labels?: string[];
  colors?: string[];
  height?: number | string;
};

const PieChart: React.FC<PieChartProps> = ({
  series,
  labels,
  colors,
  height,
}) => {
  const options = {
    chart: {
      type: "donut",
    },
    labels,
    colors,
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: false,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 180,
          },
        },
      },
    ],
  } as any;

  return (
    <Box
      sx={{
        width: "100%",
        p: 0,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Stack spacing={0} alignItems="center">
        <Chart options={options} series={series} type="donut" height={height} />
      </Stack>
    </Box>
  );
};

export default PieChart;
