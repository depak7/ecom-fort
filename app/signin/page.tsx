'use client'

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { OutlinedButton, StyledTextField, TypographyButton } from '@/components/styledcomponents/StyledElements';
import { BaseButton } from '@/components/users/buttons/BaseButton';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      router.push('/');
    }
  };

  const handleNavigation=()=>{
    router.push('/signup')
  }
  return (
    <Container component="main" maxWidth="xs" >
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" fontWeight={700}>
          Log In
        </Typography>
        <TypographyButton onClick={handleNavigation}  sx={{ mt: 1 }}>
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
            type={showPassword ? 'text' : 'password'}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1,ml:2 }}>
          
<TypographyButton>Forgot Password?</TypographyButton>
          </Box>
          <BaseButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </BaseButton>
          <Divider sx={{ my: 2 }}>OR</Divider>
        
          <OutlinedButton
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => signIn('google')}
          >
            Continue with Google
          </OutlinedButton>
        </Box>
      </Box>
    </Container>
  );
}