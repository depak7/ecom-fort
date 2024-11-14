"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";


export default function StoreNavbar() {
  const params = useParams();
  const [storeName, setStoreName] = useState<string>("");
  const [anchorFilterMenu, setAnchorFilterMenu] = useState<null | HTMLElement>(null);
  const [anchorSortMenu, setAnchorSortMenu] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const decodedStoreName = (params.store_name as string)?.replace(/%20/g, " ") || "";
    setStoreName(decodedStoreName);
  }, [params.store_name]);


  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorSortMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorSortMenu(null);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Store Name */}
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{ color: "black" }}
          fontWeight={700}
        >
          {storeName}
        </Typography>

      
        <Box display="flex" gap={2}>

          <Box display="flex" alignItems="center">
        
            <IconButton
              sx={{ color: "black" }}
              aria-label="sort"
              onClick={handleSortMenuOpen}
            >
                <Typography variant="body2" sx={{ color: "black" }}>
              Sort By
            </Typography>
              <ExpandMoreOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorSortMenu}
              open={Boolean(anchorSortMenu)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Price: Low to High</MenuItem>
              <MenuItem onClick={handleMenuClose}>Price: High to Low</MenuItem>
              <MenuItem onClick={handleMenuClose}>Discount</MenuItem>
              <MenuItem onClick={handleMenuClose}>Popularity</MenuItem>
              <MenuItem onClick={handleMenuClose}>New Arrivals</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
