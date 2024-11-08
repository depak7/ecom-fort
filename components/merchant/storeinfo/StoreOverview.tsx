'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import { BaseButton } from '@/components/users/buttons/BaseButton'

interface StoreData {
  name: string;
  address: string;
  id: string;
  description: string;
  city: string;
  mapLink: string;
  logo: string;
  bannerImage: string | null;
  offerDescription: string | null;
  ownerId: string;
}

export default function StoreOverview({ initialStoreData }: { initialStoreData: StoreData }) {
  const [storeData, setStoreData] = useState<StoreData>(initialStoreData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState<StoreData>(initialStoreData)

  const handleEditDialogOpen = () => {
    setEditedData(storeData)
    setIsEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData(prev => ({ ...prev, [name]: value }))
  }

  const handleStoreInfoUpdate = async () => {
    setIsLoading(true)
    setError(null)

    // try {
    //   const result = await updateStore(editedData)
    //   if (result.success) {
    //     setStoreData(editedData)
    //     setSuccess(true)
    //     handleEditDialogClose()
    //   } else {
    //     setError(result.error || 'An error occurred while updating the store')
    //   }
    // } catch (err) {
    //   setError('An unexpected error occurred')
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={storeData.logo || '/placeholder.svg?height=200&width=400'}
                alt={storeData.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {storeData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {storeData.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {storeData.city}, {storeData.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" component="a" href={storeData.mapLink} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <BaseButton
                startIcon={<EditIcon />}
                onClick={handleEditDialogOpen}
              >
                Edit Store Info
              </BaseButton>
            </Box>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
          
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">Total Products: 0</Typography>
            </Paper>
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">Total Orders: 0</Typography>
            </Paper>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="body1">Revenue: $0</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Store Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Make changes to your store information here. Click save when you're done.
          </DialogContentText>
          <TextField
            margin="dense"
            name="name"
            label="Store Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editedData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={editedData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={editedData.city}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={editedData.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="mapLink"
            label="Map Link"
            type="url"
            fullWidth
            variant="outlined"
            value={editedData.mapLink}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleStoreInfoUpdate} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

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
          Store information updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  )
}