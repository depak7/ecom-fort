'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { WhatsApp, ShoppingCart } from '@mui/icons-material'

import { removeFromCart } from '@/app/actions/cart/action'

interface CartItem {
  id: number
  quantity: number
  price: number | string
  product: {
    id: string
    name: string
    category: string | null
  }
  variant: {
    id: number
    image: string | null
    availableSizes: Array<{ id: number; name: string }>
  }
  size: {
    id: number
    name: string
  }
  isWishlisted: boolean
}

interface Store {
  id: string
  name: string
  items: CartItem[]
  PhoneNumber: string
}

interface ShoppingCartProps {
  stores: Store[]
  userId: string | null
  totalQuantity: number
  totalPrice: number
}

export default function OrderPreview({ stores, userId, totalQuantity, totalPrice }: ShoppingCartProps) {
  const [cartStores, setCartStores] = useState<Store[]>(stores)
 
  useEffect(() => {
    setCartStores(stores)
  }, [stores])

  const handleRemoveItem = async (storeId: string, itemId: number) => {
    try {
      const result = await removeFromCart(userId || '', itemId)
      if (result.success) {
        console.log(`Item ${itemId} removed from cart`)
        setCartStores((prevStores) =>
          prevStores.map((store) => {
            if (store.id === storeId) {
              return {
                ...store,
                items: store.items.filter((item) => item.id !== itemId),
              }
            }
            return store
          }).filter((store) => store.items.length > 0)
        )
      } else {
        console.error('Failed to remove item:', result.error)
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }

  const formatWhatsAppMessage = (store: Store) => {
    let message = `Hello, I'd like to place an order from ${store.name}:\n\n`;
    
    store.items.forEach((item) => {
      const imageUrl = item.variant.image || '/placeholder.svg';
      message += `${item.product.name} (Size: ${item.size.name}) x${item.quantity} - ₹${formatPrice(item.price)}\n`;
      message += `Image: ${imageUrl}\n`;  
    });
  
    const storeTotal = store.items.reduce((sum, item) => sum + item.quantity * parseFloat(formatPrice(item.price)), 0);
    message += `\nTotal: ₹${storeTotal.toFixed(2)}`;
    
    return encodeURIComponent(message);
  };
  
  const handleSendWhatsApp = (store: Store) => {
    const whatsappUrl = `https://wa.me/${store.PhoneNumber}?text=${formatWhatsAppMessage(store)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Order Preview
      </Typography>
      {cartStores.map((store) => (
        <Accordion key={store.id} defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight={700}>{store.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Size</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {store.items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={product.variant.image || '/placeholder.svg?height=80&width=80'}
                            alt={product.product.name}
                            style={{ width: 80, height: 80, marginRight: 16 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">{product.product.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.product.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            p: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          Size : {product.size.name}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="right">₹{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(store.id, product.id)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='contained'
                onClick={() => handleSendWhatsApp(store)}
                sx={{bgcolor:"green",":hover":{bgcolor:"green"}}}
              >
                <WhatsApp />
                Order Now via WhatsApp
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Total Items
              </Typography>
              <Typography variant="h4" fontWeight={700} >
                {totalQuantity}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight={700}>
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight={700} >
              ₹{formatPrice(totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}