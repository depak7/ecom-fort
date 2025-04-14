'use client'

import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Grid,
  Skeleton,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import CheckoutProgress from './CheckoutProgress';


import { AddressText, StyledPaper, StyledTextField } from '@/components/styledcomponents/StyledElements';
import { BaseButton } from '../buttons/BaseButton';
import { useRouter } from 'next/navigation';
import { addAddress, editAddress, deleteAddress, getUserAddresses } from '@/app/actions/cart/action';
import UseCustomToast from '@/components/ui/useCustomToast';

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  isDefault: boolean;
}

export default function DeliveryAddress({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [isLoading, setIsLoading] = useState(true); 
  const [isAddressChangeLoading, setAddressChangeLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { errorToast, successToast } = UseCustomToast();

  const defaultAddress = addresses.find(addr => addr.isDefault)?.id || null;

  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true); 
      const { addresses } = await getUserAddresses(userId);
      setAddresses(addresses || []);
      setIsLoading(false);
      if (addresses && addresses.length === 1) {
        setSelectedAddress(addresses[0].id);
      }
    };
    fetchAddresses();
  }, [userId]);

  const handleProceedToCheckout = () => {
    if (!selectedAddress || addresses.length==0) {
      errorToast("Please add an address to proceed to checkout.");
      return;
    }
    router.push("/cart/address/place-order");  
  };

  const handleAddressChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressChangeLoading(true);
    const selectedAddressId = Number(event.target.value);
    setSelectedAddress(selectedAddressId);
    try {
      const result = await editAddress(selectedAddressId, { isDefault: true });
      if (result.success) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === selectedAddressId
        })));
        
      } else {
        console.error(result.error);
      }
      setAddressChangeLoading(false);
    } catch (error) {
      console.error('Error setting default address:', error);
      setAddressChangeLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
    setFormErrors({});
  };

  const handleNewAddressChange = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [field]: event.target.value });
    // Clear error for this field when user types
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'street', 'city', 'state', 'postalCode', 'country', 'phoneNumber'];
    const errors: Record<string, string> = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!newAddress[field as keyof Address]) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveNewAddress = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await addAddress(userId, {
      ...newAddress as Required<Omit<Address, 'id'>>,
      isDefault: addresses.length === 0, 
      alternatePhoneNumber: newAddress.alternatePhoneNumber || '',
    });
    
    if (result.success) {
      if (result.address) { 
        setAddresses([...addresses, result.address]);
        if (addresses.length === 0) {
          setSelectedAddress(result.address.id);
        }
      }
      setIsAddingNewAddress(false);
      setNewAddress({});
      successToast("Address added successfully!");
    } else {
      errorToast(result.error || "Failed to add address");
      console.error(result.error);
    }
  };

  const handleEditAddress = async (addressId: number) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setNewAddress(addressToEdit);
      setIsAddingNewAddress(true);
      setFormErrors({});
    }
  };

  const handleUpdateAddress = async () => {
    if (!validateForm()) {
      return;
    }

    if (newAddress.id) {
      const result = await editAddress(newAddress.id, newAddress);
      if (result.success) {
        if (result.address) {
          setAddresses(addresses.map(addr => addr.id === newAddress.id ? result.address : addr));
        }
        setIsAddingNewAddress(false);
        setNewAddress({});
        successToast("Address updated successfully!");
      } else {
        errorToast(result.error || "Failed to update address");
        console.error(result.error);
      }
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    setAddressChangeLoading(true);
    const result = await deleteAddress(addressId);
    
    if (result.success) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      if (selectedAddress === addressId) {
        const remainingAddresses = addresses.filter(addr => addr.id !== addressId);
        setSelectedAddress(remainingAddresses[0]?.id || null);
      }
      successToast("Address deleted successfully!");
    } else {
      errorToast(result.error || "Failed to delete address");
      console.error(result.error);
    }
    setAddressChangeLoading(false);
  };

  const AddressSkeleton = () => (
    <StyledPaper>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
        <Skeleton variant="text" width="60%" height={28} />
      </Box>
      <Box sx={{ ml: 4 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="40%" />
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={60} height={36} />
          <Skeleton variant="rectangular" width={60} height={36} />
        </Box>
      </Box>
    </StyledPaper>
  );

  const handleCloseDialog = () => {
    setIsAddingNewAddress(false);
    setNewAddress({});
    setFormErrors({});
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: { xs: 1, sm: 2 } }}>
      <Backdrop open={isAddressChangeLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      <CheckoutProgress />
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Delivery Address
      </Typography>
      <Box sx={{ p: { xs: 1, sm: 2 }, gap: 2, border: "1px solid" }}>
        <Typography fontWeight={700} variant="subtitle1" gutterBottom>
          Select address
        </Typography>
        <RadioGroup
          value={selectedAddress || defaultAddress} 
          onChange={handleAddressChange}
        >
          {isLoading ? (
            [...Array(2)].map((_, index) => (
              <AddressSkeleton key={index} />
            ))
          ) : addresses.length === 0 ? (
            <Typography sx={{ py: 2, textAlign: 'center' }}>
              No saved addresses. Please add a new address.
            </Typography>
          ) : (
            addresses.map((address) => (
              <StyledPaper key={address.id}>
                <FormControlLabel
                  value={address.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: { xs: 0, sm: 4 } }}>{address.name}</Typography>
                      <AddressText>{address.street}</AddressText>
                      <AddressText>{`${address.city}, ${address.state} ${address.postalCode}`}</AddressText>
                      <AddressText>{address.country}</AddressText>
                      <AddressText>{`Phone: ${address.phoneNumber}`}</AddressText>
                      {address.alternatePhoneNumber && <AddressText>{`Alternate Phone: ${address.alternatePhoneNumber}`}</AddressText>}
                      <Box sx={{ mt: 1 }}>
                        <Button onClick={() => handleEditAddress(address.id)}>Edit</Button>
                        <Button onClick={() => handleDeleteAddress(address.id)}>Delete</Button>
                      </Box>
                    </Box>
                  }
                />
              </StyledPaper>
            ))
          )}
        </RadioGroup>
        
        <Box>
          {isAddingNewAddress && (
            <Box sx={{ 
              position: 'relative',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: { xs: 2, sm: 3 },
              mt: 2,
              mb: 2
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {newAddress.id ? 'Edit Address' : 'Add New Address'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Name"
                    placeholder="Full Name"
                    value={newAddress.name || ''}
                    onChange={handleNewAddressChange('name')}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Full Address"
                    placeholder="Street, Apartment, Suite, etc."
                    value={newAddress.street || ''}
                    onChange={handleNewAddressChange('street')}
                    error={!!formErrors.street}
                    helperText={formErrors.street}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="City"
                    placeholder="City"
                    value={newAddress.city || ''}
                    onChange={handleNewAddressChange('city')}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="State/Province"
                    placeholder="State/Province"
                    value={newAddress.state || ''}
                    onChange={handleNewAddressChange('state')}
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Postal Code"
                    placeholder="Postal/ZIP Code"
                    value={newAddress.postalCode || ''}
                    onChange={handleNewAddressChange('postalCode')}
                    error={!!formErrors.postalCode}
                    helperText={formErrors.postalCode}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Country"
                    placeholder="Country"
                    value={newAddress.country || ''}
                    onChange={handleNewAddressChange('country')}
                    error={!!formErrors.country}
                    helperText={formErrors.country}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Phone Number"
                    value={newAddress.phoneNumber || ''}
                    onChange={handleNewAddressChange('phoneNumber')}
                    error={!!formErrors.phoneNumber}
                    helperText={formErrors.phoneNumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Alternate Phone Number"
                    placeholder="Alternate Phone Number (Optional)"
                    value={newAddress.alternatePhoneNumber || ''}
                    onChange={handleNewAddressChange('alternatePhoneNumber')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'flex-end',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: 1
                  }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleCloseDialog}
                      fullWidth={window.innerWidth < 600}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                      Cancel
                    </Button>
                    <BaseButton 
                      onClick={newAddress.id ? handleUpdateAddress : handleSaveNewAddress}
                      style={{ width: window.innerWidth < 600 ? '100%' : 'auto' }}
                    >
                      {newAddress.id ? 'Update Address' : 'Save Address'}
                    </BaseButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        {!isAddingNewAddress && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexDirection: { xs: 'column', sm: 'row' },
            mt: 2
          }}>
            <BaseButton
              style={{
                marginTop: '16px',
                width: window.innerWidth < 600 ? '100%' : 'auto',
              }}
              onClick={handleAddNewAddress}
            >
              Add Address
            </BaseButton>
          </Box>
        )}
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: 2,
        width: '100%'
      }}>
        <BaseButton 
          onClick={handleProceedToCheckout}
          style={{ width: window.innerWidth < 600 ? '100%' : 'auto' }}
        >
          Proceed to Checkout
        </BaseButton>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Address added successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}