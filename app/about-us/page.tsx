'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  IconButton, 
  Container, 
  Divider, 
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

const AboutUs = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleBack = () => {
    router.push('/');
  };

  const AboutSection = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'dark' }}>
        {title}
      </Typography>
      <Box sx={{ pl: 2 }}>{children}</Box>
    </Box>
  );

  return (
    <Container  sx={{ py: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
         
          
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              mb: 1,
              color: '#333333'
            }}
          > <IconButton 
          onClick={handleBack} 
          sx={{ mr: 1, color: 'dark' }}
        >
          <ArrowBackIcon />
        </IconButton>
            About Us
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Welcome Section */}
        <AboutSection title="Welcome to Ecom-Fort">
          <Typography variant="body1" paragraph>
            We are the ultimate marketplace designed to bridge the gap between local store owners and online shoppers.
          </Typography>
        </AboutSection>
        
        {/* Our Vision */}
        <AboutSection title="Our Vision">
          <Typography variant="body1" paragraph>
            We aim to empower small and medium-sized businesses by providing them with a digital storefront, allowing them to showcase their products and reach a wider audience without the complexities of running an independent e-commerce website.
          </Typography>
        </AboutSection>
        
        {/* Meet the Founder */}
        <AboutSection title="Meet the Founder">
          <Typography variant="body1" paragraph>
            <strong>Deepak S</strong>, the founder of Ecom-Fort, is a passionate software developer based in Bangalore, India. Deepak envisioned a platform where local shop owners—from clothing boutiques to shoe stores—could sell their products online effortlessly.
          </Typography>
        </AboutSection>
        
        {/* What We Offer */}
        <AboutSection title="What We Offer">
          <Box component="ul" sx={{ pl: 4, lineHeight: 1.8 }}>
            <Box component="li">
              <Typography variant="body1">A central marketplace for multiple stores</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">Seamless product uploads for shop owners</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">WhatsApp-based order notifications for easy communication</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">A user-friendly shopping experience for customers</Typography>
            </Box>
          </Box>
        </AboutSection>
        
        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, textAlign: 'center' }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Ecom-Fort. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs;