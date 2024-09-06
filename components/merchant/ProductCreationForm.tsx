'use client'

import React, { useState } from 'react'

import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,

} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { createProduct } from '@/app/actions/products/action' 
import { OutlinedButton, StyledTextField } from '../styledcomponents/StyledElements'
import { BaseButton } from '../users/buttons/BaseButton'
import ProductCard from '../users/products/ProductCard'

export default function ProductCreationForm({ storeId, storeName }: { storeId: string; storeName: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [variants, setVariants] = useState([{ color: '', sizes: [{ size: '', stock: 0 }] }])
  const [previewData, setPreviewData] = useState({
    name: '',
    price: '',
    image: null as string | null,

  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
  
    const form = e.currentTarget
    const formData = new FormData(form)
  
    // Append variants data
    variants.forEach((variant, index) => {
      formData.append(`color-${index}`, variant.color)
      
      const variantImageInput = form.querySelector(`#variantImage-${index}`) as HTMLInputElement
      if (variantImageInput && variantImageInput.files && variantImageInput.files[0]) {
        formData.append(`variantImage-${index}`, variantImageInput.files[0])
      }
      
      const additionalImagesInput = form.querySelector(`#additionalImages-${index}`) as HTMLInputElement
      if (additionalImagesInput && additionalImagesInput.files) {
        for (let i = 0; i < additionalImagesInput.files.length; i++) {
          formData.append(`additionalImages-${index}`, additionalImagesInput.files[i])
        }
      }
      
      variant.sizes.forEach((size, sizeIndex) => {
        formData.append(`size-${index}-${sizeIndex}`, size.size)
        formData.append(`stock-${index}-${sizeIndex}`, size.stock.toString())
      })
    })
  
    formData.append('storeId', storeId)
    try {
      const result = await createProduct(formData)
      console.log(result)
      if (result.success) {
        setSuccess(true)
        form.reset()
        setVariants([{ color: '', sizes: [{ size: '', stock: 0 }] }])
        setPreviewData({ name: '', price: '', image: null })
      } else {
        setError(result.error || 'An error occurred while creating the product')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { color: '', sizes: [{ size: '', stock: 0 }] }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addSize = (variantIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].sizes.push({ size: '', stock: 0 })
    setVariants(newVariants)
  }

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex)
    setVariants(newVariants)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPreviewData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewData(prev => ({ ...prev, image: event.target?.result as string }))
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{  }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'text.primary' }}>
              Add New Product
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    required
                    fullWidth
                    name="name"
                    label="Product Name"
                    variant="outlined"
                    onChange={handleInputChange}
                  
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    required
                    fullWidth
                    name="brandname"
                    label="BrandName"
                    variant="outlined"
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                   
                  />
                </Grid>
                <Grid item xs={12}>
                <StyledTextField
                    required
                    fullWidth
                    name="category"
                    label="category"
                    variant="outlined"
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}

                  />
                  </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    required
                    fullWidth
                    name="price"
                    label="Price"
                    type="number"
                    variant="outlined"
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                   
                  />
                </Grid>

                {variants.map((variant, variantIndex) => (
                  <Grid item xs={12} key={variantIndex}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                        Variant {variantIndex + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Color"
                            value={variant.color}
                            onChange={(e) => {
                              const newVariants = [...variants]
                              newVariants[variantIndex].color = e.target.value
                              setVariants(newVariants)
                            }}
                           
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            type="file"
                            name={`variantImage-${variantIndex}`}
                            accept="image/*"
                            required
                            style={{ display: 'none' }}
                            id={`variantImage-${variantIndex}`}
                            onChange={handleImageChange}
                          />
                          <label htmlFor={`variantImage-${variantIndex}`}>
                            <Button
                              variant="outlined"
                              component="span"
                              fullWidth
                              sx={{
                                color: 'text.primary',
                                borderColor: 'text.primary',
                                '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
                              }}
                            >
                              Upload Variant Image
                            </Button>
                          </label>
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            type="file"
                            name={`additionalImages-${variantIndex}`}
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            id={`additionalImages-${variantIndex}`}
                          />
                          <label htmlFor={`additionalImages-${variantIndex}`}>
                            <Button
                              variant="outlined"
                              component="span"
                              fullWidth
                              sx={{
                                color: 'text.primary',
                                borderColor: 'text.primary',
                                '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
                              }}
                            >
                              Upload Additional Images
                            </Button>
                          </label>
                        </Grid>
                        {variant.sizes.map((size, sizeIndex) => (
                          <Grid item xs={12} sm={6} key={sizeIndex}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StyledTextField
                                required
                                label="Size"
                                value={size.size}
                                onChange={(e) => {
                                  const newVariants = [...variants]
                                  newVariants[variantIndex].sizes[sizeIndex].size = e.target.value
                                  setVariants(newVariants)
                                }}
                               
                              />
                              <StyledTextField
                                required
                                label="Stock"
                                type="number"
                                value={size.stock}
                                onChange={(e) => {
                                  const newVariants = [...variants]
                                  newVariants[variantIndex].sizes[sizeIndex].stock = parseInt(e.target.value, 10)
                                  setVariants(newVariants)
                                }}
                                InputProps={{ inputProps: { min: 0 } }}
                              
                              />
                              <IconButton onClick={() => removeSize(variantIndex, sizeIndex)} sx={{ color: 'error.main' }}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <OutlinedButton
                            startIcon={<AddIcon />}
                            onClick={() => addSize(variantIndex)}
                            sx={{ color: 'text.primary' }}
                          >
                            Add Size
                          </OutlinedButton>
                        </Grid>
                      </Grid>
                      {variantIndex > 0 && (
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => removeVariant(variantIndex)}
                          sx={{ mt: 2, color: 'error.main' }}
                        >
                          Remove Variant
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <OutlinedButton
                    startIcon={<AddIcon />}
                    onClick={addVariant}
                    sx={{ color: 'text.primary' }}
                  >
                    Add Variant
                  </OutlinedButton>
                </Grid>
              </Grid>
              <BaseButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  '&:hover': { bgcolor: 'text.secondary' }
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Create Product'}
              </BaseButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: 'text.primary',fontWeight:700 }}>
              Product Preview
            </Typography>

            <ProductCard   product={{
     
        name: previewData.name || 'N/A',
        category: 'Some Category', 
        price: previewData.price || '0.00',
        store: storeName,
       
        image: previewData.image|| '/placeholder-image.png',
      }}
    />
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
          Product created successfully!
        </Alert>
      </Snackbar>
    </Container>
  )
}