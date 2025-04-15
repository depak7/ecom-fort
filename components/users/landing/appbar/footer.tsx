'use client';
import { Box, Grid, Typography, Link, Stack } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Image from 'next/image';
import ecomfortlogo from '@/components/assets/users/ecom-fort.png'

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', px: {xs:2,md:4}, py:{xs:3 ,md:6}}}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Logo & Tagline */}
        <Grid item xs={12} md={4}>
          <Image
            src={ecomfortlogo}
            alt="logo"
            width={150}
            height={40}
            style={{cursor:"pointer"}}
          />
          
          <Typography variant="body2">
            Your one-stop destination for local fashion stores
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={5} md={4}>
          <Typography variant="h6" fontWeight="bold" sx={{fontSize: { xs: '0.8rem', md: '1rem' }, mb: 1 }}>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            <Link href="/about-us" color="inherit"  sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} underline="hover">About Us</Link>
            <Link href="/privacy-policy" color="inherit"  sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}underline="hover">Privacy Policy</Link>
            <Link href="/terms-and-condition" color="inherit"   sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} underline="hover">Terms & Conditions</Link>
          </Stack>
        </Grid>

        {/* Contact */}
        <Grid item xs={7} md={4}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
            Contact
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon fontSize="small" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                deepakfordev@gmail.com
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LanguageIcon fontSize="small" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
              <Link 
                href="https://ecom-fort.vercel.app" 
                color="inherit" 
                underline="hover"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                ecom-fort.vercel.app
              </Link>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box  sx={{ mt :{xs:1 , sm:4} , pt:{xs:1 ,md:2} }}textAlign="center" borderTop="1px solid #1a1a1a" >
        <Typography variant="body1" sx={{fontSize: { xs: '0.75rem', md: '0.875rem' }}} color="gray">
          © 2024 Ecomfort. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
