"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  StyledTextField,
  TypographyButton,
} from "@/components/styledcomponents/StyledElements";
import { BaseButton } from "@/components/users/buttons/BaseButton";
import UseCustomToast from "@/components/ui/useCustomToast";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { errorToast, successToast } = UseCustomToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const forgotPassword = searchParams.get("forgot-password");
    setIsForgotPassword(forgotPassword === "true");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          successToast("Check your email for password reset link");
          router.push("/signin");
        } else {
          errorToast("Failed to send reset link");
        }
      } catch (error) {
        errorToast("Something went wrong");
        console.error(error);
      }
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      errorToast("username or password invalid");
      console.error(result.error);
    } else {
      successToast("login Successfull");
      router.push("/");
    }
  };

  const handleNavigation = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/signin?forgot-password=true");
  };

  const handleBackToSignIn = () => {
    router.push("/signin");
  };

  return (
    <Container component="main" maxWidth="xs" >
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
        <Typography component="h1" variant="h5" fontWeight={700}>
          {isForgotPassword ? "Reset Password" : "Log In"}
        </Typography>
        {!isForgotPassword && (
          <TypographyButton onClick={handleNavigation} variant="body2" sx={{ mt: 1 }}>
            New to Ecom-fort? Sign up for an account
          </TypographyButton>
        )}
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
          {!isForgotPassword && (
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
          )}
          {!isForgotPassword && (
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
          )}
          <BaseButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isForgotPassword ? "Send Reset Link" : "Log In"}
          </BaseButton>
          {isForgotPassword && (
            <TypographyButton
              variant="body2"
              onClick={handleBackToSignIn}
              sx={{ textAlign: "center", display: "block" }}
            >
              Back to Sign In
            </TypographyButton>
          )}
        </Box>
      </Box>
    </Container>
  );
}
