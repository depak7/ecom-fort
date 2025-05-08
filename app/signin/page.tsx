"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import { Box, Typography, Container, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material"
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material"
import { StyledTextField, TypographyButton } from "@/components/styledcomponents/StyledElements"
import { BaseButton } from "@/components/users/buttons/BaseButton"
import UseCustomToast from "@/components/ui/useCustomToast"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState("")

  const { errorToast, successToast } = UseCustomToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isForgotPassword = searchParams.get("forgot-password") === "true"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      errorToast("username or password invalid")
      console.error(result.error)
    } else {
      successToast("login Successfull")
      router.push("/")
    }
  }

  const handleForgotPassword = () => {
    router.push("/signin?forgot-password=true")
  }

  const handleBackToLogin = () => {
    setResetSuccess(false)
    setResetError("")
    router.push("/signin")
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setResetError("")
    setResetSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResetError(data.error || "Failed to send reset link")
        errorToast(data.error || "Failed to send reset link")
      } else {
        setResetSuccess(true)
        successToast("Password reset link sent to your email")
      }
    } catch (error) {
      setResetError("An error occurred. Please try again later.")
      errorToast("An error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigation = () => {
    router.push("/signup")
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        {isForgotPassword ? (
          // Forgot Password Form
          <>
            <Typography component="h1" variant="h5" fontWeight={700}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center", mb: 2 }}>
              Enter your email address and we'll send you a link to reset your password
            </Typography>

            {resetSuccess && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                Password reset link has been sent to your email address.
              </Alert>
            )}

            {resetError && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {resetError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleForgotPasswordSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="forgotEmail"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <BaseButton type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Sending...
                  </Box>
                ) : (
                  "Send Reset Link"
                )}
              </BaseButton>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <TypographyButton
                  variant="body2"
                  onClick={handleBackToLogin}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ArrowBack fontSize="small" sx={{ mr: 0.5 }} /> Back to Login
                </TypographyButton>
              </Box>
            </Box>
          </>
        ) : (
          // Login Form
          <>
            <Typography component="h1" variant="h5" fontWeight={700}>
              Log In
            </Typography>
            <TypographyButton onClick={handleNavigation} variant="body2" sx={{ mt: 1 }}>
              New to Ecom-fort? Sign up for an account
            </TypographyButton>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                  ml: 2,
                }}
              >
                <TypographyButton variant="body2" onClick={handleForgotPassword}>
                  Forgot Password?
                </TypographyButton>
              </Box>
              <BaseButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Log In
              </BaseButton>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}
