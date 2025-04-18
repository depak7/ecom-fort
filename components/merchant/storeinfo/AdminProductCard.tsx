"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Decimal } from "decimal.js";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Select,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Badge,
  Stack,
  Alert
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  ColorLens as ColorIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Add as AddIcon,
  CurrencyRupeeOutlined
} from "@mui/icons-material";
import { updateProduct } from "@/app/actions/products/action";
import { BaseButton } from "@/components/users/buttons/BaseButton";
import { OutlinedButton } from "@/components/styledcomponents/StyledElements";

interface Size {
  id: number;
  size: string;
  stock: number;
}

interface Variant {
  id: number;
  color: string;
  sizes: Size[];
  variantImage: string;
  images: any[];
}

interface Product {
  id: string;
  name: string;
  category: string | null;
  description: string;
  price: Decimal;
  variants: Variant[];
  previewImage: string | null;
  availableSizes: string[];
  totalStock: number;
}

interface MerchantProductCardProps {
  products: Product[] | undefined;
}

const allowedSizes = {
  shoes: [
    "UK-7", "UK-7.5", "UK-8", "UK-8.5", 
    "UK-9", "UK-9.5", "UK-10", "UK-10.5", 
    "UK-11", "UK-11.5", "UK-12"
  ],
  clothing: [
    "XS", "S", "M", "L", "XL", "XXL"
  ]
};

export default function MerchantProductCard({
  products,
}: MerchantProductCardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [newSize, setNewSize] = useState<string>(
    editingProduct?.category === 'shoes' ? "UK-7" : "S"
  );
  const [newStock, setNewStock] = useState<number>(0);
  const [openAddSizeDialog, setOpenAddSizeDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: "", message: "" });

  const handleEditClick = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setOpenDialog(true);
    setUpdateMessage({ type: "", message: "" });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setActiveVariant(0);
    setUpdateMessage({ type: "", message: "" });
  };

  const handleSaveChanges = async () => {
    if (editingProduct) {
      setIsUpdating(true);
      try {
        const result = await updateProduct(editingProduct);
        if (result.success) {
          setUpdateMessage({ type: "success", message: "Product updated successfully!" });
          setTimeout(() => handleCloseDialog(), 1500);
        } else {
          setUpdateMessage({ type: "error", message: result.error || "Failed to update product" });
        }
      } catch (error) {
        setUpdateMessage({ type: "error", message: "An error occurred while updating the product" });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleStockChange = (
    variantIndex: number,
    sizeIndex: number,
    value: string
  ) => {
    if (editingProduct) {
      const updatedVariants = [...editingProduct.variants];
      const numValue = parseInt(value, 10) || 0;
      updatedVariants[variantIndex].sizes[sizeIndex].stock = numValue >= 0 ? numValue : 0;
      setEditingProduct({ ...editingProduct, variants: updatedVariants });
    }
  };

  const handlePriceChange = (value: string) => {
    if (editingProduct) {
      const numericValue = value && parseFloat(value) > 0 ? new Decimal(value) : new Decimal(0);
      setEditingProduct({ ...editingProduct, price: numericValue });
    }
  };

  const handleAddSize = () => {
    if (editingProduct) {
      // Check if size already exists for this variant
      const sizeExists = editingProduct.variants[activeVariant].sizes.some(
        size => size.size === newSize
      );
      
      if (sizeExists) {
        setUpdateMessage({ type: "error", message: "This size already exists for this variant" });
        return;
      }
      
      const updatedVariants = [...editingProduct.variants];
      updatedVariants[activeVariant].sizes.push({
        id: Math.floor(Math.random() * 1000),
        size: newSize,
        stock: newStock >= 0 ? newStock : 0,
      });
      
      // Update available sizes across the product
      const allSizes = new Set(editingProduct.availableSizes);
      allSizes.add(newSize);
      
      setEditingProduct({ 
        ...editingProduct, 
        variants: updatedVariants,
        availableSizes: Array.from(allSizes)
      });
      
      setNewSize(editingProduct.category === 'shoes' ? "UK-7" : "S");
      setNewStock(0);
      setOpenAddSizeDialog(false);
      setUpdateMessage({ type: "success", message: "Size added successfully" });
    }
  };

  const calculateTotalStock = (variants: Variant[]): number => {
    return variants.reduce(
      (total, variant) =>
        total +
        variant.sizes.reduce(
          (variantTotal, size) => variantTotal + size.stock,
          0
        ),
      0
    );
  };

  const isValidNewSize = newSize && newStock >= 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <InventoryIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h5" fontWeight={700}>
          Manage Products
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
            >
              {product.previewImage && (
                <Box sx={{ position: "relative", height: 220 }}>
                  <CardMedia
                    component="div"
                    sx={{ height: "100%", position: "relative" }}
                  >
                    <Image
                      src={product.previewImage}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CardMedia>
                  <Badge 
                    badgeContent={product.variants.length} 
                    color="primary"
                    sx={{ 
                      position: "absolute", 
                      bottom: 10, 
                      right: 10,
                      "& .MuiBadge-badge": {
                        fontSize: "0.8rem",
                        height: "22px",
                        minWidth: "22px"
                      }
                    }}
                  >
                    <ColorIcon />
                  </Badge>
                </Box>
              )}
              
              <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography gutterBottom variant="h6" fontWeight={600} noWrap>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CurrencyRupeeOutlined sx={{ mr: 0.5, fontSize: "1.2rem", color: "success.main" }} />
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    {product.price.toString()}
                  </Typography>
                </Box>
                
                {product.category && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CategoryIcon sx={{ mr: 0.5, fontSize: "0.9rem", color: "text.secondary" }} />
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ 
                        height: "22px", 
                        fontSize: "0.75rem",
                        backgroundColor: "primary.light",
                        color: "primary.contrastText" 
                      }} 
                    />
                  </Box>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 2, 
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    height: "40px"
                  }}
                >
                  {product.description}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                    Available Sizes:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {product.availableSizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        size="small"
                        sx={{ 
                          fontSize: "0.7rem", 
                          height: "20px",
                          backgroundColor: "grey.100"
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <InventoryIcon sx={{ mr: 0.5, fontSize: "0.9rem", color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    <Typography 
                      component="span" 
                      variant="body2" 
                      fontWeight={600} 
                      sx={{ mr: 0.5 }}
                    >
                      Total Stock:
                    </Typography>
                    {product.totalStock}
                  </Typography>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <BaseButton customSize="small" onClick={() => handleEditClick(product)}><EditIcon sx={{ mr: 1 }} /> Edit Product</BaseButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "grey", 
          color: "white",
          py: 2
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EditIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Edit Product: {editingProduct?.name}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ 
              position: "absolute", 
              right: 8, 
              top: 8,
              color: "white" 
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {updateMessage.type && (
            <Alert 
              severity={updateMessage.type as "success" | "error"} 
              sx={{ mt: 1, mb: 2 }}
            >
              {updateMessage.message}
            </Alert>
          )}
          
          {editingProduct && (
            <Box>
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CurrencyRupeeOutlined sx={{ mr: 1, color: "slategray" }} />
                  <Typography variant="subtitle1" fontWeight={600}>Product Price</Typography>
                </Box>
                <TextField
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  value={editingProduct.price.toString()}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>₹</Typography>
                  }}
                  size="small"
                />
              </Paper>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ColorIcon sx={{ mr: 1, color: "slategray" }} />
                  <Typography variant="subtitle1" fontWeight={600}>Color Variants</Typography>
                </Box>
                <Tabs
                  value={activeVariant}
                  onChange={(_, newValue) => setActiveVariant(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    mb: 2,
                    '& .MuiTab-root': { 
                      minWidth: 'auto',
                      px: 2
                    }
                  }}
                >
                  {editingProduct.variants.map((variant, index) => (
                    <Tab 
                      key={variant.id} 
                      label={variant.color} 
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: activeVariant === index ? 600 : 400
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
              
              {editingProduct.variants.map((variant, variantIndex) => (
                <Box key={variant.id} hidden={activeVariant !== variantIndex}>
                  <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={5} md={4}>
                        <Box sx={{ position: "relative", height: 220, borderRadius: 1, overflow: "hidden" }}>
                          <Image
                            src={variant.variantImage}
                            alt={`${editingProduct.name} - ${variant.color}`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Typography variant="subtitle2" align="center" sx={{ mt: 1, fontWeight: 600, color: "text.secondary" }}>
                          {variant.color} Variant
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={7} md={8}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                          Inventory Management
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {variant.sizes.map((size, sizeIndex) => (
                            <Grid item xs={12} sm={6} key={size.id}>
                              <TextField
                                label={`Stock for ${size.size}`}
                                type="number"
                                fullWidth
                                value={size.stock}
                                onChange={(e) =>
                                  handleStockChange(
                                    variantIndex,
                                    sizeIndex,
                                    e.target.value
                                  )
                                }
                                size="small"
                                InputProps={{
                                  endAdornment: <Typography variant="body2" color="text.secondary">units</Typography>
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                        <OutlinedButton  onClick={() => setOpenAddSizeDialog(true)}  > <AddIcon> </AddIcon>Add size</OutlinedButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              ))}
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                  Total Inventory Count:
                  <Typography 
                    component="span" 
                    variant="subtitle1" 
                    color="black" 
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    {calculateTotalStock(editingProduct.variants)} units
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.50" }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: 1,
              px: 3,
              py: 0.75,
              color: "text.secondary",
              border: 1,
              borderColor: "grey.300",
            }}
          >
            <CloseIcon sx={{ mr: 0.5 }} />
            <Typography variant="button">Cancel</Typography>
          </IconButton>
          
          <IconButton
            onClick={handleSaveChanges}
            disabled={isUpdating}
            sx={{ 
              borderRadius: 1,
              px: 3,
              py: 0.75,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled"
              }
            }}
          >
            {isUpdating ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : (
              <SaveIcon sx={{ mr: 0.5 }} />
            )}
            <Typography variant="button">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Typography>
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Add Size Dialog */}
      <Dialog
        open={openAddSizeDialog}
        onClose={() => setOpenAddSizeDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          Add New Size
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Select
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              fullWidth
            
              size="small"
              label="Size"
            >
              {editingProduct?.category === 'Shoes' 
                ? allowedSizes.shoes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))
                : allowedSizes.clothing.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))
              }
            </Select>
            
            <TextField
              label="Stock Quantity"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <Typography variant="body2" color="gray">units</Typography>
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <IconButton
            onClick={() => setOpenAddSizeDialog(false)}
            sx={{ 
              borderRadius: 1,
              color: "text.secondary",
              border: 1,
              borderColor: "grey.300",
              px: 2
            }}
          >
            <CloseIcon sx={{ mr: 0.5 }} />
            <Typography variant="button">Cancel</Typography>
          </IconButton>
          
          <IconButton
            onClick={handleAddSize}
            disabled={!isValidNewSize}
            sx={{ 
              borderRadius: 1,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
              },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled"
              },
              px: 2
            }}
          >
            <AddIcon sx={{ mr: 0.5 }} />
            <Typography variant="button">Add Size</Typography>
          </IconButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}