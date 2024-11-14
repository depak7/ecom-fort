'use client'

import React, { useState, useEffect, useCallback } from "react"
import { Box, Typography, IconButton, Slider, styled, useMediaQuery, useTheme } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { BaseButton } from "../../buttons/BaseButton"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

import leftImage from "@/components/assets/users/tc-1.png"
import rightImage from "@/components/assets/users/tc-2.png"

const carouselImages = [
  { src: leftImage, alt: "Clothing" },
  { src: rightImage, alt: "Shoes" },
]

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-thumb": {
    display: "none",
  },
  "& .MuiSlider-track": {
    display: "none",
  },
  "& .MuiSlider-rail": {
    display: "none",
  },
}))

export default function TitleCard() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const handleSlideChange = (event: Event, newValue: number | number[]) => {
    setCurrentSlide(newValue as number)
  }

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselImages.length - 1))
  }, [])

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < carouselImages.length - 1 ? prev + 1 : 0))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [handleNextSlide])

  return (
    <Box sx={{ textAlign: "center", backgroundColor: "white" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "auto",
          aspectRatio: isMobile ? "1 / 1" : isTablet ? "2 / 1" : "4 / 1.20",
        }}
      >
       <Image
          src={carouselImages[currentSlide].src}
          alt={carouselImages[currentSlide].alt}
          fill
          style={{ objectFit: "fill"}} 
          priority
        />
        {!isMobile && (
          <>
            <IconButton
              onClick={handlePrevSlide}
              sx={{
                position: "absolute",
                left: 5,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextSlide}
              sx={{
                position: "absolute",
                right: 5,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        <StyledSlider
          value={currentSlide}
          onChange={handleSlideChange}
          min={0}
          max={carouselImages.length - 1}
          step={1}
          sx={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
          }}
        />
      </Box>

      <Box sx={{ marginTop: { xs: 2, sm: 3, md: 4 }, padding: { xs: 1, sm: 2 } }}>
        <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold">
          UNLEASH YOUR STYLE
        </Typography>
        <Typography variant={isMobile ? "body2" : "subtitle1"} sx={{ marginTop: 1, color: "gray" }}>
          Top Clothing & Shoes from Every Store handpicked for you!
        </Typography>

        <Box
          sx={{
            marginTop: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Link href="/stores" passHref>
            <BaseButton customSize="small"  sx={{ borderRadius: 15, width: { xs: "100%", sm: "auto" } }}>Explore Stores</BaseButton>
          </Link>
          <Link href="/products" passHref>
            <BaseButton customSize="small" sx={{ borderRadius: 15, width: { xs: "100%", sm: "auto" } }}>Explore Products</BaseButton>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}