'use client'

import React, { useState, useEffect, useCallback } from "react"
import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

import leftImage from "@/components/assets/users/bnr1.jpg"
import rightImage from "@/components/assets/users/bnr2.jpg"

const carouselImages = [
  { src: leftImage, alt: "Clothing collection" },
  { src: rightImage, alt: "Shoes collection" },
]

export default function TitleCard() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselImages.length - 1))
  }, [])

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < carouselImages.length - 1 ? prev + 1 : 0))
  }, [])

  useEffect(() => {
    const interval = setInterval(handleNextSlide, 5000)
    return () => clearInterval(interval)
  }, [handleNextSlide])

  return (
    <Box sx={{ bgcolor: "#0f172a", position: "relative" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "16/9", sm: "21/9", md: "3/1" },
          maxHeight: { md: 340 },
          overflow: "hidden",
        }}
      >
        <Image
          src={carouselImages[currentSlide].src}
          alt={carouselImages[currentSlide].alt}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.1) 50%, transparent 100%)",
          }}
        />

        {!isMobile && (
          <>
            <IconButton
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "#fff" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextSlide}
              aria-label="Next slide"
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "#fff" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {carouselImages.map((_, i) => (
            <Box
              key={i}
              component="button"
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrentSlide(i)}
              sx={{
                width: currentSlide === i ? 24 : 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                p: 0,
                cursor: "pointer",
                bgcolor: currentSlide === i ? "#fff" : "rgba(255,255,255,0.45)",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
