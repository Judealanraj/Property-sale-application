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
  series = [60, 40],
  labels = ["A", "B"],
  colors,
  height = 200,
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
      enabled: true,
      formatter: function (val: number) {
        return `${val}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function (w: any) {
                const sum = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return sum;
              },
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
    <Box bgcolor="background.paper" p={2} borderRadius={1}>
      <Stack spacing={1} alignItems="stretch">
        <Chart options={options} series={series} type="donut" height={height} />
      </Stack>
    </Box>
  );
};

export default PieChart;
