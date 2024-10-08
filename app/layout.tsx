import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/users/landing/appbar/NavBar";
import { Toolbar } from "@mui/material";

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
      <AppRouterCacheProvider>
      <NavBar/>
      <Toolbar/>
        {children}
        </AppRouterCacheProvider>
        </body>
    </html>
  );
}
