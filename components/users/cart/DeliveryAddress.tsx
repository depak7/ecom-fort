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
  IconButton,
  Backdrop,
  CircularProgress,

} from '@mui/material';
import CheckoutProgress from './CheckoutProgress';

import CloseIcon from '@mui/icons-material/Close'; 

import { AddressText, StyledPaper, StyledTextField } from '@/components/styledcomponents/StyledElements';
import { BaseButton } from '../buttons/BaseButton';
import { useRouter } from 'next/navigation';
import { addAddress, editAddress, deleteAddress, getUserAddresses } from '@/app/actions/cart/action';

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
  const[isAddressChangeLoading,setAddressChangeLoading]=useState<boolean>(false);



  const defaultAddress = addresses.find(addr => addr.isDefault)?.id || null;

  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true); 
      const { addresses } = await getUserAddresses(userId);
      setAddresses(addresses || []);
      setIsLoading(false);
    };
    fetchAddresses();
  }, [userId]);

  const handleProceedToCheckout = () => {
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
  };

  const handleNewAddressChange = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [field]: event.target.value });
  };

  const handleSaveNewAddress = async () => {
    if (newAddress.name && newAddress.street && newAddress.city && newAddress.state && newAddress.postalCode && newAddress.country && newAddress.phoneNumber) {
      const result = await addAddress(userId, {
        ...newAddress as Required<Omit<Address, 'id'>>,
        isDefault: addresses.length === 0, 
        alternatePhoneNumber: newAddress.alternatePhoneNumber || '',
      });
      if (result.success) {
        if (result.address) { 
          setAddresses([...addresses, result.address]);
        }
        setIsAddingNewAddress(false);
        setNewAddress({});
      } else {
        console.error(result.error);
      }
    }
  };

  const handleEditAddress = async (addressId: number) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setNewAddress(addressToEdit);
      setIsAddingNewAddress(true);
    }
  };

  const handleUpdateAddress = async () => {
    if (newAddress.id) {
      const result = await editAddress(newAddress.id, newAddress);
      if (result.success) {
        if (result.address) {
          setAddresses(addresses.map(addr => addr.id === newAddress.id ? result.address : addr));
        }
        setIsAddingNewAddress(false);
        setNewAddress({});
      } else {
        console.error(result.error);
      }
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    const result = await deleteAddress(addressId);
    setAddressChangeLoading(true);
    if (result.success) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      if (selectedAddress === addressId) {
        setSelectedAddress(addresses[0]?.id || null);
      }
    } else {
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
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 2 }}>
          <Backdrop open={isAddressChangeLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      <CheckoutProgress />
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Delivery Address
      </Typography>
      <Box sx={{ p: 2, gap: 2, border: "1px solid" }}>
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
          ) : (
            addresses.map((address) => (
              <StyledPaper key={address.id}>
                <FormControlLabel
                  value={address.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{fontWeight:700,ml:4}}>{address.name}</Typography>
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
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, color: 'red' }}
              >
                <CloseIcon />
              </IconButton>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Name"
                    value={newAddress.name || ''}
                    onChange={handleNewAddressChange('name')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Street"
                    value={newAddress.street || ''}
                    onChange={handleNewAddressChange('street')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="City"
                    value={newAddress.city || ''}
                    onChange={handleNewAddressChange('city')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="State"
                    value={newAddress.state || ''}
                    onChange={handleNewAddressChange('state')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Postal Code"
                    value={newAddress.postalCode || ''}
                    onChange={handleNewAddressChange('postalCode')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Country"
                    value={newAddress.country || ''}
                    onChange={handleNewAddressChange('country')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Phone Number"
                    value={newAddress.phoneNumber || ''}
                    onChange={handleNewAddressChange('phoneNumber')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    placeholder="Alternate Phone Number"
                    value={newAddress.alternatePhoneNumber || ''}
                    onChange={handleNewAddressChange('alternatePhoneNumber')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <BaseButton onClick={newAddress.id ? handleUpdateAddress : handleSaveNewAddress}>
                    {newAddress.id ? 'Update Address' : 'Save New Address'}
                  </BaseButton>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        {!isAddingNewAddress && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <BaseButton
              style={{
                marginTop: '16px',
              }}
              onClick={handleAddNewAddress}
            >
              Add Address
            </BaseButton>
          </Box>
        )}
      </Box>
      <Box sx={{display:"flex",justifyContent:"flex-end" ,mt:2}}>
        <BaseButton onClick={handleProceedToCheckout}>Proceed to Checkout</BaseButton>
      </Box>
    </Box>
  )
}
