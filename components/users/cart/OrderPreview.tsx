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
import Image from 'next/image'

import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { WhatsApp, ShoppingCart } from '@mui/icons-material'

import { removeFromCart } from '@/app/actions/cart/action'
import UseCustomToast from '@/components/ui/useCustomToast'
import { addOrders } from '@/app/actions/order/action'
import { useRouter } from 'next/navigation'

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
  phoneNumber: string
}

interface ShoppingCartProps {
  stores: Store[]
  userId: string | null
  totalQuantity: number
  totalPrice: number
  address:any
}

export default function OrderPreview({ stores, userId, totalQuantity, totalPrice,address }: ShoppingCartProps) {
  const [cartStores, setCartStores] = useState<Store[]>(stores)
  const { errorToast, successToast } = UseCustomToast();
  const route=useRouter();


  useEffect(() => {
    setCartStores(stores)
  }, [stores, address])

  const handlePlaceOrder = async () => {
    try {
      const { success,order } = await addOrders({
        userId,
        address,
        stores: cartStores,
      })
  
      if (success) {
        successToast('Order Placed')
        route.push("/order-placed")
      } else {
        errorToast('Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      errorToast('Something went wrong while placing the order')
    }
  }
  

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

    message += `\n\nDelivery Address:\n`;
    message += `${address.name}\n`;
    message += `${address.street}\n`;
    message += `${address.city}, ${address.state} ${address.postalCode}\n`;
    message += `${address.country}\n`;
    message += `Phone: ${address.phoneNumber}\n`;
    if (address.alternatePhoneNumber) {
      message += `Alternate Phone: ${address.alternatePhoneNumber}\n`;
    }
    
    return encodeURIComponent(message);
  };
  
  const handleSendWhatsApp = (store: Store) => {
    const whatsappUrl = `https://wa.me/91${store.phoneNumber}?text=${formatWhatsAppMessage(store)}`
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
                          <Image 
                            src={product.variant.image || '/placeholder.svg?height=80&width=80'}
                            alt={product.product.name}
                            width={80}
                            height={80}
                            style={{ marginRight: 16 }}
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' ,gap:2}}>
              { /*<Button variant='contained'
                onClick={() => handleSendWhatsApp(store)}
                sx={{bgcolor:"green",":hover":{bgcolor:"green"}}}
              >
                <WhatsApp />
                Order Now via WhatsApp
              </Button> */}
              <Button variant='contained'
              onClick={handlePlaceOrder}
                sx={{bgcolor:"black",":hover":{bgcolor:"black"}}}
              >
               place Order
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
      textAlign: { xs: 'center', sm: 'left' }, // Center text for smaller screens
      gap: { xs: 2, sm: 0 }, // Add spacing between items for mobile
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', sm: 'flex-start' }, // Center items on mobile
      }}
    >
      <ShoppingCart sx={{ fontSize: 40, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }} />
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Total Items
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {totalQuantity}
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        textAlign: { xs: 'center', sm: 'right' },
        mt: { xs: 2, sm: 0 }, // Add margin for mobile
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Total Amount
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        ₹{formatPrice(totalPrice)}
      </Typography>
    </Box>
  </Box>
</Paper>

    </Box>
  )
}