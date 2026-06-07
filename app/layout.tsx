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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecomfort.shop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ecomfort",
  description: "Styles from your City",
  applicationName: "Ecomfort",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Ecomfort",
    description: "Styles from your City",
    siteName: "Ecomfort",
    type: "website",
    images: [
      {
        url: "/logo.png",
        alt: "Ecom-Fort logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ecomfort",
    description: "Styles from your City",
    images: ["/logo.png"],
  },
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
            <Toolbar
              sx={{
                bgcolor: "#f7f7f8",
                minHeight: { xs: 56, sm: 64 },
              }}
            />
            {children}
            <Analytics />
          </AppRouterCacheProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
