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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
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
  AddBusiness as AddBusinessIcon,
} from "@mui/icons-material"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"
import { useRouter, usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { checkUserHasStore } from "@/app/actions/store/action"
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
  { label: "Stores", href: "/stores", icon: StoreIcon },
  { label: "Products", href: "/products", icon: ShoppingBagIcon },
]

const iconButtonSx = {
  color: "white",
  width: 40,
  height: 40,
  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
}

const listItemTextProps = {
  primaryTypographyProps: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#374151",
    textTransform: "none" as const,
  },
}

const listSubheaderSx = {
  bgcolor: "transparent",
  lineHeight: "28px",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#9ca3af",
  px: 0.5,
  py: 0.5,
}

type MobileNavItemProps = {
  label: string
  icon: React.ReactNode
  onClick: () => void
  active?: boolean
}

function MobileNavItem({ label, icon, onClick, active }: MobileNavItemProps) {
  return (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{
        borderRadius: 1.5,
        py: 1.1,
        px: 1.25,
        mb: 0.25,
        textTransform: "none",
        "&.Mui-selected": {
          bgcolor: "#f3f4f6",
          "&:hover": { bgcolor: "#eceef1" },
        },
        "&:hover": { bgcolor: "#f9fafb" },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 36,
          color: active ? "#374151" : "#9ca3af",
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} {...listItemTextProps} />
    </ListItemButton>
  )
}

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isUserLoggedIn, setUserLoggedIn] = useState(false)
  const [hasStore, setHasStore] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const [isHydrated, setIsHydrated] = useState(false)
  const userId = session?.user.id
  const isMobile = useMediaQuery("(max-width:900px)")
  const isCompactMobile = useMediaQuery("(max-width:480px)")

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

  useEffect(() => {
    if (!isDrawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isDrawerOpen])

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

  const handleAuth = () => {
    if (isUserLoggedIn) {
      signOut({ callbackUrl: "/" })
    } else {
      signIn(undefined, { callbackUrl: currentPath || "/" })
    }
    setDrawerOpen(false)
  }

  const handleStoreClick = () => {
    router.push(hasStore ? "/merchant/storedetails" : "/merchant/addstore")
    setDrawerOpen(false)
  }

  const showSearchInBar = !isCompactMobile
  const showWishlistInBar = !isMobile

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            bgcolor: "#000000",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              gap: 1,
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              sx={{ flexShrink: 0, cursor: "pointer", minWidth: 0 }}
              onClick={() => router.push("/")}
            >
              <Image
                src={logo}
                alt="Ecom-Fort logo"
                width={isCompactMobile ? 88 : isMobile ? 100 : 140}
                height={isCompactMobile ? 26 : isMobile ? 30 : 38}
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

            <Box display="flex" alignItems="center" sx={{ flexShrink: 0, gap: 0.25 }}>
              {showSearchInBar && (
                <Tooltip title="Search stores & products">
                  <IconButton onClick={handleSearchClick} size="small" sx={iconButtonSx} aria-label="Search">
                    <SearchIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </Tooltip>
              )}

              {showWishlistInBar && (
                <Tooltip title="Wishlist">
                  <IconButton
                    onClick={() => router.push("/wishlists")}
                    size="small"
                    sx={iconButtonSx}
                    aria-label="Wishlist"
                  >
                    <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Cart">
                <IconButton
                  onClick={() => router.push("/cart")}
                  size="small"
                  sx={iconButtonSx}
                  aria-label="Cart"
                >
                  <ShoppingBagIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <>
                  {isHydrated && isUserLoggedIn && (
                    <Tooltip title={hasStore ? "View your store" : "Create a store"}>
                      <IconButton
                        size="small"
                        sx={iconButtonSx}
                        onClick={handleStoreClick}
                        aria-label={hasStore ? "Visit store" : "Add store"}
                      >
                        {hasStore ? (
                          <StoreIcon sx={{ fontSize: 22 }} />
                        ) : (
                          <AddBusinessIcon sx={{ fontSize: 22 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                  {isHydrated && isUserLoggedIn && (
                    <Tooltip title="My Profile">
                      <IconButton
                        size="small"
                        sx={iconButtonSx}
                        onClick={() => handleNavigation("/my-profile")}
                        aria-label="My profile"
                      >
                        <AccountCircleIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {isHydrated && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAuth}
                      startIcon={isUserLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                      sx={{
                        bgcolor: "white",
                        color: "#000",
                        fontWeight: 600,
                        ml: 0.5,
                        textTransform: "none",
                        borderRadius: 1.5,
                        px: 1.75,
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
                  sx={{
                    ...iconButtonSx,
                    ml: 0.25,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  aria-label="Open menu"
                >
                  <MenuIcon sx={{ fontSize: 22 }} />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: false }}
        PaperProps={{
          sx: {
            width: { xs: "min(88vw, 300px)", sm: 300 },
            bgcolor: "#fff",
            borderLeft: "1px solid #e5e7eb",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            bgcolor: "rgba(17, 24, 39, 0.45)",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e5e7eb",
              bgcolor: "#f7f7f8",
              flexShrink: 0,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                {isHydrated && isUserLoggedIn && session?.user?.name
                  ? `Hi, ${session.user.name.split(" ")[0]}`
                  : "Menu"}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              size="small"
              aria-label="Close menu"
              sx={{
                width: 36,
                height: 36,
                border: "1px solid #e5e7eb",
                borderRadius: 1.5,
                bgcolor: "#fff",
                color: "#6b7280",
                flexShrink: 0,
                "&:hover": { bgcolor: "#f3f4f6", color: "#374151" },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box sx={{ px: 1.5, py: 1.5, flex: "0 0 auto" }}>
            <List
              disablePadding
              subheader={<ListSubheader sx={listSubheaderSx}>Shop</ListSubheader>}
            >
              <MobileNavItem
                label="Search"
                icon={<SearchIcon sx={{ fontSize: 20 }} />}
                onClick={handleSearchClick}
              />
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <MobileNavItem
                    key={link.href}
                    label={link.label}
                    icon={<Icon sx={{ fontSize: 20 }} />}
                    onClick={() => handleNavigation(link.href)}
                    active={pathname === link.href}
                  />
                )
              })}
              <MobileNavItem
                label="Wishlist"
                icon={<FavoriteBorderIcon sx={{ fontSize: 20 }} />}
                onClick={() => handleNavigation("/wishlists")}
                active={pathname === "/wishlists"}
              />
              <MobileNavItem
                label="Cart"
                icon={<ShoppingBagIcon sx={{ fontSize: 20 }} />}
                onClick={() => handleNavigation("/cart")}
                active={pathname === "/cart"}
              />
            </List>

            {isHydrated && isUserLoggedIn && (
              <List
                disablePadding
                sx={{ mt: 1 }}
                subheader={<ListSubheader sx={listSubheaderSx}>Account</ListSubheader>}
              >
                <MobileNavItem
                  label="My profile"
                  icon={<AccountCircleIcon sx={{ fontSize: 20 }} />}
                  onClick={() => handleNavigation("/my-profile")}
                  active={pathname === "/my-profile"}
                />
                <MobileNavItem
                  label={hasStore ? "Visit store" : "Open your store"}
                  icon={
                    hasStore ? (
                      <StoreIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <AddBusinessIcon sx={{ fontSize: 20 }} />
                    )
                  }
                  onClick={handleStoreClick}
                  active={
                    pathname === "/merchant/storedetails" ||
                    pathname === "/merchant/addstore"
                  }
                />
              </List>
            )}

            {isHydrated && (
              <Box sx={{ mt: 2, px: 0.5 }}>
                <Divider sx={{ mb: 2, borderColor: "#e5e7eb" }} />
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  startIcon={isUserLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                  onClick={handleAuth}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    py: 1.15,
                    borderRadius: 1.5,
                    bgcolor: isUserLoggedIn ? "#fff" : "#374151",
                    color: isUserLoggedIn ? "#374151" : "#fff",
                    border: isUserLoggedIn ? "1px solid #e5e7eb" : "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: isUserLoggedIn ? "#f3f4f6" : "#1f2937",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isUserLoggedIn ? "Log out" : "Log in"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
