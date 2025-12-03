import React, { useState, useMemo } from "react";
import { Add, Search, Sort } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router";
import { PropertyCard, CustomButton } from "../components";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  photo: string;
  description: string;
}

const AllProperties = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | "none">("none");

  const { query } = useList<Property>({
    resource: "properties",
  });

  const properties = query.data?.data || [];
  const isLoading = query.isLoading;
  const isError = query.isError;

  // Filter and sort properties based on search and sort options
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Filter by search keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(keyword) ||
          property.location.toLowerCase().includes(keyword) ||
          property.description.toLowerCase().includes(keyword)
      );
    }

    // Sort by price
    if (sortPrice !== "none") {
      result.sort((a, b) => {
        if (sortPrice === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    return result;
  }, [properties, searchKeyword, sortPrice]);

  const handlePropertyDeleted = () => {
    query.refetch();
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography color="error">Failed to load properties</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontSize={25} fontWeight={700} color="#11142d">
          All Properties
        </Typography>

        <CustomButton
          title="Add Property"
          handleClick={() => navigate("/properties/create")}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>

      {/* Search and Sort Controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          placeholder="Search..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size="small"
          sx={{
            width: "25%",
            backgroundColor: "white",
            borderRadius: 4,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#888", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Price"
          value={sortPrice}
          onChange={(e) =>
            setSortPrice(e.target.value as "asc" | "desc" | "none")
          }
          size="small"
          sx={{
            width: "25%",
            backgroundColor: "white",
            borderRadius: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Sort sx={{ color: "#475be8", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="none">No Sort</MenuItem>
          <MenuItem value="asc">Low to High</MenuItem>
          <MenuItem value="desc">High to Low</MenuItem>
        </TextField>
      </Stack>

      {/* Properties Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: "20px",
        }}
      >
        {filteredAndSortedProperties.length > 0 ? (
          filteredAndSortedProperties.map((property: Property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              price={property.price}
              propertyType={property.propertyType}
              photo={property.photo}
              description={property.description}
              onDelete={handlePropertyDeleted}
            />
          ))
        ) : (
          <Typography color="textSecondary">
            {searchKeyword
              ? "No properties match your search"
              : "No properties found"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AllProperties;
