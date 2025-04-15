import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/users/landing/appbar/NavBar";
import { Toolbar } from "@mui/material";
import { Providers } from "@/Provider";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/next';
import Footer from "@/components/users/landing/appbar/footer";


const inter = Inter({ subsets: ["latin"] });
const GA_MEASUREMENT_ID = "G-JSHPCHG02T";

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
      <head>

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppRouterCacheProvider>
            <NavBar />
            <Toolbar />
            {children}
            <Analytics />
          </AppRouterCacheProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
