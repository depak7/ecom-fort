'use client';

import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

interface SortProductsProps {
  onSortChange: (sortBy: string) => void;
}

const SortProducts = ({ onSortChange }: SortProductsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState('new-arrivals');

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
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
  ];

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2" sx={{ mr: 1 }}>Sort By</Typography>
      <IconButton 
        onClick={handleClick}
        sx={{ color: "black" }} 
        aria-label="sort"
      >
        <ExpandMoreOutlinedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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