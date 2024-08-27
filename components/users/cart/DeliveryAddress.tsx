"use client"

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  InputAdornment,
  Grid,
} from '@mui/material';
import CheckoutProgress from './CheckoutProgress';
import { AddressText, InputFieldButton, StyledPaper, StyledTextField } from '@/components/styledcomponents/StyledElements';
import { BaseButton } from '../buttons/BaseButton';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

const addresses: Address[] = [
  {
    id: '1',
    name: 'John Doe',
    street: '123 Main Street, Apt 4B',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'United States',
    phone: '+1-310-555-1234',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    street: '456 Elm Avenue, Suite 250',
    city: 'Chicago',
    state: 'IL',
    zip: '60611',
    country: 'United States',
    phone: '+1-312-555-6789',
    email: 'jane.smith@example.com',
  },
];

export default function DeliveryAddress() {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [newZipcode, setNewZipcode] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const router = useRouter(); 

const handleProceedToCheckout = () => {
    router.push("/cart/address/payment");  
  };


  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(event.target.value);
  };

  const handleNewZipcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewZipcode(event.target.value);
  };

  const handleCheckZipcode = () => {
    console.log('Checking zipcode:', newZipcode);
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
  };

  const handleNewAddressChange = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [field]: event.target.value });
  };

  const handleSaveNewAddress = () => {
    console.log('Saving new address:', newAddress);
    setIsAddingNewAddress(false);
    setNewAddress({});
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 2 }}>
      <CheckoutProgress />
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Delivery Address
      </Typography>
      <Box sx={{  p: 2, gap: 2,border:"1px solid" }}>
        <Typography fontWeight={700} variant="subtitle1" gutterBottom>
          Select address
        </Typography>
        <RadioGroup
          value={selectedAddress}
          onChange={handleAddressChange}
        >
          {addresses.map((address) => (
            <StyledPaper key={address.id}>
              <FormControlLabel
                value={address.id}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{fontWeight:700,ml:4}}>{address.name}</Typography>
                    <AddressText variant="body2">{address.street}</AddressText>
                    <AddressText variant="body2">{`${address.city}, ${address.state} ${address.zip}`}</AddressText>
                    <AddressText variant="body2">{address.country}</AddressText>
                    <AddressText variant="body2">{`Phone: ${address.phone}`}</AddressText>
                    <AddressText variant="body2">{`Email: ${address.email}`}</AddressText>
                  </Box>
                }
              />
            </StyledPaper>
          ))}
        </RadioGroup>
        <Button
            variant="text"
            sx={{
              mt: 2,
              color: "black",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
           
          >
            View all address
          </Button>
        <Box>
          {isAddingNewAddress && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Name"
                  value={newAddress.name || ''}
                  onChange={handleNewAddressChange('name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Street"
                  value={newAddress.street || ''}
                  onChange={handleNewAddressChange('street')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="City"
                  value={newAddress.city || ''}
                  onChange={handleNewAddressChange('city')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="State"
                  value={newAddress.state || ''}
                  onChange={handleNewAddressChange('state')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Pin Code"
                  value={newAddress.zip || ''}
                  onChange={handleNewAddressChange('zip')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Country"
                  value={newAddress.country || ''}
                  onChange={handleNewAddressChange('country')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Phone"
                  value={newAddress.phone || ''}
                  onChange={handleNewAddressChange('phone')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  value={newAddress.email || ''}
                  onChange={handleNewAddressChange('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <BaseButton  onClick={handleSaveNewAddress}>
                  Save New Address
                </BaseButton>
              </Grid>
            </Grid>
          )}
        </Box>
        {!isAddingNewAddress && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
       
          <Button
            variant="text"
            sx={{
              mt: 2,
              color: "black",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleAddNewAddress}
          >
            Add Address
          </Button>
          <StyledTextField
            placeholder="Enter pincode here"
            variant="outlined"
            size="small"
            value={newZipcode}
            onChange={handleNewZipcodeChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <InputFieldButton onClick={handleCheckZipcode}>Check</InputFieldButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>)}
      </Box>
      <Box sx={{display:"flex",justifyContent:"flex-end" ,mt:2}}>
        <BaseButton onClick={handleProceedToCheckout}> Proceed to Checkout</BaseButton>
      </Box>
    </Box>
  );
}