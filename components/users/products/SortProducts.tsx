import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

interface SortProductsProps {
  onSortChange: (sort: string) => void;
}

const SortProducts = ({ onSortChange }: SortProductsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState("new-arrivals");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (sortBy: string) => {
    setSelectedSort(sortBy);
    onSortChange(sortBy);
    handleClose();
  };

  const sortOptions = [
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={handleClick}
        endIcon={<ExpandMoreOutlinedIcon />}
        sx={{
          textTransform: "none",
          color: "black",
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <Typography variant="body2">Sort By</Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSort(option.value)}
            selected={selectedSort === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SortProducts;
