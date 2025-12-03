import React from "react";
import Button from "@mui/material/Button";

type CustomButtonProps = {
  title: string;
  handleClick?: () => void;
  backgroundColor?: string;
  color?: string;
  icon?: React.ReactNode;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handleClick,
  backgroundColor = "#475be8",
  color = "#fff",
  icon,
}) => {
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      startIcon={icon}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        textTransform: "none",
      }}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
