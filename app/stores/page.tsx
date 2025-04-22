'use client'

import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import StoreCard from "@/components/users/stores/StoreCard";
import { getAllStores } from "../actions/store/action";

interface Store {
  id: string;
  name: string;
  logo: string;
  city: string;
  address: string;
  description: string;
}

export default function AvailableStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchStores();
  }, []);
``
  const fetchStores = async (sort = '') => {
    const { stores } = await getAllStores(sort);
    setStores(stores as Store[]);
    setFilteredStores(stores as Store[]);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    fetchStores(sortBy);
    handleFilterClose();
  };

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    fetchStores(sortOption);
    handleSortClose();
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: "auto", padding: 2 }}>
      <Typography
        variant={isMobile?"body2":"h6"}
        component="h1"
        gutterBottom
        align="center"
        fontWeight={"bold"}
        sx={{ mb: 2 }}
      >
        SHOP TOP STORES IN ONE SEAMLESS
        EXPERIENCE!
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body1" component="h2" fontWeight={"bold"}>
          SHOP BY STORES
        </Typography>
        <Box display={"flex"} gap={2}>

          <Box display={"flex"} alignItems={"center"}>
            <Typography variant="body2">Sort By</Typography>
            <IconButton sx={{ color: "black" }} aria-label="sort" onClick={handleSortClick}>
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem sx={{fontSize:"15px"}}  onClick={() => handleSort('name')}>Storename</MenuItem>
        <MenuItem sx={{fontSize:"15px"}}  onClick={() => handleSort('city')}>City</MenuItem>
      </Menu>

      <Grid container spacing={3}>
        {filteredStores.map((store: Store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id} padding={3}>
            <StoreCard
              store={{
                id: store.id,
                name: store.name,
                logo: store.logo,
                city: store.city,
                address: store.address,
                description: store.description,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}