"use client";

import React, { useState } from "react";

import Image from "next/image";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  InputAdornment,
  Paper,
  Divider,
  Grid,
 
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ProductImage1 from "@/components/assets/users/productImage-1.png";

import { InputFieldButton, StyledSelect, StyledTextField } from "@/components/styledcomponents/StyledElements";
import CheckoutProgress from "./CheckoutProgress";
import { BaseButton } from "../buttons/BaseButton";

import { useRouter } from "next/navigation";

export default function ShoppingCart() {
  const [size, setSize] = useState("S");
  const [quantity, setQuantity] = useState("1");
  const [coupenCode, setCoupenCode] = useState("");

 
  const handleSizeChange = (event: SelectChangeEvent<unknown>) => {
    setSize(event.target.value as string);
};

const handleQuantityChange = (event: SelectChangeEvent<unknown>) => {
    setQuantity(event.target.value as string);
};

const router = useRouter(); 

const handleProceedToShipping = () => {
    router.push("/cart/address");  
  };


  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
        <CheckoutProgress/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: "1px solid black", p: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mt: 2 }}
            >
              <Image
                src={ProductImage1}
                alt="D&W Dual Designs T-Shirt"
                width={150}
                height={150}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">D&W :Dual Designs</Typography>
                <Typography variant="body2">T-Shirts</Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller:Snipes Store
                </Typography>
                <Typography variant="h6" sx={{ mt: 1}}>
                    MRP : 
                  <span
                    style={{textDecoration: "line-through", textDecorationColor:"red" }}
                  >
                    ₹ 1,995.00
                  </span>{"  "}
                  <span style={{ color: "black" }}>₹ 1,695.00</span>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  incl. of all taxes
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <StyledSelect
                    value={size}
                    onChange={handleSizeChange}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 80,  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      }, }}
                  >
                    <MenuItem value="S">Size: S</MenuItem>
                    <MenuItem value="M">Size: M</MenuItem>
                    <MenuItem value="L">Size: L</MenuItem>
                  </StyledSelect>
                  <StyledSelect
                    value={quantity}
                    onChange={handleQuantityChange}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value={1}>Qty: 1</MenuItem>
                    <MenuItem value={2}>Qty: 2</MenuItem>
                    <MenuItem value={3}>Qty: 3</MenuItem>
                  </StyledSelect>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
            <Button
              variant="contained"
              endIcon={<FavoriteBorderIcon />}
              sx={{
                borderRadius: "50px",
                boxShadow: "none",
                py: 1.5,
                color: "black",
                bgcolor: "white",
                border: "2px solid black",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
             Move to Favourite
            </Button>
            <BaseButton sx={{ borderRadius: "50px" }} endIcon={<DeleteOutlineIcon/>}>Remove</BaseButton>
          </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ border: "1px solid black", p: 2, mb: 2 }}
          >
            <Typography variant="h6"  fontWeight={700} gutterBottom>
              Price Details
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Price (1 item )</Typography>
              <Typography>₹ 1,995.00</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Discount</Typography>
              <Typography color="success.main">- ₹ 300.00</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Delivery Charges</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" fontWeight={"bold"}>₹ 1,695.00</Typography>
            </Box>
          </Paper>
          <Paper elevation={0} sx={{ border: "1px solid black", p: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Apply Coupon
            </Typography>
            <StyledTextField
              fullWidth
              placeholder="Enter Coupon Code here"
              value={coupenCode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <InputFieldButton>Apply</InputFieldButton>
                  </InputAdornment>
                ),
              }}
            />
            <Accordion sx={{  boxShadow: "none" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"}>Available tokens</Typography>
            </AccordionSummary>
            <AccordionDetails>
            
            </AccordionDetails>
          </Accordion>
         
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: "black", "&:hover": { bgcolor: "black" } }}
              onClick={handleProceedToShipping}
            >
              Proceed To Shipping
            </Button>
          
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
