import React from "react";
import {
  PieChart,
  PropertyReferals,
  TotalRevenue,
  PropertyCard,
  TopAgents,
} from "../components";
import { Typography, Box, Stack } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>

      <Stack direction="row" spacing={2}>
        <Box flex={1} display="flex" flexDirection="column" gap={2}>
          <PieChart />

          <Box
            sx={{
              display: "flex",
              gap: 16,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box flex={1}>
              <PropertyReferals />
            </Box>
            <Box flex={1}>
              <TotalRevenue />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;
