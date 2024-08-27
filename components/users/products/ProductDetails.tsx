"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ProductImage1 from "@/components/assets/users/productImage-1.png";
import ProductImage2 from "@/components/assets/users/productImage-2.png";
import ProductImage3 from "@/components/assets/users/productImage-3.png";
import ProductImage4 from "@/components/assets/users/productImage-4.png";
import ProductImage5 from "@/components/assets/users/productImage-5.png";
import ProductImagecolor1 from "@/components/assets/users/productImage-color-1.png";
import ProductImagecolor2 from "@/components/assets/users/productImage-color-2.png";
import { BaseButton } from "../buttons/BaseButton";

const productImages = [
  ProductImage1,
  ProductImage2,
  ProductImage3,
  ProductImage4,
  ProductImage5,
  ProductImage1,
  ProductImagecolor1,
  ProductImagecolor2,
];

const sizes = ["7 UK", "8 UK", "9 UK", "10 UK"];

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [selectedColor, setSelectedColor] = useState(productImages[5]);
  const [selectedSize, setSelectedSize] = useState("8 UK");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState<number | null>();
  const [quantity, setQuantity] = useState("1");

  const handleShowReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleReviewSubmit = () => {
    console.log("Review submitted:", reviewText, reviewRating);
  };

  const handleSeeAllReviews = () => {
    console.log("See all reviews");
  };

  const handleSizeChange = (
    event: React.MouseEvent<HTMLElement>,
    newSize: string
  ) => {
    if (newSize !== null) {
      setSelectedSize(newSize);
    }
  };

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nike Air Max Plus Shoes
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Men's Shoes
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Image
            src={selectedImage}
            alt="Nike Air Max Plus"
            width={500}
            height={500}
            layout="responsive"
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {productImages.slice(0, 5).map((img, index) => (
              <Box
                key={index}
                sx={{
                  width: 60,
                  height: 60,
                  border:
                    img === selectedImage
                      ? "2px solid black"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={60}
                  height={60}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" component="p" fontWeight={700} gutterBottom>
            MRP : ₹ 8,995.00
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            incl. of taxes
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            (Your delivery fee will be determined by the store you choose.)
          </Typography>
          <Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {productImages.slice(5, 8).map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 60,
                    height: 60,
                    border: img === selectedColor ? "2px solid black" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedColor(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Select Size
            </Typography>
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              onChange={handleSizeChange}
              aria-label="shoe size"
            >
              {sizes.map((size) => (
                <ToggleButton key={size} value={size} aria-label={size}>
                  {size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Quantity :
            </Typography>
            <Select
              value={quantity}
              onChange={handleQuantityChange}
              sx={{
                width: 80,
                height: 40,
                color: "black",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
              }}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
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
              Favourite
            </Button>
            <BaseButton sx={{ borderRadius: "50px" }}>Add to Bag</BaseButton>
          </Box>
          <Accordion sx={{ mt: 4, boxShadow: "none" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"}>Reviews</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  4.5 out of 5
                </Typography>
              </Box>
              <Typography variant="body2">
                Based on 123 reviews. Users love the comfort and style of these
                shoes!
              </Typography>
              {showReviewForm ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mt: 2,
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Write a Review"
                    multiline
                    rows={4}
                    fullWidth
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Rating
                    name="review-rating"
                    value={reviewRating}
                    onChange={(event, newValue) => {
                      setReviewRating(newValue);
                    }}
                  />
                  <BaseButton size="medium" onClick={handleReviewSubmit}>
                    Submit Review
                  </BaseButton>
                </Box>
              ) : (
                <Button
                  variant="text"
                  sx={{
                    mt: 2,
                    color: "black",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={handleShowReviewForm}
                >
                  Write a Review
                </Button>
              )}

              <Button
                variant="text"
                sx={{
                  color: "black",
                  mt: 2,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleSeeAllReviews}
              >
                See All Reviews
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
}
