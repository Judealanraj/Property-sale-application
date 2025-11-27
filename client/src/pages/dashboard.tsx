import React from "react";
import { Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material";
import {
  PieChart,
  PropertyReferals,
  TotalRevenue,
  PropertyCard,
  TopAgents,
} from "../components";


const Dashboard: React.FC = () => {
  const cards = [
    {
      title: "Property For Sale",
      data: {
        series: [70, 30],
        labels: ["Sold", "For Sale"],
        colors: ["#1976d2", "#90caf9"],
      },
    },
    {
      title: "Property For Rent",
      data: {
        series: [45, 55],
        labels: ["Rented", "For Rent"],
        colors: ["#388e3c", "#a5d6a7"],
      },
    },
    {
      title: "Total Customers",
      data: {
        series: [80, 20],
        labels: ["Active", "Inactive"],
        colors: ["#f57c00", "#ffcc80"],
      },
    },
    {
      title: "Property For Client",
      data: {
        series: [25, 75],
        labels: ["Owned", "Client"],
        colors: ["#8e24aa", "#ce93d8"],
      },
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={6}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: "100%", maxWidth: 240, margin: "0 auto" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  p: 0.5,
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 0 }}>
                  {card.title}
                </Typography>
                <PieChart
                  series={card.data.series}
                  labels={card.data.labels}
                  colors={card.data.colors}
                  height={110}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    <Stack direction="row" spacing={2}>
        <Box flex={1} display="flex" flexDirection="column" gap={1}>
          <PieChart />
          <PropertyReferals />
          <TotalRevenue />
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
