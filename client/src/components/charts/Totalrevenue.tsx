import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import Chart from "react-apexcharts";
import { ArrowCircleDownRounded } from "@mui/icons-material";
import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";

const Totalrevenue = () => {
  return (
    <Box
      p={3}
      bgcolor="#FCFCFC"
      id="chart"
      sx={{ minWidth: { xs: "auto", md: 300 }, width: "100%" }}
      boxShadow="0px 0px 15px rgba(0, 0, 0, 0.05)"
      borderRadius="15px"
    >
      <Typography variant="h6" fontWeight={600}>
        Total Revenue
      </Typography>
      <Stack mt="20px" direction="row" alignItems="center" gap={2}>
        <ArrowCircleDownRounded sx={{ color: "#E57373", fontSize: 40 }} />
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            $236,535
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total revenue generated this month
          </Typography>
        </Stack>
      </Stack>
      <Box mt={3}>
        <Chart
          options={TotalRevenueOptions as any}
          series={TotalRevenueSeries}
          type="bar"
          height={200}
          width="100%"
        />
      </Box>
    </Box>
  );
};

export default Totalrevenue;
