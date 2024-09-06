import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/users/landing/appbar/NavBar";
import { Toolbar } from "@mui/material";
import {Providers} from "@/Provider";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecom-Fort",
  description: "Styles from your City",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <Providers>
     
      <AppRouterCacheProvider>
      <NavBar/>
      <Toolbar/>
        {children}
        </AppRouterCacheProvider>
        </Providers>
        <Toaster  richColors position="top-right"/>
      
        </body>
    </html>
  );
}
