"use client"
import { useState, type ChangeEvent } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Divider,
  type SelectChangeEvent,
  Card,
  CardMedia,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import { createProduct} from "@/app/actions/products/action"
import { uploadImage } from "../utils/uploadImage"

type Size = {
  id: number
  size: string
  stock: number
}

type Variant = {
  id: number
  color: string
  sizes: Size[]
  variantImage: string | null
  additionalImages: string[]
}

type FormError = {
  name?: string
  description?: string
  brand?: string
  category?: string
  price?: string
  productImage?: string
  variants?: string
}

export default function ProductForm({ storeId }: { storeId: string }) {
  const router = useRouter()

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    productImage: null as string | null,
  })

  const [variants, setVariants] = useState<Variant[]>([
    { id: 1, color: "", sizes: [], variantImage: null, additionalImages: [] },
  ])

  const [newSize, setNewSize] = useState({ size: "", stock: 0 })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormError>({})
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const categories = [
    "Electronics",
    "Clothing",
    "Footwear",
    "Accessories",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Other",
  ]

  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const imageUrl = await uploadImage(file);
        setProductData({ ...productData, productImage: imageUrl });
        setErrors({ ...errors, productImage: undefined });
      } catch (error) {
        console.error("Upload error:", error);
        setNotification({
          open: true,
          message: 'Failed to upload main product image',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVariantImageUpload = async (variantIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const imageUrl = await uploadImage(file);
        
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].variantImage = imageUrl;
        setVariants(updatedVariants);
      } catch (error) {
        console.error("Upload error:", error);
        setNotification({
          open: true,
          message: 'Failed to upload variant image',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdditionalImageUpload = async (variantIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const imageUrl = await uploadImage(file);
        
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].additionalImages.push(imageUrl);
        setVariants(updatedVariants);
      } catch (error) {
        console.error("Upload error:", error);
        setNotification({
          open: true,
          message: 'Failed to upload additional image',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const addVariant = () => {
    const newId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 1
    setVariants([...variants, { id: newId, color: "", sizes: [], variantImage: null, additionalImages: [] }])
  }

  const removeVariant = (variantId: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== variantId))
    } else {
      setNotification({
        open: true,
        message: "Product must have at least one variant",
        severity: "error",
      })
    }
  }

  const addSize = (variantIndex: number) => {
    if (!newSize.size || newSize.stock <= 0) {
      setNotification({
        open: true,
        message: "Size name and stock quantity are required",
        severity: "error",
      })
      return
    }

    const updatedVariants = [...variants]
    const newId =
      updatedVariants[variantIndex].sizes.length > 0
        ? Math.max(...updatedVariants[variantIndex].sizes.map((s) => s.id)) + 1
        : 1

    updatedVariants[variantIndex].sizes.push({
      id: newId,
      size: newSize.size,
      stock: newSize.stock,
    })

    setVariants(updatedVariants)
    setNewSize({ size: "", stock: 0 })
  }

  const removeSize = (variantIndex: number, sizeId: number) => {
    const updatedVariants = [...variants]
    updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter((s) => s.id !== sizeId)
    setVariants(updatedVariants)
  }

  const removeAdditionalImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = [...variants]
    updatedVariants[variantIndex].additionalImages.splice(imageIndex, 1)
    setVariants(updatedVariants)
  }

  const validateForm = (): boolean => {
    const newErrors: FormError = {}

    if (!productData.name) newErrors.name = "Product name is required"
    if (!productData.description) newErrors.description = "Description is required"
    if (!productData.price || isNaN(Number(productData.price))) newErrors.price = "Valid price is required"
    if (!productData.productImage) newErrors.productImage = "Main product image is required"

    // Validate variants
    for (const variant of variants) {
      if (!variant.color) {
        newErrors.variants = "Color is required for all variants"
        break
      }
      if (!variant.variantImage) {
        newErrors.variants = "Image is required for all variants"
        break
      }
      if (variant.sizes.length === 0) {
        newErrors.variants = "At least one size is required for each variant"
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Please fix the form errors before submitting",
        severity: "error",
      })
      return
    }

    try {
      setLoading(true)

      const productPayload = {
        ...productData,
        storeId,
        price: Number.parseFloat(productData.price),
        productImage: productData.productImage || "",
        variants: variants.map((variant) => ({
          color: variant.color,
          variantImage: variant.variantImage || "",
          images: variant.additionalImages,
          sizes: variant.sizes.map((size) => ({
            size: size.size,
            stock: size.stock,
          })),
        })),
      }

      const result = await createProduct(productPayload)

      if (result.success) {
        setNotification({
          open: true,
          message: "Product created successfully!",
          severity: "success",
        })

        // Redirect to products page after successful creation
        setTimeout(() => {
          router.push("/products")
        }, 2000)
      } else {
        throw new Error(result.message || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      setNotification({
        open: true,
        message: "Failed to create product. Please try again.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mt: 4,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: "linear-gradient(45deg, #000, #333)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create New Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Main Product Information */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: 40,
                      height: 3,
                      backgroundColor: "black",
                    },
                  }}
                >
                  Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Product Name"
                      variant="outlined"
                      fullWidth
                      value={productData.name}
                      onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "black",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Brand"
                      variant="outlined"
                      fullWidth
                      value={productData.brand}
                      onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "black",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "black",
                        },
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={productData.category}
                        onChange={(e: SelectChangeEvent) =>
                          setProductData({ ...productData, category: e.target.value })
                        }
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                      error={!!errors.price}
                      helperText={errors.price}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "black",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={productData.description}
                      onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                      error={!!errors.description}
                      helperText={errors.description}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "black",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Main Product Image
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{
                            height: 56,
                            bgcolor: "black",
                            "&:hover": {
                              bgcolor: "#333",
                            },
                          }}
                        >
                          Upload Image
                          <input type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                        </Button>

                        {errors.productImage && <FormHelperText error>{errors.productImage}</FormHelperText>}
                      </Box>

                      {productData.productImage && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            border: "1px dashed #ccc",
                            borderRadius: 2,
                            bgcolor: "#f9f9f9",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Image Preview
                          </Typography>
                          <Box sx={{ position: "relative", width: "fit-content" }}>
                            <Card
                              sx={{
                                width: 200,
                                height: 200,
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={productData.productImage}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                alt="Product main image"
                              />
                            </Card>
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "rgba(0, 0, 0, 0.9)",
                                },
                              }}
                              size="small"
                              onClick={() => setProductData({ ...productData, productImage: null })}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Variants */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: "background.default",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      position: "relative",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: "black",
                      },
                    }}
                  >
                    Product Variants
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addVariant}
                    sx={{
                      bgcolor: "black",
                      "&:hover": {
                        bgcolor: "#333",
                      },
                    }}
                  >
                    Add Variant
                  </Button>
                </Box>

                {errors.variants && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {errors.variants}
                  </Alert>
                )}

                {variants.map((variant, variantIndex) => (
                  <Paper
                    key={variant.id}
                    elevation={1}
                    sx={{
                      p: 3,
                      mb: 3,
                      bgcolor: "background.paper",
                      position: "relative",
                      borderRadius: 2,
                      border: "1px solid #eee",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                      <IconButton
                        sx={{
                          color: "white",
                          bgcolor: "black",
                          "&:hover": {
                            bgcolor: "#333",
                          },
                          "&.Mui-disabled": {
                            bgcolor: "#ccc",
                          },
                        }}
                        onClick={() => removeVariant(variant.id)}
                        disabled={variants.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        display: "inline-block",
                        bgcolor: "black",
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      Variant #{variantIndex + 1}
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Color"
                          variant="outlined"
                          fullWidth
                          value={variant.color}
                          onChange={(e) => {
                            const updatedVariants = [...variants]
                            updatedVariants[variantIndex].color = e.target.value
                            setVariants(updatedVariants)
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "black",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "black",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Variant Image
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{
                              height: 56,
                              bgcolor: "black",
                              "&:hover": {
                                bgcolor: "#333",
                              },
                            }}
                          >
                            Upload Image
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleVariantImageUpload(variantIndex, e)}
                            />
                          </Button>

                          {variant.variantImage && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                border: "1px dashed #ccc",
                                borderRadius: 2,
                                bgcolor: "#f9f9f9",
                              }}
                            >
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Image Preview
                              </Typography>
                              <Box sx={{ position: "relative", width: "fit-content" }}>
                                <Card
                                  sx={{
                                    width: 150,
                                    height: 150,
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    image={variant.variantImage}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    alt={`Variant ${variant.color} image`}
                                  />
                                </Card>
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    "&:hover": {
                                      bgcolor: "rgba(0, 0, 0, 0.9)",
                                    },
                                  }}
                                  size="small"
                                  onClick={() => {
                                    const updatedVariants = [...variants]
                                    updatedVariants[variantIndex].variantImage = null
                                    setVariants(updatedVariants)
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      {/* Sizes Section */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Available Sizes
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "flex-end" },
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <TextField
                            label="Size"
                            variant="outlined"
                            size="small"
                            value={newSize.size}
                            onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                            sx={{
                              minWidth: 100,
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "black",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "black",
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "black",
                              },
                            }}
                          />

                          <TextField
                            label="Stock"
                            variant="outlined"
                            type="number"
                            size="small"
                            value={newSize.stock}
                            onChange={(e) => setNewSize({ ...newSize, stock: Number.parseInt(e.target.value) || 0 })}
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{
                              minWidth: 100,
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "black",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "black",
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "black",
                              },
                            }}
                          />

                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => addSize(variantIndex)}
                            startIcon={<AddIcon />}
                            sx={{
                              height: 40,
                              bgcolor: "black",
                              "&:hover": {
                                bgcolor: "#333",
                              },
                            }}
                          >
                            Add Size
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            p: variant.sizes.length > 0 ? 2 : 0,
                            border: variant.sizes.length > 0 ? "1px solid #eee" : "none",
                            borderRadius: 1,
                            bgcolor: variant.sizes.length > 0 ? "#f9f9f9" : "transparent",
                          }}
                        >
                          {variant.sizes.map((size) => (
                            <Chip
                              key={size.id}
                              label={`${size.size} (${size.stock} in stock)`}
                              onDelete={() => removeSize(variantIndex, size.id)}
                              sx={{
                                bgcolor: "black",
                                color: "white",
                                "& .MuiChip-deleteIcon": {
                                  color: "white",
                                  "&:hover": {
                                    color: "#ff8a80",
                                  },
                                },
                              }}
                            />
                          ))}

                          {variant.sizes.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No sizes added yet
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      {/* Additional Images */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Additional Images
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{
                              bgcolor: "black",
                              "&:hover": {
                                bgcolor: "#333",
                              },
                            }}
                          >
                            Add Image
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleAdditionalImageUpload(variantIndex, e)}
                            />
                          </Button>

                          {variant.additionalImages.length > 0 && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                border: "1px dashed #ccc",
                                borderRadius: 2,
                                bgcolor: "#f9f9f9",
                              }}
                            >
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Image Previews
                              </Typography>
                              <Grid container spacing={2}>
                                {variant.additionalImages.map((img, imgIndex) => (
                                  <Grid item key={imgIndex}>
                                    <Box sx={{ position: "relative", width: "fit-content" }}>
                                      <Card
                                        sx={{
                                          width: 100,
                                          height: 100,
                                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                          borderRadius: 2,
                                          overflow: "hidden",
                                        }}
                                      >
                                        <CardMedia
                                          component="img"
                                          image={img}
                                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                          alt={`Additional image ${imgIndex + 1}`}
                                        />
                                      </Card>
                                      <IconButton
                                        sx={{
                                          position: "absolute",
                                          top: 5,
                                          right: 5,
                                          bgcolor: "rgba(0, 0, 0, 0.7)",
                                          color: "white",
                                          "&:hover": {
                                            bgcolor: "rgba(0, 0, 0, 0.9)",
                                          },
                                        }}
                                        size="small"
                                        onClick={() => removeAdditionalImage(variantIndex, imgIndex)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          )}

                          {variant.additionalImages.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No additional images added yet
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Paper>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontWeight: "bold",
                    bgcolor: "black",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#ccc",
                    },
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                   
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Create Product"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  )
}
