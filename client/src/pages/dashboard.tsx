import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart } from "../components";

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

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {card.title}
                </Typography>
                <PieChart
                  series={card.data.series}
                  labels={card.data.labels}
                  colors={card.data.colors}
                  height={180}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
