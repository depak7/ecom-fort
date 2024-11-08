"use client"

import React, { useState } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Container,
} from '@mui/material'
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import Image from 'next/image'
import { Decimal } from 'decimal.js'
import { BaseButton } from '@/components/users/buttons/BaseButton'
import { OutlinedButton } from '@/components/styledcomponents/StyledElements'

interface Size {
  id: number
  size: string
  stock: number
}

interface Variant {
  id: number
  color: string
  sizes: Size[]
  variantImage: string
  images: any[] 
}

interface Product {
  id: string
  name: string
  category: string | null
  description: string
  price: Decimal
  variants: Variant[]
  previewImage: string | null
  availableSizes: string[]
  totalStock: number
}

interface MerchantProductCardProps {
  products: Product[] | undefined

}

export default function MerchantProductCard({ products }: MerchantProductCardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [activeVariant, setActiveVariant] = useState(0)

  const handleEditClick = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)))
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduct(null)
    setActiveVariant(0)
  }

  const handleSaveChanges = () => {
    if (editingProduct) {
      // onUpdateProduct(editingProduct)
      handleCloseDialog()
    }
  }

  const handleStockChange = (variantIndex: number, sizeIndex: number, value: string) => {
    if (editingProduct) {
      const updatedVariants = [...editingProduct.variants]
      updatedVariants[variantIndex].sizes[sizeIndex].stock = parseInt(value, 10)
      setEditingProduct({ ...editingProduct, variants: updatedVariants })
    }
  }

  const handlePriceChange = (value: string) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, price: new Decimal(value) })
    }
  }

  const calculateTotalStock = (variants: Variant[]): number => {
    return variants.reduce((total, variant) => 
      total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0)
  }

  return (
    <Container >
      <Typography variant='h5' sx={{ml:4,mb:2}} fontWeight={700}>Manage Products</Typography>
      <Grid container spacing={3} ml={1}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.previewImage && (
                <CardMedia
                  component="div"
                  sx={{ height: 200, position: 'relative' }}
                >
                  <Image
                    src={product.previewImage}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </CardMedia>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                {product.category && (
                  <Chip label={product.category} size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="h6" sx={{ mt: 1 }}>
                ₹{product.price.toString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {product.description}
                </Typography>
                <Box sx={{ mt: 2 ,display:"flex",alignItems:"center",gap:2}}>
                 <Typography fontWeight={700}> Available Sizes :</Typography>
                  {product.availableSizes.map((size) => (
                    <Chip
                      key={size}
                      label={size.toUpperCase()}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{display:"flex",alignItems:"center",gap:2}}>
                <Typography variant="body2"  fontWeight={700}  sx={{ mt: 1 }}>
                  Total Stock:
                </Typography>
                <Typography variant='body2'>
                <Typography variant="body2" sx={{ mt: 1 }}>
                 {product.totalStock}
                </Typography>
                </Typography>
                </Box>
                
              </CardContent>
              <BaseButton
                startIcon={<EditIcon />}
                onClick={() => handleEditClick(product)}
                sx={{ m: 2 }}
              >
                Edit
              </BaseButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Product
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingProduct && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={editingProduct.price.toString()}
                onChange={(e) => handlePriceChange(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Tabs
                value={activeVariant}
                onChange={(_, newValue) => setActiveVariant(newValue)}
                sx={{ mb: 2 }}
              >
                {editingProduct.variants.map((variant, index) => (
                  <Tab key={variant.id} label={`Variant ${index + 1}`} />
                ))}
              </Tabs>
              {editingProduct.variants.map((variant, variantIndex) => (
                <Box key={variant.id} hidden={activeVariant !== variantIndex}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {variant.color}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Image
                        src={variant.variantImage}
                        alt={`${editingProduct.name} - ${variant.color}`}
                        width={200}
                        height={200}
                        objectFit="cover"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {variant.sizes.map((size, sizeIndex) => (
                        <TextField
                          key={size.id}
                          label={`Stock for ${size.size}`}
                          type="number"
                          fullWidth
                          value={size.stock}
                          onChange={(e) => handleStockChange(variantIndex, sizeIndex, e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Typography variant="body1" sx={{ mt: 2 }}>
                Total Stock: {calculateTotalStock(editingProduct.variants)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <OutlinedButton onClick={handleCloseDialog} >
            Cancel
          </OutlinedButton>
          <BaseButton
            onClick={handleSaveChanges}
     
            startIcon={<SaveIcon />}
          >
            Save Changes
          </BaseButton>
        </DialogActions>
      </Dialog>
    </Container>
  )
}