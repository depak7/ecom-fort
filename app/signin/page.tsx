"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import GoogleIcon from "@mui/icons-material/Google";
import {
  OutlinedButton,
  StyledTextField,
  TypographyButton,
} from "@/components/styledcomponents/StyledElements";
import { BaseButton } from "@/components/users/buttons/BaseButton";
import UseCustomToast from "@/components/ui/useCustomToast";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { errorToast, successToast } = UseCustomToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          Log In
        </Typography>
        <TypographyButton onClick={handleNavigation} variant="body2"  sx={{ mt: 1}}>
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
            <TypographyButton variant="body2" >Forgot Password?</TypographyButton>
          </Box>
          <BaseButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </BaseButton>
        </Box>
      </Box>
    </Container>
  );
}
