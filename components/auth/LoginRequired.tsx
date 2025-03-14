"use client"

import { Box, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BaseButton } from "@/components/users/buttons/BaseButton"
import login from '@/components/assets/users/login-ecom.png'

interface LoginRequiredProps {
  message?: string
  showImage?: boolean
  imageSize?: number
}

export default function LoginRequired({
  message = "Please sign in to access this feature.",
  showImage = true,
  imageSize = 250,
}: LoginRequiredProps) {
  const pathname = usePathname()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
        minHeight: "60vh",
      }}
    >
      <Box sx={{ maxWidth: "400px", mb: 4 }}>
        {showImage && (
          <Image
            src={login}
            alt="Login Required"
            width={imageSize}
            height={imageSize}
            style={{ marginBottom: "1.5rem" }}
          />
        )}
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Login Required
        </Typography>
        <Typography color="text.secondary" mb={4}>
          {message}
        </Typography>
        <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} style={{ textDecoration: "none" }}>
          <BaseButton sx={{ mr: 2 }}>Sign In</BaseButton>
        </Link>
        <Link href="/" style={{ textDecoration: "none" }}>
          <BaseButton variant="outlined">Continue Shopping</BaseButton>
        </Link>
      </Box>
    </Box>
  )
}

