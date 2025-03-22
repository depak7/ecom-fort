"use client";

import React, { useCallback, useState, useEffect } from "react";
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
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
  Divider,
  IconButton,
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
import { addProductReview, getProductReviews, getProductReviewSummary } from "@/app/actions/wishlist/action";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<any>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const { errorToast, successToast } = UseCustomToast();

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const reviewsResult = await getProductReviews(product.id);
      const summaryResult = await getProductReviewSummary(product.id);
      
      if (reviewsResult.success) {
        setReviews(reviewsResult.reviews || []);
      }
      if (summaryResult.success) {
        setReviewSummary(summaryResult.summary);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleShowReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleReviewSubmit = async () => {
    if (!userId) {
      errorToast("Please login to submit a review");
      return;
    }

    if (!reviewRating) {
      errorToast("Please select a rating");
      return;
    }

    try {
      const result = await addProductReview({
        userId,
        productId: product.id,
        rating: reviewRating,
        comment: reviewText
      });

      if (result.success) {
        successToast("Your review has been added successfully!");
        setReviewText("");
        setReviewRating(null);
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        errorToast(result.error || "Failed to submit review");
      }
    } catch (error) {
      errorToast("An error occurred while submitting the review");
    }
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
      errorToast("please login to add wishlist products");
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

  const hasUserReviewed = reviews.some(review => review.userId === userId);

  return (
    <Box sx={{ maxWidth: 1600, margin: "auto", padding: 1 }}>
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
              {isLoadingReviews ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {reviewSummary && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Overall Rating: {reviewSummary.averageRating}/5
                      </Typography>
                      <Rating value={reviewSummary.averageRating} precision={0.1} readOnly />
                      <Typography variant="body2">
                        Based on {reviewSummary.totalReviews} reviews
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                            {review.user.name}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ mt: 2 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      {!hasUserReviewed && userId && (
        <Button variant="contained" onClick={handleShowReviewForm}>
          Write a Review
        </Button>
      )}
      <Dialog open={showReviewForm} onClose={handleShowReviewForm} maxWidth="md" fullWidth>
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Please provide your review:</Typography>
          <StyledTextField
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Select Rating:</Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShowReviewForm} color="primary">Cancel</Button>
          <Button onClick={handleReviewSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
