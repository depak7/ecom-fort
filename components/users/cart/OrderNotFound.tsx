"use client"

import { Box, Typography, Button, Paper, Fade, useTheme, Divider } from "@mui/material"
import { SearchOff, ArrowBack, Home, ShoppingBag } from "@mui/icons-material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ordernotfound from '@/components/assets/users/ordernotfound.jpg'

const OrderNotFound = () => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <Fade in={true} timeout={800}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 3,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: { xs: "100%", sm: 500 },
            width: "100%",
            overflow: "hidden",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: theme.palette.error.main,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated background pattern */}
            <Box
              component={motion.div}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <SearchOff sx={{ fontSize: { xs: 30, sm: 50 }, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ position: "relative" }}>
              Order Not Found
            </Typography>
          </Box>

          {/* Image */}
          <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <Box
              component={motion.div}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              sx={{
                width: { xs: 150, sm: 200 },
                height: { xs: 150, sm: 200 },
                position: "relative",
                mb: 2,
              }}
            >
              <Image
                src={ordernotfound}
                alt="Order not found"
                width={200}
                height={200}
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ px: 4, pb: 4 }}>
            <Typography variant="h6" color="error" gutterBottom fontWeight="medium">
              We couldn't find the order you're looking for
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              The order may have been cancelled, removed, or the order ID might be incorrect.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary" paragraph>
              If you believe this is an error, please contact our customer support team for assistance.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => router.back()}
                sx={{
                  borderRadius: 30,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                }}
              >
                Go Back
              </Button>

              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => router.push("/")}
                sx={{
                  borderRadius: 30,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                }}
              >
                Return Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  )
}

export default OrderNotFound
