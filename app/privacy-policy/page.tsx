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

const PrivacyPolicy = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleBack = () => {
    router.push('/');
  };

  const PolicySection = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'dark' }}>
        {title}
      </Typography>
      <Box sx={{ pl: 2 }}>{children}</Box>
    </Box>
  );

  const SubSection = ({ title, items }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ pl: 4, m: 0 }}>
        {items.map((item, index) => (
          <Box component="li" key={index} sx={{ mb: 0.5 }}>
            <Typography variant="body2">{item}</Typography>
          </Box>
        ))}
      </Box>
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
        <Box sx={{ mb: 4 }}>
          
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              mb: 1,
              color: 'black'
            }}
          >   <IconButton 
          onClick={handleBack} 
          sx={{ mr: 1, color: 'dark' }}
        >
          <ArrowBackIcon />
        </IconButton>
            Privacy Policy
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Introduction */}
        <PolicySection title="1. Introduction">
          <Typography variant="body1" paragraph>
            Ecom-Fort ("we," "our," or "us") values your privacy...
          </Typography>
        </PolicySection>
        
        {/* Information We Collect */}
        <PolicySection title="2. Information We Collect">
          <SubSection 
            title="2.1 For Store Owners" 
            items={[
              "Personal Information: Name, email, phone number, store address, KYC documents",
              "Business Information: Store name, category, product details, store location",
              "Payment Information: UPI ID (if provided for order processing)"
            ]}
          />
          
          <SubSection 
            title="2.2 For Customers" 
            items={[
              "Account Information: Name, email, phone number",
              "Order Details: Product selections, delivery address, payment method",
              "Device & Usage Data: IP address, browser type, platform usage"
            ]}
          />
        </PolicySection>
        
        {/* How We Use Your Information */}
        <PolicySection title="3. How We Use Your Information">
          <SubSection 
            title="3.1 For Store Owners" 
            items={[
              "To verify your identity and business legitimacy",
              "To manage your store profile and product listings",
              "To process orders and facilitate communication with customers",
              "To send important notifications and updates"
            ]}
          />
          
          <SubSection 
            title="3.2 For Customers" 
            items={[
              "To process and fulfill your orders",
              "To provide customer support and address inquiries",
              "To personalize your shopping experience",
              "To send promotional offers and updates (if opted in)"
            ]}
          />
        </PolicySection>
        
        {/* Data Sharing and Disclosure */}
        <PolicySection title="4. Data Sharing and Disclosure">
          <Box component="ul" sx={{ pl: 4, m: 0 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>With Store Owners:</strong> We share customer order details with the store owner to fulfill the order.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>With Service Providers:</strong> We may share data with third-party service providers for payment processing, data analytics, and marketing.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Legal Compliance:</strong> We may disclose information if required by law or legal process.
              </Typography>
            </Box>
          </Box>
        </PolicySection>
        
        {/* Data Security */}
        <PolicySection title="5. Data Security">
          <Typography variant="body2" paragraph>
            We implement industry-standard security measures...
          </Typography>
        </PolicySection>
        
        {/* Your Rights */}
        <PolicySection title="6. Your Rights">
          <Typography variant="body2" paragraph>
            - Access, Correction, Deletion, Opt-Out options
          </Typography>
        </PolicySection>
        
        {/* Cookies and Tracking */}
        <PolicySection title="7. Cookies and Tracking Technologies">
          <Typography variant="body2" paragraph>
            We use cookies and similar tracking technologies...
          </Typography>
        </PolicySection>
        
        {/* Third-Party Links */}
        <PolicySection title="8. Third-Party Links">
          <Typography variant="body2" paragraph>
            Our platform may contain links to third-party websites...
          </Typography>
        </PolicySection>
        
        {/* Children's Privacy */}
        <PolicySection title="9. Children's Privacy">
          <Typography variant="body2" paragraph>
            Ecom-Fort is not intended for children under 13...
          </Typography>
        </PolicySection>
        
        {/* Changes to Policy */}
        <PolicySection title="10. Changes to This Privacy Policy">
          <Typography variant="body2" paragraph>
            We may update this Privacy Policy from time to time...
          </Typography>
        </PolicySection>
        
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

export default PrivacyPolicy;