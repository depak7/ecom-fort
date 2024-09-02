import React from "react";

import {
  Grid,
  Typography,
  Box,
  IconButton,

} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

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



export default async function AvailableStores() {

  const { stores } = await getAllStores();

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        fontWeight={"bold"}
        sx={{ mb: 4 }}
      >
        DISCOVER YOUR NEXT FASHION DESTINATION — SHOP TOP STORES IN ONE SEAMLESS
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
        <Typography variant="h5" component="h2" fontWeight={"bold"}>
          SHOP BY STORES
        </Typography>
        <Box display={"flex"} gap={2}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography variant="h6">Filters</Typography>
            <IconButton sx={{ color: "black" }} aria-label="filter">
              <TuneOutlinedIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <Typography variant="h6">Sort By</Typography>
            <IconButton sx={{ color: "black" }} aria-label="filter">
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stores?.map((store:Store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id} padding={3}>
            <StoreCard  store={{
                id: parseInt(store.id),
                name: store.name,
                logo: store.logo,
                location: `${store.city}, ${store.address}`,
                description: store.description,
              }}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
