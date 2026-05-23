'use client'

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import StoreCard from "@/components/users/stores/StoreCard";
import BrowseToolbar from "@/components/users/discovery/BrowseToolbar";
import { getAllStores } from "../actions/store/action";
import { useLocation } from "@/components/users/location/LocationProvider";

interface Store {
  id: string;
  name: string;
  logo: string;
  city: string;
  address: string;
  description: string;
}

export default function AvailableStores() {
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCity, isHydrated } = useLocation();

  const fetchStores = useCallback(async (sort = "", city: string | null = selectedCity) => {
    const { stores } = await getAllStores(sort, city);
    setAllStores((stores as Store[]) || []);
  }, [selectedCity]);

  useEffect(() => {
    if (isHydrated) {
      fetchStores(sortBy, selectedCity);
    }
  }, [isHydrated, selectedCity, sortBy, fetchStores]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return allStores;
    const q = searchQuery.trim().toLowerCase();
    return allStores.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.description?.toLowerCase().includes(q) ||
        store.city?.toLowerCase().includes(q)
    );
  }, [allStores, searchQuery]);

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    setSortAnchorEl(null);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <BrowseToolbar
        title="Stores"
        subtitle="Browse approved stores in your area"
        searchPlaceholder="Search stores by name, city, or description…"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            endIcon={<ExpandMoreOutlinedIcon />}
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Sort
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
          >
            <MenuItem onClick={() => handleSort("name")}>Store name</MenuItem>
            <MenuItem onClick={() => handleSort("city")}>City</MenuItem>
          </Menu>
        </Box>
      </BrowseToolbar>

      <Box sx={{ maxWidth: 1200, margin: "auto", px: 2 }}>
        {filteredStores.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" gutterBottom>
              No stores found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery.trim()
                ? "Try a different search term or clear your city filter."
                : selectedCity
                  ? `No approved stores in ${selectedCity} yet.`
                  : "No stores available at the moment."}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredStores.length} store{filteredStores.length !== 1 ? "s" : ""} found
            </Typography>
            <Grid container spacing={3}>
              {filteredStores.map((store) => (
                <Grid item xs={12} sm={6} md={4} key={store.id}>
                  <StoreCard store={store} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
