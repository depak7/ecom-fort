'use client'

import NextLink from 'next/link'
import { Box, Container, Grid, Typography, Link, Stack, Button, Divider } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LanguageIcon from '@mui/icons-material/Language'
import StoreIcon from '@mui/icons-material/Store'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import SearchIcon from '@mui/icons-material/Search'
import VerifiedIcon from '@mui/icons-material/Verified'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'

const linkSx = {
  fontSize: { xs: '0.8125rem', md: '0.9375rem' },
  color: '#6b7280',
  textDecoration: 'none',
  '&:hover': { color: '#374151' },
}

const sectionTitleSx = {
  fontSize: { xs: '0.875rem', md: '0.9375rem' },
  mb: 1.5,
  color: '#374151',
  fontWeight: 700,
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
}

const shopLinks = [
  { label: 'Browse stores', href: '/stores', icon: <StoreIcon sx={{ fontSize: 17 }} /> },
  { label: 'Shop products', href: '/products', icon: <ShoppingBagIcon sx={{ fontSize: 17 }} /> },
  { label: 'Search', href: '/#discover', icon: <SearchIcon sx={{ fontSize: 17 }} /> },
]

const companyLinks = [
  { label: 'About us', href: '/about-us' },
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms & conditions', href: '/terms-and-condition' },
]

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f7f7f8',
        color: '#374151',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Typography
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-block',
                fontSize: { xs: '1.35rem', md: '1.5rem' },
                fontWeight: 800,
                color: '#374151',
                letterSpacing: '-0.03em',
                textDecoration: 'none',
                mb: 1.5,
                '&:hover': { color: '#1f2937' },
              }}
            >
              EcomFort
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#6b7280', lineHeight: 1.65, maxWidth: 300, mb: 2.5 }}
            >
              Your marketplace for fashion and footwear from stores in your city. Discover,
              compare, and checkout — all in one place.
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <VerifiedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Verified sellers
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <StoreIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Nearby stores
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Shop */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              Shop
            </Typography>
            <Stack spacing={1.25}>
              {shopLinks.map((item) => (
                <Link
                  key={item.href}
                  component={NextLink}
                  href={item.href}
                  underline="none"
                  sx={{
                    ...linkSx,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              Company
            </Typography>
            <Stack spacing={1.25}>
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  component={NextLink}
                  href={item.href}
                  underline="none"
                  sx={linkSx}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact & sellers */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              Contact
            </Typography>
            <Stack spacing={1.25} sx={{ mb: 2.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                <Link href="mailto:deepakfordev@gmail.com" underline="none" sx={linkSx}>
                  deepakfordev@gmail.com
                </Link>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LanguageIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                <Link
                  href="https://ecomfort.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={linkSx}
                >
                  ecomfort.shop
                </Link>
              </Stack>
            </Stack>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#fff',
                border: '1px solid #e5e7eb',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                <AddBusinessIcon sx={{ fontSize: 20, color: '#9ca3af', mt: 0.15 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600} color="#374151">
                    Sell on Ecom-Fort
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', lineHeight: 1.5 }}>
                    Own a store? List your products and reach shoppers in your city.
                  </Typography>
                </Box>
              </Stack>
              <Button
                component={NextLink}
                href="/merchant/addstore"
                size="small"
                fullWidth
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#374151',
                  bgcolor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  '&:hover': { bgcolor: '#e5e7eb' },
                }}
              >
                Open your store
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: '#e5e7eb' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
            © {new Date().getFullYear()} Ecom-Fort. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Link component={NextLink} href="/stores" underline="none" sx={{ ...linkSx, fontSize: '0.8125rem' }}>
              Stores
            </Link>
            <Link component={NextLink} href="/products" underline="none" sx={{ ...linkSx, fontSize: '0.8125rem' }}>
              Products
            </Link>
            <Link component={NextLink} href="/about-us" underline="none" sx={{ ...linkSx, fontSize: '0.8125rem' }}>
              About
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
