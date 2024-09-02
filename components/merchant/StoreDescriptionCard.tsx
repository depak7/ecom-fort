'use client'

import React, { useState } from 'react'
import { Button, TextField, Typography, Box, Stack } from '@mui/material'
import { Link as LinkIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import Image from 'next/image'

type StoreType = {
  address: string
  name: string
  logo: string
  description: string
  city: string
  mapLink: string
  ownerId: string
  id: string
  bannerImage: string | null
  offerDescription: string | null
}

type StoreDescriptionCardProps = {
  store: StoreType
}

export default function StoreDescriptionCard({ store: initialStore }: StoreDescriptionCardProps) {
  const [store, setStore] = useState<StoreType>(initialStore)
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => setIsEditing(true)

  const handleSave = async () => {
    // TODO: Implement API call to save store data
    // For example: await updateStore(store)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStore(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {isEditing ? (
          <TextField
            variant="outlined"
            name="name"
            value={store.name}
            onChange={handleChange}
            fullWidth
            inputProps={{ style: { fontSize: 24, fontWeight: 'bold' } }}
          />
        ) : (
          <Typography variant="h4">{store.name}</Typography>
        )}
        {isEditing ? (
          <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        ) : (
          <Button variant="contained" onClick={handleEdit} startIcon={<EditIcon />}>
            Edit Details
          </Button>
        )}
      </Box>
      <Box sx={{ position: 'relative', height: 256, mb: 3 }}>
        <Image
          src={store.bannerImage || '/placeholder.svg?height=256&width=512'}
          alt="Store Banner"
          fill
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Box sx={{ position: 'relative', width: 200, height: 128, mb: 2 }}>
          <Image
            src={store.logo || '/placeholder.svg?height=128&width=128'}
            alt="Store Logo"
            fill
            style={{ objectFit: 'cover'}}
          />
        </Box>
        {isEditing ? (
          <Stack spacing={2} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              label="Description"
              name="description"
              value={store.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="Offer"
              name="offerDescription"
              value={store.offerDescription || ''}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="City"
              name="city"
              value={store.city}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="Map Link"
              name="mapLink"
              value={store.mapLink}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        ) : (
          <>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              {store.description}
            </Typography>
            {store.offerDescription && (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Offer: {store.offerDescription}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <InsertLinkIcon fontSize="small" sx={{ mr: 1 }} /> {store.city}
            </Typography>
            {store.mapLink && (
              <Button
                href={store.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                startIcon={<LinkIcon />}
                sx={{ mt: 1 }}
              >
                View on Map
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
