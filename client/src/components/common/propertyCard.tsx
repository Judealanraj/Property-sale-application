import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  LocationOn,
  AttachMoney,
  Delete,
  FavoriteBorder,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useDelete } from "@refinedev/core";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  photo: string;
  description?: string;
  onDelete?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  propertyType,
  photo,
  description,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { mutate: deleteProperty } = useDelete();

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      deleteProperty(
        {
          resource: "properties",
          id: id,
        },
        {
          onSuccess: () => {
            setOpenDeleteDialog(false);
            onDelete?.();
          },
        }
      );
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <>
      <Card
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          onClick={() => navigate(`/properties/show/${id}`)}
          sx={{
            cursor: "pointer",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={photo}
            alt={title}
            sx={{ objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={1}
            >
              <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1 }}>
                {title}
              </Typography>
              <Chip
                label={propertyType}
                size="small"
                sx={{
                  backgroundColor: "#475be8",
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.5} mb={1}>
              <LocationOn sx={{ fontSize: 16, color: "#888" }} />
              <Typography variant="body2" color="#888" noWrap>
                {location}
              </Typography>
            </Stack>

            {description && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  mb: 1,
                }}
              >
                {description}
              </Typography>
            )}

            <Stack direction="row" alignItems="center" gap={0.5}>
              <AttachMoney sx={{ fontSize: 18, color: "#475be8" }} />
              <Typography variant="h6" fontWeight={700} color="#475be8">
                ${(price ?? 0).toLocaleString()}

              </Typography>
            </Stack>
          </CardContent>
        </Box>

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            p: 1.5,
            borderTop: "1px solid #eee",
            justifyContent: "flex-end",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={handleLike}
            sx={{
              color: liked ? "#ff6b6b" : "#ccc",
              transition: "all 0.2s",
              "&:hover": {
                color: "#ff6b6b",
              },
            }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              color: "#ff6b6b",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#ffe0e0",
              },
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PropertyCard;
