import React, { useState } from 'react'
import { Box, Typography, Stack } from "@mui/material";
import { useDelete, useGetIdentity,useShow } from '@refinedev/core';
import { useParams,useNavigate } from 'react-router';
import { ChatBubble,Delete,Edit,Phone,Place,Star } from '@mui/icons-material';
import { CustomButton } from '../components';

const PropertyDetails = () => {
  const navigate = useNavigate();
  const {data: user} = useGetIdentity();
  const {id} = useParams<{id:string}>();
  const { mutate: deleteProperty } = useDelete();
  const { query } = useShow({
    resource: "properties",
    id: id || "",
  });
  const { data, isLoading, isError } = query;

  const propertyDetails = query.data?.data;
  const [showFallbackMap, setShowFallbackMap] = useState(false);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    
    if (confirmDelete) {
      deleteProperty(
        {
          resource: "properties",
          id: id || "",
        },
        {
          onSuccess: () => {
            navigate("/properties");
          },
          onError: (error) => {
            console.error("Error deleting property:", error);
            alert("Failed to delete property. Please try again.");
          },
        }
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Property Details
      </Typography>
      <Box
        mt="20px"
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <Box flex={1} maxWidth={764}>
          <img
            src={propertyDetails?.photo}
            alt="property-details"
            height={546}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Place sx={{ color: "#11142d" }} />
              <Typography fontSize={16} color="#11142d" fontWeight={500}>
                {propertyDetails?.location}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <Star sx={{ color: "#f2c94c" }} />
              <Typography fontSize={16} color="#11142d" fontWeight={500}>
                {propertyDetails?.rating} Ratings
              </Typography>
            </Stack>
          </Stack>

          {/* Real Map Card with Fallback */}
          {propertyDetails?.location && (
            <Box mt={2} borderRadius="10px" overflow="hidden" height="300px">
              {!showFallbackMap ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(propertyDetails.location)}`}
                  onLoad={() => {
                    // Just in case iframe fails to load properly, show fallback
                    // Note: can't reliably detect Google API key error
                  }}
                  onError={() => setShowFallbackMap(true)}
                />
              ) : (
                <img
                  src="/fallback-map.png" // fallback image in public folder
                  alt="map-fallback"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Box>
          )}
        </Box>

        <Box flex={1} maxWidth={764}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={22} fontWeight={600} color="#11142d">
              {propertyDetails?.title}
            </Typography>
            <Stack direction="row" gap={2}>
              <CustomButton
                title="Edit"
                backgroundColor="#475be8"
                color="#fcfcfc"
                icon={<Edit />}
                handleClick={() => {
                  navigate(`/properties/edit/${propertyDetails?._id}`);
                }}
              />
              {user?.email === propertyDetails?.creator.email && (
                <CustomButton
                  title="Delete"
                  backgroundColor="#d42e2e"
                  color="#fcfcfc"
                  icon={<Delete />}
                  handleClick={handleDelete}
                />
              )}
            </Stack>
          </Stack>

          <Typography fontSize={18} fontWeight={600} color="#11142d" mt={2}>
            Description
          </Typography>
          <Typography fontSize={14} color="#555" mt={1}>
            {propertyDetails?.description}
          </Typography>

          {/* Book Now Button */}
          <Box mt={3}>
            <CustomButton
              title="Book Now"
              backgroundColor="#28a745"
              color="#fcfcfc"
              handleClick={() => {
                navigate(`/properties/book/${propertyDetails?._id}`);
              }}
            />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Phone sx={{ color: "#11142d" }} />
              <Typography fontSize={16} color="#11142d" fontWeight={500}>
                {propertyDetails?.contactNumber}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <ChatBubble sx={{ color: "#11142d" }} />
              <Typography fontSize={16} color="#11142d" fontWeight={500}>
                {propertyDetails?.email}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default PropertyDetails;
