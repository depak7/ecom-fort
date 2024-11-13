"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Image from "next/image";
import logo from "@/components/assets/users/ecom-fort.png";
import { useRouter } from "next/navigation";
import { TypographyButton } from "@/components/styledcomponents/StyledElements";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@mui/material";
import { checkUserHasStore } from "@/app/actions/store/action";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session, status } = useSession();
  const [isUserLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [storeid, setStoreId] = useState<String>();
  const [hasStore, setHasStore] = useState<boolean>();

  const userId = session?.user.id;

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "authenticated") {
        setUserLoggedIn(true);
        if (userId) {
          const res = await checkUserHasStore(userId);
          setStoreId(res.storeId || "");
          setHasStore(res.hasStore);
        }
      }
    };
    checkAuth();
  }, [status, userId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleNavigation = (link: string) => {
    router.push(`/${link}`);
  };

  return (
    <HideOnScroll>
      <AppBar sx={{ bgcolor: "black", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <Image src={logo} alt="logo" width={150} height={40} />
          </Box>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#F5F5F5",
              padding: "0 8px",
              maxWidth: 300,
              flexGrow: 1,
              marginLeft: 2,
              position: "relative",
            }}
          >
            <IconButton
              type="submit"
              sx={{ p: "10px", color: "black" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
              sx={{ width: "100%" }}
              endAdornment={
                searchQuery && (
                  <IconButton
                    size="small"
                    aria-label="clear"
                    onClick={() => setSearchQuery('')}
                    sx={{ color: 'black' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }
            />
          </Box>

          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="favorite"
              onClick={() => handleNavigation("wishlists")}
            >
              <FavoriteBorderRoundedIcon sx={{ color: "white" }} />
            </IconButton>

            <IconButton
              aria-label="cart"
              onClick={() => handleNavigation("cart")}
            >
              <LocalMallOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">      
            {isUserLoggedIn && (
              <>
               {hasStore ? <StoreMallDirectoryIcon /> : <AddBusinessOutlinedIcon />}
              <TypographyButton
                variant="body2"
                sx={{
                  mr: 2,
                  ml: 1,
                }}
                onClick={() => {
                  if (hasStore) {
                    handleNavigation("merchant/storedetails");
                  } else {
                    handleNavigation("merchant/addstore");
                  }
                }}
              >
                {hasStore ? "Visit Store" : "Add Store"}
              </TypographyButton>
              </>
            )}

            {!isUserLoggedIn && (
              <Button
                variant="contained"
                sx={{
                  mx: 1,
                  bgcolor: "#D3F2FF",
                  color: "black",
                  "&:hover": {
                    bgcolor: "#D3F2FF",
                    color: "black",
                  },
                }}
                onClick={() => {
                  handleNavigation('signup')
                }}
              >
                Signup
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => {
                if (!isUserLoggedIn) {
                  handleNavigation("signin");
                } else {
                  signOut();
                }
              }}
              sx={{
                mx: 1,
                bgcolor: "white",
                color: "black",
                "&:hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
            >
              {isUserLoggedIn ? "Logout" : "Login"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}