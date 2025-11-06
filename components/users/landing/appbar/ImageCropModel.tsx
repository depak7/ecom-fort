"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Box, Button, CircularProgress, Slider, IconButton, Tooltip } from "@mui/material"
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CropRotate as CropRotateIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material"
import axios from "axios"

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onSearchComplete?: () => void
  errorToast: (msg: string) => void
  successToast: (msg: string) => void
}

export default function ImageCropModal({ isOpen, onClose, errorToast, successToast }: ImageCropModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [cropMode, setCropMode] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setCropMode(true)
      setZoom(1)
      setCropArea({ x: 0, y: 0, width: 100, height: 100 })
    }
    reader.readAsDataURL(file)
  }

  const getCroppedImage = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.current || !imgRef.current || !selectedImage) {
        reject(new Error("Missing canvas or image"))
        return
      }

      const canvas = canvasRef.current
      const img = imgRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Canvas context not available"))
        return
      }

      img.onload = () => {
        const imgWidth = img.naturalWidth
        const imgHeight = img.naturalHeight

        const cropWidth = (cropArea.width / 100) * imgWidth
        const cropHeight = (cropArea.height / 100) * imgHeight
        const cropX = (cropArea.x / 100) * imgWidth
        const cropY = (cropArea.y / 100) * imgHeight

        canvas.width = cropWidth
        canvas.height = cropHeight

        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error("Failed to create blob"))
          },
          "image/jpeg",
          0.9,
        )
      }

      img.src = selectedImage
    })
  }, [selectedImage, cropArea])

  const handleImageSearch = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    try {
      const blob = await getCroppedImage()
      const formData = new FormData()
      formData.append("file", blob)
      formData.append("top_k", "50")
      const { data } = await axios.post("/api/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      
      if (!data.success) {
        errorToast(data.message || "No results found.")
        return
      }
    
      onClose()      
      window.location.href = `/image-results/${data.token}`
    } catch (err) {
      console.error("Image search failed:", err)
      errorToast("Image search failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setCropMode(false)
    setZoom(1)
    setCropArea({ x: 0, y: 0, width: 100, height: 100 })
    onClose()
  }

  if (!isOpen) return null

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      onClick={handleCloseModal}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: "#000",
          color: "white",
          p: 3,
          borderRadius: 2,
          maxWidth: 600,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <CloudUploadIcon />
            <span style={{ fontWeight: 600, fontSize: "16px" }}>Image Search</span>
          </Box>
          <IconButton onClick={handleCloseModal} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedImage ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Image Preview Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 400,
                bgcolor: "#1a1a1a",
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <img
                ref={imgRef}
                src={selectedImage || "/placeholder.svg"}
                alt="Selected for crop"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transform: `scale(${zoom})`,
                  transition: "transform 0.2s ease",
                }}
              />

              {/* Crop Area Overlay */}
              {cropMode && (
                <Box
                  sx={{
                    position: "absolute",
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                    border: "2px dashed white",
                    bgcolor: "rgba(255,255,255,0.05)",
                    cursor: "move",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
                  }}
                  onMouseDown={(e) => {
                    const startX = e.clientX
                    const startY = e.clientY
                    const startArea = cropArea

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX
                      const deltaY = moveEvent.clientY - startY

                      setCropArea({
                        ...startArea,
                        x: Math.max(0, Math.min(100 - startArea.width, startArea.x + deltaX / 4)),
                        y: Math.max(0, Math.min(100 - startArea.height, startArea.y + deltaY / 4)),
                      })
                    }

                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                    }

                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                  }}
                />
              )}
            </Box>

            {/* Crop Mode Status */}
            {cropMode && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <CropRotateIcon fontSize="small" />
                <span style={{ fontSize: "13px" }}>
                  Drag the crop box to adjust. Zoom and position your image, then search.
                </span>
              </Box>
            )}

            {/* Zoom Slider */}
            {cropMode && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title="Zoom out">
                  <IconButton size="small" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} sx={{ color: "white" }}>
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>

                <Slider
                  value={zoom}
                  onChange={(e, val) => setZoom(val as number)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  sx={{
                    flex: 1,
                    color: "white",
                    "& .MuiSlider-thumb": {
                      bgcolor: "white",
                    },
                    "& .MuiSlider-track": {
                      bgcolor: "white",
                    },
                  }}
                />

                <Tooltip title="Zoom in">
                  <IconButton size="small" onClick={() => setZoom(Math.min(3, zoom + 0.2))} sx={{ color: "white" }}>
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>

                <span style={{ fontSize: "12px", minWidth: "40px", textAlign: "center" }}>{zoom.toFixed(1)}x</span>
              </Box>
            )}

            {/* Action Buttons */}
            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCropMode(!cropMode)}
                startIcon={<CropRotateIcon />}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                  },
                }}
              >
                {cropMode ? "Done Cropping" : "Edit Crop"}
              </Button>

              <Button
                fullWidth
                variant="contained"
                disabled={isUploading}
                onClick={handleImageSearch}
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(255,255,255,0.5)",
                    color: "#000",
                  },
                }}
              >
                {isUploading ? "Searching..." : "Search"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 4,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, opacity: 0.7 }} />
            <span style={{ textAlign: "center", fontSize: "14px" }}>
              Choose an image to search for similar products
            </span>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
            >
              Choose Image
              <input hidden ref={fileInputRef} accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
          </Box>
        )}

        {/* Hidden Canvas for Cropping */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Box>
    </Box>
  )
}
