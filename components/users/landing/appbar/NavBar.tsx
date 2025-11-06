"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppBar, Toolbar, IconButton, InputBase, Box, Drawer, Button, useMediaQuery, Tooltip } from "@mui/material"
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ImageSearch as ImageSearchIcon,
  Close as CloseIcon,
  LocalShipping as LogoIcon,
} from "@mui/icons-material"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"
import { useRouter } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { TypographyButton } from "@/components/styledcomponents/StyledElements"
import { checkUserHasStore } from "@/app/actions/store/action"
import UseCustomToast from "@/components/ui/useCustomToast"
import ImageCropModal from "@/components/users/landing/appbar/ImageCropModel"
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Image from "next/image";
import logo from "@/components/assets/users/ecom-fort.png";
interface HideOnScrollProps {
  children: React.ReactElement
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function NavBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session, status } = useSession()
  const [isUserLoggedIn, setUserLoggedIn] = useState<boolean>(false)
  const [storeId, setStoreId] = useState<string>("")
  const [hasStore, setHasStore] = useState<boolean>(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [cropMode, setCropMode] = useState(false)
  const { errorToast, successToast } = UseCustomToast()
  const [currentPath, setCurrentPath] = useState<string>("")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const userId = session?.user.id
  const isMobile = useMediaQuery("(max-width:600px)")

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "authenticated" && userId) {
        const res = await checkUserHasStore(userId)
        setStoreId(res.storeId || "")
        setHasStore(res.hasStore || false)
        setUserLoggedIn(true)
      } else if (status === "unauthenticated") {
        setUserLoggedIn(false)
        setHasStore(false)
        setStoreId("")
      }

      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname)
      }

      // Mark component as hydrated after auth check is complete
      setIsHydrated(true)
    }

    if (status !== "loading") {
      checkAuth()
    }
  }, [status, userId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleNavigation = (link: string) => {
    router.push(`/${link}`)
    setDrawerOpen(false)
  }

  const handleImageUploadClick = () => {
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImage(null)
    setCropMode(false)
  }

  const renderStoreButton = () => {
    if (!isHydrated || !isUserLoggedIn) return null

    return (
      <Tooltip title={hasStore ? "View your store" : "Create a store"}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            cursor: "pointer",
            p: 1,
            borderRadius: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
          onClick={() => router.push(hasStore ? "/merchant/storedetails" : "/merchant/addstore")}
        >
          {hasStore ? <StoreIcon sx={{ color: "white" }} /> : <AddBusinessIcon sx={{ color: "white" }} />}
          <TypographyButton variant="body2" sx={{ color: "white" }}>
            {hasStore ? "Visit Store" : "Add Store"}
          </TypographyButton>
        </Box>
      </Tooltip>
    )
  }

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            bgcolor: "#000000",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                flexShrink: 0,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
              onClick={() => router.push("/")}
            >
              <Image
                src={logo}
                alt="logo"
                width={isMobile ? 100 : 150}
                height={isMobile ? 30 : 40}
                style={{ cursor: "pointer" }} />
            </Box>

            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "white",
                padding: "0 12px",
                maxWidth: isMobile ? 200 : 400,
                height: isMobile ? 38 : 44,
                borderRadius: 2,
                gap: 1,
                flex: isMobile ? 0 : 1,
                transition: "all 0.2s ease",
                "&:focus-within": {
                  boxShadow: "0 0 0 2px rgba(255,255,255,0.2)",
                },
              }}
            >
              <Tooltip title="Search products">
                <IconButton
                  type="submit"
                  size="small"
                  sx={{
                    color: "#000",
                    p: 0.5,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <InputBase
                placeholder="Search products…"
                inputProps={{
                  "aria-label": "search products",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  "& input::placeholder": {
                    opacity: 0.6,
                  },
                }}
              />

              {searchQuery && (
                <Tooltip title="Clear search">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{
                      color: "#000",
                      p: 0.5,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Search by image">
                <IconButton
                  onClick={handleImageUploadClick}
                  size="small"
                  sx={{
                    color: "#000",
                    p: 0.5,
                    ml: 0.5,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                >
                  <ImageSearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Right Icons */}
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Wishlist">
                <IconButton
                  onClick={() => router.push("/wishlists")}
                  size="small"
                  sx={{
                    color: "white",
                    p: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Shopping Cart">
                <IconButton
                  onClick={() => router.push("/cart")}
                  size="small"
                  sx={{
                    color: "white",
                    p: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <ShoppingBagIcon />
                </IconButton>
              </Tooltip>

              {/* Desktop Menu */}
              {!isMobile && (
                <Box display="flex" alignItems="center" gap={1} ml={2}>
                  {renderStoreButton()}

                  {isHydrated && isUserLoggedIn && (
                    <Tooltip title="My Profile">
                      <IconButton
                        size="small"
                        sx={{
                          color: "white",
                          p: 1,
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.1)",
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => handleNavigation("my-profile")}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {isHydrated && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        isUserLoggedIn
                          ? signOut({ callbackUrl: "/" })
                          : signIn(undefined, { callbackUrl: currentPath || "/" })
                      }
                      startIcon={isUserLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                      sx={{
                        bgcolor: "white",
                        color: "#000",
                        fontWeight: 600,
                        ml: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.9)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {isUserLoggedIn ? "Logout" : "Login"}
                    </Button>
                  )}
                </Box>
              )}

              {/* Mobile Menu */}
              {isMobile && (
                <Tooltip title="Menu">
                  <IconButton
                    onClick={() => setDrawerOpen(true)}
                    size="small"
                    sx={{
                      color: "white",
                      p: 1,
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: 280,
            bgcolor: "#f5f5f5",
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <span style={{ fontWeight: 600 }}>Menu</span>
            <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: "#000" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {renderStoreButton()}

          {isHydrated && isUserLoggedIn && (
            <Button
              fullWidth
              startIcon={<AccountCircleIcon />}
              onClick={() => handleNavigation("my-profile")}
              sx={{ justifyContent: "flex-start", color: "#000" }}
            >
              Profile
            </Button>
          )}

          {isHydrated && (
            <Button
              fullWidth
              variant="contained"
              startIcon={isUserLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              onClick={() =>
                isUserLoggedIn ? signOut({ callbackUrl: "/" }) : signIn(undefined, { callbackUrl: currentPath || "/" })
              }
              sx={{
                bgcolor: "#000",
                color: "white",
                mt: "auto",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              {isUserLoggedIn ? "Logout" : "Login"}
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Image Search Modal */}
      <ImageCropModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        errorToast={errorToast}
        successToast={successToast}
      />
    </>
  )
}
