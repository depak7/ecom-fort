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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TermsAndConditions = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleBack = () => {
    router.push('/');
  };

  const TermsSection = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'dark' }}>
        {title}
      </Typography>
      <Box sx={{ pl: 2 }}>{children}</Box>
    </Box>
  );

  return (
    <Container sx={{ py: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}
      >
        {/* Header */}
       <Box>
          
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              mb: 1,
              color: '#333333'
            }}
          >    <IconButton 
          onClick={handleBack} 
          sx={{ mr: 1, color: 'dark' }}
        >
          <ArrowBackIcon />
        </IconButton>
            Terms and Conditions
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Introduction */}
        <TermsSection title="1. Introduction">
          <Typography variant="body1" paragraph>
            Welcome to Ecom-Fort, a marketplace platform that connects users with local stores. By using Ecom-Fort, you agree to the following terms and conditions.
          </Typography>
        </TermsSection>
        
        {/* Account Creation */}
        <TermsSection title="2. Account Creation">
          <Typography variant="body1" paragraph>
            Store owners must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials.
          </Typography>
        </TermsSection>
        
        {/* Store Listings */}
        <TermsSection title="3. Store Listings">
          <Typography variant="body1" paragraph>
            Products listed must be accurately described with clear images and pricing. Store owners are responsible for maintaining their inventory and product information.
          </Typography>
        </TermsSection>
        
        {/* Order Processing */}
        <TermsSection title="4. Order Processing">
          <Typography variant="body1" paragraph>
            Orders are processed directly between customers and store owners via WhatsApp. Ecom-Fort is not responsible for transaction processing or delivery.
          </Typography>
        </TermsSection>
        
        {/* User Conduct */}
        <TermsSection title="5. User Conduct">
          <Typography variant="body1" paragraph>
            Users must not engage in any fraudulent activity or misuse the platform. We reserve the right to suspend or terminate accounts that violate our policies.
          </Typography>
        </TermsSection>
        
        {/* Intellectual Property */}
        <TermsSection title="6. Intellectual Property">
          <Typography variant="body1" paragraph>
            All content on Ecom-Fort, including logos, design, text, and graphics, is the property of Ecom-Fort and is protected by copyright laws. Users may not reproduce, distribute, or create derivative works without our express permission.
          </Typography>
        </TermsSection>
        
        {/* Limitation of Liability */}
        <TermsSection title="7. Limitation of Liability">
          <Typography variant="body1" paragraph>
            Ecom-Fort serves as a platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of products listed. We do not guarantee continuous, error-free access to our services and are not liable for any damages resulting from the use of our platform.
          </Typography>
        </TermsSection>
        
        {/* Disputes */}
        <TermsSection title="8. Disputes">
          <Typography variant="body1" paragraph>
            Any disputes arising between customers and store owners should be resolved directly between the parties involved. Ecom-Fort may provide limited assistance but is not obligated to mediate disputes or provide refunds.
          </Typography>
        </TermsSection>
        
        {/* Modifications to Terms */}
        <TermsSection title="9. Modifications to Terms">
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. Continued use of Ecom-Fort following any changes constitutes acceptance of the revised terms. Users are encouraged to review the terms periodically.
          </Typography>
        </TermsSection>
        
        {/* Termination */}
        <TermsSection title="10. Termination">
          <Typography variant="body1" paragraph>
            We reserve the right to terminate or suspend any user account at our discretion, without notice, particularly in cases of terms violation or suspected fraudulent activity.
          </Typography>
        </TermsSection>
        
        {/* Governing Law */}
        <TermsSection title="11. Governing Law">
          <Typography variant="body1" paragraph>
            These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
          </Typography>
        </TermsSection>
        
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

export default TermsAndConditions;