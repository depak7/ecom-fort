"use client";

import React, { useCallback, useState } from "react";
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
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { BaseButton } from "../buttons/BaseButton";
import { ProductResponse } from "@/app/actions/products/types";
import {
  OutlinedButton,
  StyledTextField,
} from "@/components/styledcomponents/StyledElements";
import { toggleWishlistItem } from "@/app/actions/wishlist/action";
import UseCustomToast from "@/components/ui/useCustomToast";
import { addToCart } from "@/app/actions/cart/action";

export default function ProductDetails({
  product,
  isWishlisted,
  userId,
}: ProductResponse) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [isPending, setIsPending] = useState(false);

  const [selectedSize, setSelectedSize] = useState(
    selectedVariant.sizes[0].size
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mainImage, setMainImage] = useState<string>(
    selectedVariant.images[0].url
  );
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>( selectedVariant.sizes[0].id); 


  const { errorToast, successToast } = UseCustomToast();

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
      const selectedSizeObj = selectedVariant.sizes.find(size => size.size === newSize);
      setSelectedSizeId(selectedSizeObj ? selectedSizeObj.id : null); 
    }
  };

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(Number(event.target.value));
  };

  const handleWishlistToggle = useCallback(async () => {
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    setIsPending(true);

    try {
      const result = await toggleWishlistItem(
        userId,
        product.id,
        selectedVariant.id
      );
      if (result.success) {
        setInWishlist((prev) => !prev);
      } else {
        console.error("Failed to update wishlist:", result.error);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsPending(false);
    }
  }, [userId, product.id, selectedVariant.id]);

  const handleAddtoCart = async () => {
    if (!userId) {
      errorToast("please login to add products to cart");
      return;
    }
    try {
      const res = await addToCart(userId, product.id, quantity,selectedVariant.id,selectedSizeId?selectedSizeId:0);
      res.success?successToast("Product added to cart successfully!"): errorToast("Soory something went wrong")
       
    } catch (error) {
      console.error("Error adding to cart:", error);
      errorToast("Soory something went wrong")
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {product.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Image src={mainImage} alt={product.name} width={500} height={500} />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {selectedVariant.images.map((img, index) => (
              <Box
                key={img.id}
                sx={{
                  width: 60,
                  height: 60,
                  border: img.url == mainImage ? "2px solid black" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setMainImage(img.url);
                }}
              >
                <Image
                  src={img.url}
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
            MRP : ₹ {product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            incl. of taxes
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            (Your delivery fee will be determined by the store you choose.)
          </Typography>
          <Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {product.variants.map((variant) => (
                <Box
                  key={variant.id}
                  sx={{
                    width: 60,
                    height: 60,
                    border:
                      variant === selectedVariant ? "2px solid black" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <Image
                    src={variant.variantImage}
                    alt={`Color ${variant.color}`}
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
              {selectedVariant.sizes.map((size) => (
                <ToggleButton
                  key={size.id}
                  value={size.size}
                  aria-label={size.size}
                >
                  {size.size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Quantity :
            </Typography>
            <Select
              value={quantity.toString()}
              type="number"
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
                <MenuItem key={q} value={q.toString()}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
            <OutlinedButton
              variant="contained"
              onClick={handleWishlistToggle}
              disabled={isPending}
              endIcon={
                <FavoriteIcon sx={{ color: inWishlist ? "red" : "inherit" }} />
              }
            >
              {inWishlist ? "Remove from Favorites" : "Add to Favorites"}
            </OutlinedButton>
            <BaseButton sx={{ borderRadius: "50px" }} onClick={handleAddtoCart}>Add to Bag</BaseButton>
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
                  <StyledTextField
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
