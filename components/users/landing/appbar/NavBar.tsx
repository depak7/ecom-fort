"use client"

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Image from "next/image";
import logo from "@/components/assets/users/logo.png";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function NavBar() {
  const router = useRouter(); // Initialize useRouter

  // Function to handle navigation to /cart
  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <HideOnScroll>
      <AppBar sx={{ bgcolor: "white", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <Image src={logo} alt="logo" width={80} height={40} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#F5F5F5",
              borderRadius: 15,
              padding: "0 8px",
              maxWidth: 300,
              flexGrow: 1,
              marginLeft: 2,
            }}
          >
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ width: "100%" }}
            />
          </Box>

          <Box display="flex" alignItems="center">
            <IconButton aria-label="favorite" sx={{ color: "black" }}>
              <FavoriteBorderRoundedIcon />
            </IconButton>
            
            <IconButton
              aria-label="cart"
              sx={{ color: "black" }}
              onClick={handleCartClick} // Navigate to /cart on click
            >
              <LocalMallOutlinedIcon />
            </IconButton>
          
          </Box>
          <Box display="flex" alignItems="center" sx={{ color: "black" }}>
            <Typography variant="body2" sx={{ mx: 2 }}>
              Create Store
            </Typography>
            <Typography variant="body2" sx={{ mx: 2 }}>
              Help
            </Typography>
            <Typography variant="body2" sx={{ mx: 2 }}>
              Sign In
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
