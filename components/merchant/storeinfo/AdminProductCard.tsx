"use client";

import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Chip,
  Box,
  IconButton,
  Tabs,
  Tab,
  Container,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { Decimal } from "decimal.js";
import { BaseButton } from "@/components/users/buttons/BaseButton";
import { OutlinedButton } from "@/components/styledcomponents/StyledElements";
import { updateProduct } from "@/app/actions/products/action";
import { useRouter } from "next/router";

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

const allowedSizes = ["S-38", "XS-39", "M-40", "L-42", "XL-44", "XXL-46"];

export default function MerchantProductCard({
  products,
}: MerchantProductCardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [newSize, setNewSize] = useState<string>("");
  const [newStock, setNewStock] = useState<number>(0);
  const [openAddSizeDialog, setOpenAddSizeDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setActiveVariant(0);
  };

  const handleSaveChanges = async () => {
    if (editingProduct) {
      setIsUpdating(true);
      const result = await updateProduct(editingProduct);
      if (result.success) {
        handleCloseDialog();
      } else {
        console.error(result.error);
      }
      setIsUpdating(false);
    }
  };

  const handleStockChange = (
    variantIndex: number,
    sizeIndex: number,
    value: string
  ) => {
    if (editingProduct) {
      const updatedVariants = [...editingProduct.variants];
      updatedVariants[variantIndex].sizes[sizeIndex].stock = parseInt(
        value,
        10
      );
      setEditingProduct({ ...editingProduct, variants: updatedVariants });
    }
  };

  const handlePriceChange = (value: string) => {
    if (editingProduct) {
      const numericValue = value ? new Decimal(value) : new Decimal(0);
      setEditingProduct({ ...editingProduct, price: numericValue });
    }
  };

  const handleAddSize = () => {
    if (editingProduct) {
      const updatedVariants = [...editingProduct.variants];
      updatedVariants[activeVariant].sizes.push({
        id: Date.now(),
        size: newSize,
        stock: newStock,
      });
      setEditingProduct({ ...editingProduct, variants: updatedVariants });
      setNewSize("");
      setNewStock(0);
      setOpenAddSizeDialog(false);
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

  return (
    <Container>
      <Typography variant="h5" sx={{ ml: 4, mb: 2 }} fontWeight={700}>
        Manage Products
      </Typography>
      <Grid container spacing={3} ml={1}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {product.previewImage && (
                <CardMedia
                  component="div"
                  sx={{ height: 200, position: "relative" }}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {product.description}
                </Typography>
                <Box
                  sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}
                >
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 1 }}>
                    Total Stock:
                  </Typography>
                  <Typography variant="body2">
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
                {isUpdating ? "Updating..." : "Edit"}
              </BaseButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Product
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
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
                          onChange={(e) =>
                            handleStockChange(
                              variantIndex,
                              sizeIndex,
                              e.target.value
                            )
                          }
                          sx={{ mb: 2 }}
                        />
                      ))}
                      <Button onClick={() => setOpenAddSizeDialog(true)}>
                        Add Size
                      </Button>
                      <Dialog
                        open={openAddSizeDialog}
                        onClose={() => setOpenAddSizeDialog(false)}
                      >
                        <DialogTitle>Add Size</DialogTitle>
                        <DialogContent>
                          <Select
                            value={"S-38"}
                            onChange={(e) => setNewSize(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                          >
                            {allowedSizes.map((size) => (
                              <MenuItem key={size} value={size}>
                                {size}
                              </MenuItem>
                            ))}
                          </Select>
                          <TextField
                            label="Stock"
                            type="number"
                            value={newStock}
                            onChange={(e) =>
                              setNewStock(parseInt(e.target.value, 10))
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenAddSizeDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddSize}>Add Size</Button>
                        </DialogActions>
                      </Dialog>
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
          <OutlinedButton onClick={handleCloseDialog}>Cancel</OutlinedButton>
          <BaseButton onClick={handleSaveChanges} startIcon={<SaveIcon />}>
            {isUpdating ? <CircularProgress size={24} /> : "Save Changes"}
          </BaseButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
