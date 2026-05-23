'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { LocationProvider } from '@/components/users/location/LocationProvider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
 return (
 <SessionProvider>
   <LocationProvider>
     {children}
   </LocationProvider>
 </SessionProvider>
 );
};
