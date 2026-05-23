"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  Button,
  useMediaQuery,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"
import { useRouter, usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { TypographyButton } from "@/components/styledcomponents/StyledElements"
import { checkUserHasStore } from "@/app/actions/store/action"
import AddBusinessIcon from "@mui/icons-material/AddBusiness"
import Image from "next/image"
import logo from "@/components/assets/users/ecom-fort.png"

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

const navLinks = [
  { label: "Stores", href: "/stores" },
  { label: "Products", href: "/products" },
]

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isUserLoggedIn, setUserLoggedIn] = useState<boolean>(false)
  const [hasStore, setHasStore] = useState<boolean>(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [isHydrated, setIsHydrated] = useState(false)
  const userId = session?.user.id
  const isMobile = useMediaQuery("(max-width:900px)")

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "authenticated" && userId) {
        const res = await checkUserHasStore(userId)
        setHasStore(res.hasStore || false)
        setUserLoggedIn(true)
      } else if (status === "unauthenticated") {
        setUserLoggedIn(false)
        setHasStore(false)
      }

      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname)
      }

      setIsHydrated(true)
    }

    if (status !== "loading") {
      checkAuth()
    }
  }, [status, userId])

  const handleSearchClick = () => {
    if (pathname === "/") {
      document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push("/#discover")
    }
    setDrawerOpen(false)
  }

  const handleNavigation = (link: string) => {
    router.push(link)
    setDrawerOpen(false)
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
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
          onClick={() =>
            router.push(hasStore ? "/merchant/storedetails" : "/merchant/addstore")
          }
        >
          {hasStore ? (
            <StoreIcon sx={{ color: "white" }} />
          ) : (
            <AddBusinessIcon sx={{ color: "white" }} />
          )}
          {!isMobile && (
            <TypographyButton variant="body2" sx={{ color: "white" }}>
              {hasStore ? "Visit Store" : "Add Store"}
            </TypographyButton>
          )}
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
          <Toolbar sx={{ justifyContent: "space-between", gap: 2, minHeight: { xs: 56, sm: 64 } }}>
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              <Image
                src={logo}
                alt="Ecom-Fort logo"
                width={isMobile ? 100 : 140}
                height={isMobile ? 30 : 38}
                style={{ cursor: "pointer" }}
              />
            </Box>

            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5, flex: 1, justifyContent: "center" }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    sx={{
                      color: pathname === link.href ? "#fff" : "rgba(255,255,255,0.75)",
                      fontWeight: pathname === link.href ? 600 : 400,
                      textTransform: "none",
                      px: 2,
                      "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={0.5}>
              <Tooltip title="Search stores & products">
                <IconButton
                  onClick={handleSearchClick}
                  size="small"
                  sx={{
                    color: "white",
                    p: 1,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Wishlist">
                <IconButton
                  onClick={() => router.push("/wishlists")}
                  size="small"
                  sx={{ color: "white", p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton
                  onClick={() => router.push("/cart")}
                  size="small"
                  sx={{ color: "white", p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                >
                  <ShoppingBagIcon />
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <>
                  {renderStoreButton()}
                  {isHydrated && isUserLoggedIn && (
                    <Tooltip title="My Profile">
                      <IconButton
                        size="small"
                        sx={{ color: "white", p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                        onClick={() => handleNavigation("/my-profile")}
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
                        ml: 0.5,
                        textTransform: "none",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                      }}
                    >
                      {isUserLoggedIn ? "Logout" : "Login"}
                    </Button>
                  )}
                </>
              )}

              {isMobile && (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  size="small"
                  sx={{ color: "white", p: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: 280,
            bgcolor: "#fafafa",
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontWeight={600}>Menu</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Button
            fullWidth
            startIcon={<SearchIcon />}
            onClick={handleSearchClick}
            sx={{ justifyContent: "flex-start", color: "#000", mb: 1 }}
          >
            Search
          </Button>

          {navLinks.map((link) => (
            <Button
              key={link.href}
              fullWidth
              onClick={() => handleNavigation(link.href)}
              sx={{
                justifyContent: "flex-start",
                color: pathname === link.href ? "primary.main" : "#000",
                fontWeight: pathname === link.href ? 600 : 400,
              }}
            >
              {link.label}
            </Button>
          ))}

          {renderStoreButton()}

          {isHydrated && isUserLoggedIn && (
            <Button
              fullWidth
              startIcon={<AccountCircleIcon />}
              onClick={() => handleNavigation("/my-profile")}
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
                isUserLoggedIn
                  ? signOut({ callbackUrl: "/" })
                  : signIn(undefined, { callbackUrl: currentPath || "/" })
              }
              sx={{ bgcolor: "#000", color: "white", mt: "auto" }}
            >
              {isUserLoggedIn ? "Logout" : "Login"}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  )
}
