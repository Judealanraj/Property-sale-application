import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  TextareaAutosize,
  Stack,
  Button,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import { FormProps } from "../../interfaces/common";
import CustomButton from "./customButten";

const Form: React.FC<FormProps> = ({
  type,
  register,
  formLoading,
  handleSubmit,
  handleImageChange,
  onFinishHandler,
  propertyImage,
}) => {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && handleImageChange) {
      handleImageChange(file);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }} elevation={1}>
      <Box>
        <Typography variant="h5" fontWeight={700} mb={2}>
          {type} Property
        </Typography>

        <Box
          component="form"
          onSubmit={
            handleSubmit && onFinishHandler
              ? handleSubmit(onFinishHandler)
              : undefined
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                fullWidth
                {...(register ? register("title", { required: true }) : {})}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                fullWidth
                {...(register ? register("location", { required: true }) : {})}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Property Type"
                select
                fullWidth
                defaultValue="apartment"
                {...(register
                  ? register("propertyType", { required: true })
                  : {})}
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="farmhouse">Farmhouse</MenuItem>
                <MenuItem value="condos">Condos</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="duplex">Duplex</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
                <MenuItem value="chalet">Chalet</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Price"
                fullWidth
                type="number"
                {...(register ? register("price", { required: true }) : {})}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextareaAutosize
                  minRows={4}
                  placeholder="Description"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    borderColor: "#e0e0e0",
                  }}
                  {...(register ? register("description") : {})}
                />
                <FormHelperText>
                  Write a short description for the property
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <input
                  accept="image/*"
                  id="property-image"
                  type="file"
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="property-image">
                  <Button variant="outlined" component="span">
                    Upload Image
                  </Button>
                </label>
                {propertyImage && propertyImage.url && (
                  <Box mt={2}>
                    <img
                      src={propertyImage.url}
                      alt={propertyImage.name}
                      style={{ width: 120, borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6} display="flex" alignItems="center">
              <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
                <CustomButton
                  title="Cancel"
                  handleClick={() => {}}
                  backgroundColor="#e0e0e0"
                  color="#111"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#475be8",
                    color: "#fff",
                    textTransform: "none",
                  }}
                >
                  {formLoading ? "Saving..." : "Submit"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default Form;
