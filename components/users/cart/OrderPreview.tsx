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
  CircularProgress,
  Backdrop,
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
  storeOwnerMailId:string
}

interface ShoppingCartProps {
  stores: Store[]
  userId: string | null
  totalQuantity: number
  totalPrice: number
  address: any
}

export default function OrderPreview({ stores, userId, totalQuantity, totalPrice, address }: ShoppingCartProps) {
  const [cartStores, setCartStores] = useState<Store[]>(stores)
  const [isLoading, setIsLoading] = useState(false)
  const { errorToast, successToast } = UseCustomToast();
  const route = useRouter();


  useEffect(() => {
    setCartStores(stores)
  }, [stores, address])

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      const { success, order } = await addOrders({
        userId,
        address,
        stores: cartStores,
      })
   
      if (success) {
        console.log(order)
        console.log("Sending email...");
        await sendEmailToSeller(order)
        successToast('Order Placed')
        route.push(`/order-placed/${order?.orderId}`)
      } else {
        errorToast('Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      errorToast('Something went wrong while placing the order')
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailToSeller = async (order: any) => {
    const emailContent = {
      to:cartStores[0].storeOwnerMailId,
      subject: `New Order from ${order.userName}`,
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .navbar {
      background-color: #000000;
      padding: 15px 20px;
      text-align: center;
    }
    .logo-placeholder img {
      width: 150px; /* Adjust logo size */
    }
    .content {
      padding: 20px;
    }
    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 15px 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .highlight {
      background-color: #f8f8f8;
      padding: 15px;
      border-left: 4px solid #000;
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      background-color: #000;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 15px;
    }
    .important {
      color: #d9534f;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="navbar">
      <!-- Logo in Navbar -->
      <div class="logo-placeholder">
        <img src="https://i.ibb.co/Vccqnv69/ecom-fort.png" alt="Ecom Fort Logo" />
      </div>
    </div>
    
    <div class="content">
      <div class="header">
        <h1>New Order Received</h1>
        <p>You have received a new order from Ecom Fort. Please review the details below and contact the customer to arrange payment.</p>
      </div>
      
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>User Name:</strong> ${order.userName}</p>
      <p><strong>Email:</strong> ${order.userEmail}</p>
      <p><strong>Shipping Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
      <p><strong>Phone:</strong> ${order.shippingAddress.phoneNumber}</p>
      <p><strong>Alternate Phone:</strong> ${order.shippingAddress.alternatePhoneNumber || 'N/A'}</p>

      <h3>Ordered Products:</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderedItems.map((item) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
              <td><img src="${item.productImage}" alt="${item.productName}" width="100" /></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Total Amount: ₹${order.totalAmount}</h3>
      
      <div class="highlight">
        <p><span class="important">Action Required:</span> Please contact the customer to confirm payment details.</p>
        <p>Once payment is confirmed, please begin processing the order and update the order status in the order management page.</p>
      </div>
      
      <p>Thank you for your prompt attention to this order.</p>
      
      <p>If you have any questions or need additional information, please reply to this email.</p>
      
    </div>
    
    <div class="footer">
      <p>© 2024 Ecom Fort. All rights reserved.</p>
      <p>This is an automated notification.</p>
    </div>
  </div>
</body>
</html>

      `,
    }

    try {
      const response = await fetch('/api/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      })

      if (!response.ok) {
        throw new Error('Failed to send email to seller')
      }

      console.log('Email sent successfully to seller')
    } catch (error) {
      console.error('Error sending email:', error)
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              { /*<Button variant='contained'
                onClick={() => handleSendWhatsApp(store)}
                sx={{bgcolor:"green",":hover":{bgcolor:"green"}}}
              >
                <WhatsApp />
                Order Now via WhatsApp
              </Button> */}
              <Button variant='contained'
                onClick={handlePlaceOrder}
                sx={{ bgcolor: "black", ":hover": { bgcolor: "black" } }}
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