"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Image from "next/image";
import logo from "@/components/assets/users/ecom-fort.png";
import { useRouter } from "next/navigation";
import { TypographyButton } from "@/components/styledcomponents/StyledElements";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button, useMediaQuery } from "@mui/material";
import { checkUserHasStore } from "@/app/actions/store/action";
import LoginIcon from '@mui/icons-material/Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const [isUserLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<String>();
  const [hasStore, setHasStore] = useState<boolean>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const userId = session?.user.id;
  const isMobile = useMediaQuery("(max-width:600px)");

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
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleNavigation = (link: string) => {
    router.push(`/${link}`);
    setDrawerOpen(false); // Close drawer after navigation
  };

  return (
    <HideOnScroll>
      <AppBar sx={{ bgcolor: "black", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <Image
              src={logo}
              alt="logo"
              width={isMobile ? 100 : 150}
              height={isMobile ? 30 : 40}
              style={{cursor:"pointer"}}
              onClick={() => router.push("/")}
            />
          </Box>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#F5F5F5",
              padding: isMobile ? "0 2px" : "0 8px",
              maxWidth: isMobile ? 80 : 300,
              height: isMobile ? 30 : 50,
              flexGrow: 1,
              marginLeft: 2,
              position: "relative",
            }}
          >
            <IconButton
              type="submit"
              sx={{ p: isMobile ? "2px" : "10px", color: "black" }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              placeholder={isMobile ? "search" : "Search…"}
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: "100%" }}
              endAdornment={
                searchQuery && (
                  <IconButton
                    size="small"
                    aria-label="clear"
                    onClick={() => setSearchQuery("")}
                    sx={{ color: "black" }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent={"space-between"}>
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
            {!isMobile && (
              <Box display="flex" alignItems="center">
                {isUserLoggedIn && (
                  <>
                    {hasStore ? (
                      <StoreMallDirectoryIcon />
                    ) : (
                      <AddBusinessOutlinedIcon />
                    )}
                    <TypographyButton
                      variant="body2"
                      sx={{
                        mr: 2,
                        ml: 0.5,
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
                      handleNavigation("signup");
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
            )}

            {isMobile && (
              <IconButton aria-label="menu" onClick={() => setDrawerOpen(true)}>
                <MenuIcon sx={{ color: "white" }} />
              </IconButton>
            )}
      
        </Toolbar>

        {/* Drawer for Mobile Menu */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              height: 'auto',
              top: 64, // Height of the AppBar
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              borderTopRightRadius:8,
              borderBottomRightRadius:8
            }
          }}
        >
          <Box
            sx={{
              width: 150,
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 1,
            }}
          >
            {isUserLoggedIn && (
              <Button
                onClick={() => {
                  if (hasStore) {
                    handleNavigation("merchant/storedetails");
                  } else {
                    handleNavigation("merchant/addstore");
                  }
                }}
                startIcon={hasStore ? (
                  <StoreMallDirectoryIcon />
                ) : (
                  <AddBusinessOutlinedIcon />
                )}
                sx={{ 
                  color: "black", 
                  justifyContent: "flex-start",
                  borderRadius: 1,
                  fontSize:{xs:'small'},
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {hasStore ? "Visit Store" : "Add Store"}
              </Button>
            )}

            {!isUserLoggedIn && (
              <Button
                onClick={() => handleNavigation("signup")}
                startIcon={<PersonAddIcon />}
                sx={{ 
                  color: "black", 
                  justifyContent: "flex-start",
                  borderRadius: 1,
                  fontSize:{xs:'small'},
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Signup
              </Button>
            )}

            <Button
              onClick={() => {
                if (isUserLoggedIn) {
                  signOut();
                } else {
                  handleNavigation("signin");
                }
              }}
              startIcon={isUserLoggedIn ? <ExitToAppIcon /> : <LoginIcon />}
              sx={{ 
                color: "black", 
                justifyContent: "flex-start",
                fontSize:{xs:'small'},
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              {isUserLoggedIn ? "Logout" : "Login"}
            </Button>
          </Box>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
}
