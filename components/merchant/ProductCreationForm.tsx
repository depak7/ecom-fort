"use client"

import type React from "react"
import { useState } from "react"

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
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { createProduct } from "@/app/actions/products/action"
import { OutlinedButton, StyledTextField } from "../styledcomponents/StyledElements"
import { BaseButton } from "../users/buttons/BaseButton"
import ProductCard from "../users/products/ProductCard"

const allowedSizes = ["S-38", "XS-39", "M-40", "L-42", "XL-44", "XXL-46"]
const allowedShoeSizes = ["UK-6", "UK-7", "UK-8", "UK-9", "UK-10", "UK-11", "UK-12"]
const categories = ["Shirts","T-Shirts","Hoodies","Trousers", "Jeans", "Shoes", "Accessories", "Others"]

export default function ProductCreationForm({
  storeId,
  storeName,
}: {
  storeId: string
  storeName: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [variants, setVariants] = useState([
    {
      color: "",
      sizes: [{ size: "", stock: 0 }],
      image: null as string | null,
      additionalImages: [] as string[],
    },
  ])
  const [previewData, setPreviewData] = useState({
    name: "",
    price: "",
    image: null as string | null,
    category: "",
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

    formData.append("storeId", storeId)
    formData.append("category", previewData.category)

    try {
      const result = await createProduct(formData)
      console.log(result)
      if (result.success) {
        setSuccess(true)
        form.reset()
        setVariants([
          {
            color: "",
            sizes: [{ size: "", stock: 0 }],
            image: null,
            additionalImages: [],
          },
        ])
        setPreviewData({ name: "", price: "", image: null, category: "" })
      } else {
        setError(result.error || "An error occurred while creating the product")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        sizes: [{ size: "", stock: 0 }],
        image: null,
        additionalImages: [],
      },
    ])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addSize = (variantIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].sizes.push({ size: "", stock: 0 })
    setVariants(newVariants)
  }

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex)
    setVariants(newVariants)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPreviewData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (e.target.id === "mainImage") {
          setPreviewData((prev) => ({
            ...prev,
            image: event.target?.result as string,
          }))
        } else if (e.target.id.startsWith("variantImage-")) {
          const variantIndex = Number.parseInt(e.target.id.split("-")[1], 10)
          const newVariants = [...variants]
          newVariants[variantIndex].image = event.target?.result as string
          setVariants(newVariants)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVariants = [...variants]
      const newImages = [...newVariants[variantIndex].additionalImages]

      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
            newVariants[variantIndex].additionalImages = [...newImages]
            setVariants([...newVariants])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeVariantImage = (variantIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].image = null

    // Reset the file input
    const fileInput = document.getElementById(`variantImage-${variantIndex}`) as HTMLInputElement
    if (fileInput) fileInput.value = ""

    setVariants(newVariants)
  }

  const removeMainImage = () => {
    setPreviewData((prev) => ({ ...prev, image: null }))

    // Reset the file input
    const fileInput = document.getElementById("mainImage") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const removeAdditionalImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].additionalImages = newVariants[variantIndex].additionalImages.filter(
      (_, i) => i !== imageIndex,
    )
    setVariants(newVariants)
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{}}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: "text.primary" }}>
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
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={previewData.category}
                    onChange={(e) => setPreviewData({ ...previewData, category: e.target.value as string })}
                    fullWidth
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
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

                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Main Product Image
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <input
                        type="file"
                        name="mainImage"
                        accept="image/*"
                        required
                        style={{ display: "none" }}
                        id="mainImage"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="mainImage">
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            color: "text.primary",
                            borderColor: "text.primary",
                            "&:hover": {
                              borderColor: "text.primary",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          Upload Main Image
                        </Button>
                      </label>
                    </Box>

                    {previewData.image && (
                      <Box sx={{ position: "relative", width: "fit-content", mb: 2 }}>
                        <img
                          src={previewData.image || "/placeholder.svg"}
                          alt="Main product"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            borderRadius: "8px",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "rgba(255,255,255,0.7)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                          }}
                          onClick={removeMainImage}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {variants.map((variant, variantIndex) => (
                  <Grid item xs={12} key={variantIndex}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
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
                          <Typography variant="subtitle2" gutterBottom>
                            Variant Image
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <input
                              type="file"
                              name={`variantImage-${variantIndex}`}
                              accept="image/*"
                              required={!variant.image}
                              style={{ display: "none" }}
                              id={`variantImage-${variantIndex}`}
                              onChange={handleImageChange}
                            />
                            <label htmlFor={`variantImage-${variantIndex}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                sx={{
                                  color: "text.primary",
                                  borderColor: "text.primary",
                                  "&:hover": {
                                    borderColor: "text.primary",
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                Upload Variant Image
                              </Button>
                            </label>
                          </Box>

                          {variant.image && (
                            <Box sx={{ position: "relative", width: "fit-content", mb: 2 }}>
                              <img
                                src={variant.image || "/placeholder.svg"}
                                alt={`Variant ${variantIndex + 1}`}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "150px",
                                  borderRadius: "8px",
                                }}
                              />
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  bgcolor: "rgba(255,255,255,0.7)",
                                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                                }}
                                onClick={() => removeVariantImage(variantIndex)}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Additional Images
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <input
                              type="file"
                              name={`additionalImages-${variantIndex}`}
                              accept="image/*"
                              multiple
                              style={{ display: "none" }}
                              id={`additionalImages-${variantIndex}`}
                              onChange={(e) => handleAdditionalImagesChange(e, variantIndex)}
                            />
                            <label htmlFor={`additionalImages-${variantIndex}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                sx={{
                                  color: "text.primary",
                                  borderColor: "text.primary",
                                  "&:hover": {
                                    borderColor: "text.primary",
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                Upload Additional Images
                              </Button>
                            </label>
                          </Box>

                          {variant.additionalImages.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              {variant.additionalImages.map((img, imgIndex) => (
                                <Box
                                  key={imgIndex}
                                  sx={{
                                    position: "relative",
                                    width: "fit-content",
                                  }}
                                >
                                  <img
                                    src={img || "/placeholder.svg"}
                                    alt={`Additional ${imgIndex + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      right: 0,
                                      bgcolor: "rgba(255,255,255,0.7)",
                                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                                      padding: "4px",
                                    }}
                                    onClick={() => removeAdditionalImage(variantIndex, imgIndex)}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Grid>

                        {variant.sizes.map((size, sizeIndex) => (
                          <Grid item xs={12} sm={6} key={sizeIndex}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={500}>
                                Select Size
                              </Typography>
                              <Select
                                required
                                value={size.size}
                                onChange={(e) => {
                                  const newVariants = [...variants]
                                  newVariants[variantIndex].sizes[sizeIndex].size = e.target.value as string
                                  setVariants(newVariants)
                                }}
                                fullWidth
                              >
                                {(previewData.category === "Shoes" ? allowedShoeSizes : allowedSizes).map(
                                  (allowedSize) => (
                                    <MenuItem key={allowedSize} value={allowedSize}>
                                      {allowedSize}
                                    </MenuItem>
                                  ),
                                )}
                              </Select>
                              <StyledTextField
                                required
                                label="Stock"
                                type="number"
                                value={size.stock}
                                onChange={(e) => {
                                  const newVariants = [...variants]
                                  newVariants[variantIndex].sizes[sizeIndex].stock = Number.parseInt(e.target.value, 10)
                                  setVariants(newVariants)
                                }}
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                              <IconButton
                                onClick={() => removeSize(variantIndex, sizeIndex)}
                                sx={{ color: "error.main" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <OutlinedButton
                            startIcon={<AddIcon />}
                            onClick={() => addSize(variantIndex)}
                            sx={{ color: "text.primary" }}
                          >
                            Add Size
                          </OutlinedButton>
                        </Grid>
                      </Grid>
                      {variantIndex > 0 && (
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => removeVariant(variantIndex)}
                          sx={{ mt: 2, color: "error.main" }}
                        >
                          Remove Variant
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <OutlinedButton startIcon={<AddIcon />} onClick={addVariant} sx={{ color: "text.primary" }}>
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
                  bgcolor: "text.primary",
                  color: "background.paper",
                  "&:hover": { bgcolor: "text.secondary" },
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Create Product"}
              </BaseButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, bgcolor: "background.paper", height: "100%" }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{ color: "text.primary", fontWeight: 700 }}
            >
              Product Preview
            </Typography>

            <ProductCard
              product={{
                id: "preview",
                name: previewData.name || "Product Name",
                category: previewData.category || "Category",
                price: previewData.price || "0.00",
                store: storeName,
                image: previewData.image || "/placeholder-image.png",
              }}
            />

            {/* Display variant images in preview section */}
            {variants.some((v) => v.image || v.additionalImages.length > 0) && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Product Variants
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {variants.map((variant, idx) =>
                    variant.image || variant.additionalImages.length > 0 ? (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {variant.color || `Variant ${idx + 1}`}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {variant.image && (
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "4px",
                                p: 0.5,
                              }}
                            >
                              <img
                                src={variant.image || "/placeholder.svg"}
                                alt={variant.color || `Variant ${idx + 1}`}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            </Box>
                          )}
                          {variant.additionalImages.map((img, imgIdx) => (
                            <Box
                              key={imgIdx}
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "4px",
                                p: 0.5,
                              }}
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`${variant.color || `Variant ${idx + 1}`} - ${imgIdx + 1}`}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : null,
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Product created successfully!
        </Alert>
      </Snackbar>
    </Container>
  )
}

