'use client'

import React, { useState } from 'react'
import { createStore } from '@/app/actions/store/action'
import {
  Box,

  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LinkIcon from '@mui/icons-material/Link'
import { BaseButton } from '../users/buttons/BaseButton'
import { useSession } from 'next-auth/react'

export default function CreateStoreForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState('')
  const [previewData, setPreviewData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    mapLink: '',
    logo: null as string | null,
  })

  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    if (session?.user?.id) {
      formData.append('ownerId', session.user.id)
    } else {
      setError('User not authenticated')
      setIsLoading(false)
      return
    }

  

    try {
      const result = await createStore(formData)
      if (result.success) {
        setSuccess(true)
        form.reset()
        setFileName('')
        setPreviewData({
          name: '',
          description: '',
          city: '',
          address: '',
          mapLink: '',
          logo: null,
        })
      } else {
        setError(result.error || 'An error occurred while creating the store')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPreviewData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewData(prev => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{}}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Create Your Store
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Store Name"
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: '50px',
                      boxShadow: 'none',
                      padding: 2,
                      color: 'black',
                      backgroundColor: 'white',
                      border: '1px solid black',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'white',
                        borderColor: 'black',
                      },
                      '&:active': {
                        boxShadow: 'none',
                        backgroundColor: 'white',
                        borderColor: 'black',
                      }

                    }}
                  >
                    {fileName || 'Upload Store Logo'}
                    <input
                      type="file"
                      name="logo"
                      hidden
                      required
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="city"
                    label="City"
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    label="Address"
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="whatsapp number to receive order details"
                    variant="outlined"
                    type="string"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="mapLink"
                    label="Map Link"
                    variant="outlined"
                    type="url"
                    onChange={handleInputChange}
                  />
                </Grid>
               
              </Grid>
              <BaseButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Create Store'}
              </BaseButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
              Store Preview
            </Typography>
            <Card sx={{ maxWidth: 345, mx: 'auto', mt: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={previewData.logo || ''}
                alt={previewData.name || "add Image"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {previewData.name || 'Store Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {previewData.description || 'Store description will appear here...'}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {previewData.city && previewData.address
                      ? `${previewData.city}, ${previewData.address}`
                      : 'City, Address'}
                  </Typography>
                </Box>
                {previewData.mapLink && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" component="a" href={previewData.mapLink} target="_blank" rel="noopener noreferrer">
                      View on Map
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Store created successfully!
        </Alert>
      </Snackbar>
    </Container>
  )
}