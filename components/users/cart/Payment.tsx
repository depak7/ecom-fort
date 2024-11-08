// "use client"

// import React from 'react';
// import Image from 'next/image';
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   styled,
// } from '@mui/material';

// import CloseIcon from '@mui/icons-material/Close';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import { PaymentOption, StyledPaper, StyledTableCell } from '@/components/styledcomponents/StyledElements';

// import upi from '@/components/assets/users/upi.png'
// import product1 from "@/components/assets/users/shirt.png";
// import product2 from "@/components/assets/users/hoodies.png";
// import product3 from "@/components/assets/users/shirt.png";
// import product4 from "@/components/assets/users/shoe-img.png";

// const products = [
//   { id: 1, name: 'D&W :Dual Designs', category: 'T-Shirts', size: 'S', quantity: 1, price: 1995.00, image: product1 },
//   { id: 2, name: 'Nike Zoom Vomero 5', category: "Men's Shoes", size: 'UK 7', quantity: 1, price: 7995.00, image:product2 },
//   { id: 3, name: 'Batman : 3D Logo', category: 'T-Shirts', size: 'M', quantity: 1, price: 995.00, image:product3 },
//   { id: 4, name: 'Nike Legend 10 Elite', category: 'Football Boot', size: 'UK 9', quantity: 1, price: 1995.00, image: product4 },
// ];

// const paymentOptions = [
//   { icon: <Image src={upi} alt="UPI" width={24} height={24} />, name: 'UPI', description: 'Pay with installed app, or use Other' },
//   { icon: <CreditCardIcon />, name: 'Debit/Credit Cards', description: 'Visa, Master, Amex' },
//   { icon: <AccountBalanceIcon />, name: 'Net Banking', description: 'All Indian banks' },
//   { icon: <CalendarTodayIcon />, name: 'EMI', description: 'Credit/Debit cards, Zest money & more' },
//   { icon: <AccountBalanceWalletIcon />, name: 'Wallet', description: 'Freecharge, JioMoney & more' },
// ];

// export default function Payment() {
//   return (
//     <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
       
//         <Typography variant="h6"  fontWeight={"bold"}gutterBottom>
//               Added Products in the Cart
//             </Typography>
        
        
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={7}>
//           <StyledPaper  sx={{p:2,border:"1px solid"}}>
//             <TableContainer > 
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <StyledTableCell>Product</StyledTableCell>
//                     <StyledTableCell align="center">Size</StyledTableCell>
//                     <StyledTableCell align="center">Quantity</StyledTableCell>
//                     <StyledTableCell align="right">Price</StyledTableCell>
//                     <StyledTableCell></StyledTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {products.map((product) => (
//                     <TableRow key={product.id}>
//                       <StyledTableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Image src={product.image} alt={product.name} width={50} height={50} />
//                           <Box sx={{ ml: 1 }}>
//                             <Typography variant="body2">{product.name}</Typography>
//                             <Typography variant="caption" color="text.secondary">{product.category}</Typography>
//                           </Box>
//                         </Box>
//                       </StyledTableCell>
//                       <TableCell align="center">{product.size}</TableCell>
//                       <TableCell align="center">{product.quantity}</TableCell>
//                       <TableCell align="right">₹ {product.price.toFixed(2)}</TableCell>
//                       <StyledTableCell>
//                         <IconButton size="small">
//                           <CloseIcon />
//                         </IconButton>
//                       </StyledTableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </StyledPaper>
//         </Grid>
//         <Grid item xs={12} md={5}>
     
//           <StyledPaper sx={{p:2,border:"1px solid"}}>
           
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle1" fontWeight={700}>
//                 Cart Price
//                 <Typography component="span" variant="h6" color="success.main" sx={{ float: 'right' }}>
//                   ₹ 12890.00
//                 </Typography>
//               </Typography>
//             </Box>
//             <Typography variant="subtitle1" gutterBottom>
//               Pay Using
//             </Typography>
//             <List>
//               {paymentOptions.map((option, index) => (
//                 <PaymentOption key={index}>
//                   <ListItemIcon>
//                     {option.icon}
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary={option.name}
//                     secondary={option.description}
//                   />
//                 </PaymentOption>
//               ))}
//             </List>
//           </StyledPaper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }