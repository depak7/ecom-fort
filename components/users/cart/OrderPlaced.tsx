"use client"
import { useEffect, useState } from "react"
import {
    Button,
    Typography,
    Box,
    Paper,
    Grid,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Card,
    CardContent,
    Fade,
    Zoom,
    useTheme,
    useMediaQuery,
    CircularProgress,
    StepIcon,
} from "@mui/material"
import {
    CheckCircleOutline,
    LocalShipping,
    Payment,
    ShoppingBag,
    Email,
    Celebration,
    ArrowForward,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import Image from "next/image"
import orderplaced from "@/components/assets/users/order-placed.jpg"
import { motion } from "framer-motion"

const OrderConfirmation = (order: { order: any }) => {
    const router = useRouter()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [loading, setLoading] = useState(true)
    const [activeStep, setActiveStep] = useState(0)
    const [orderDetails, setOrderDetails] = useState({
        orderId: "-",
        date:"-",
        items: "-",
        total: "-"
    });

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500)

        // Simulate order progress steps
        const stepTimer = setInterval(() => {
            setActiveStep((prevStep) => {
                if (prevStep >= 2) {
                    clearInterval(stepTimer)
                    return 1
                }
                return 1
            })
        }, 1000)

    

        return () => {
            clearTimeout(timer)
            // clearInterval(stepTimer)
        }
    }, [])

    const handleContinueShopping = () => {
        router.push("/products")
    }

    const steps = [
        { label: "Order Placed", icon: <ShoppingBag /> },
        { label: "Payment Pending", icon: <Payment /> },
        { label: "Ready for Delivery", icon: <LocalShipping /> },
    ]

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="subtitle1">Processing your order...</Typography>
            </Box>
        )
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                flexDirection: "column",
                padding: 2,
                backgroundColor: "#f8f9fa",
            }}
        >
            {/* Confetti Effect */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    overflow: "hidden",
                    zIndex: 0,
                }}
            >
                {Array.from({ length: 50 }).map((_, index) => (
                    <Box
                        key={index}
                        component={motion.div}
                        initial={{
                            y: -20,
                            x: Math.random() * window.innerWidth,
                            rotate: 0,
                            opacity: 1,
                        }}
                        animate={{
                            y: window.innerHeight + 100,
                            rotate: 360,
                            opacity: 0,
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            delay: Math.random() * 5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: Math.random() * 7 + 3,
                        }}
                        sx={{
                            position: "absolute",
                            width: Math.random() * 10 + 5,
                            height: Math.random() * 10 + 5,
                            backgroundColor: [
                                "#FF5252",
                                "#FF4081",
                                "#E040FB",
                                "#7C4DFF",
                                "#536DFE",
                                "#448AFF",
                                "#40C4FF",
                                "#18FFFF",
                                "#64FFDA",
                                "#69F0AE",
                                "#B2FF59",
                                "#EEFF41",
                                "#FFFF00",
                                "#FFD740",
                                "#FFAB40",
                                "#FF6E40",
                            ][Math.floor(Math.random() * 16)],
                            borderRadius: "50%",
                        }}
                    />
                ))}
            </Box>

            <Zoom in={true} timeout={1000}>
                <Box
                    sx={{
                        textAlign: "center",
                        marginBottom: 4,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: "success.main",
                            margin: "0 auto",
                            mb: 2,
                        }}
                    >
                        <CheckCircleOutline fontSize="medium" />
                    </Avatar>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                        }}
                    >
                        Order Confirmed!
                    </Typography>

                    <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Thanks for Shopping with Us!
                    </Typography>

                    <Box sx={{ mt: 3, position: "relative" }}>
                        <Image
                            src={orderplaced || "/placeholder.svg"}
                            alt="Thank You"
                            width={250}
                            height={250}
                            style={{
                                borderRadius: "15px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Box
                            component={motion.div}
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 3,
                            }}
                            sx={{
                                position: "absolute",
                                top: -15,
                                right: -15,
                                zIndex: 2,
                            }}
                        >
                            <Celebration
                                sx={{
                                    fontSize: 40,
                                    color: "error.main",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Zoom>

            <Grid container spacing={3} justifyContent="center" sx={{ zIndex: 1 }}>
                <Grid item xs={12} md={8}>
                    <Fade in={true} timeout={1500}>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                backgroundColor: "#fff",
                            }}
                        >
                            {/* Order Progress */}
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: theme.palette.primary.main,
                                    color: "white",
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: "medium" }}>
                                    Order Status
                                </Typography>

                                <Stepper
                                    activeStep={activeStep}
                                    alternativeLabel={!isMobile}
                                    orientation={isMobile ? "vertical" : "horizontal"}
                                    sx={{
                                        "& .MuiStepLabel-label": {
                                            color: "white",
                                            mt: 1,
                                            "&.Mui-active": { fontWeight: "bold" },
                                        },
                                        "& .MuiStepIcon-root": {
                                            color: "rgba(255,255,255,0.5)",
                                            "&.Mui-active": { color: "white" },
                                            "&.Mui-completed": { color: "#4caf50" },
                                        },
                                    }}
                                >
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel StepIconComponent={StepIcon}>
                                                {step.label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            {/* Order Details */}
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                                    Order Details
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Order ID
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {orderDetails.orderId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Date
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {orderDetails.date}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Items
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {orderDetails.items}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {orderDetails.total}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                    Important Information
                                </Typography>

                                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" paragraph>
                                            Thank you for placing your order. The seller will contact you soon for payment instructions.
                                        </Typography>

                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Please note that the delivery will be handled by the seller/store owner. Be sure to confirm the
                                            delivery details before proceeding with payment.
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1,
                                                color: "primary.main",
                                            }}
                                        >
                                            <Email fontSize="small" />
                                            <Typography variant="body2">
                                                <a
                                                    href="mailto:deepakfordev@gmail.com"
                                                    style={{ color: "inherit", textDecoration: "none", fontWeight: "medium" }}
                                                >
                                                    deepakfordev@gmail.com
                                                </a>
                                            </Typography>
                                        </Box>


                                    </CardContent>
                                </Card>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 4,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        onClick={handleContinueShopping}
                                        sx={{
                                            borderRadius: 30,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            fontWeight: "bold",
                                            boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                                            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                            "&:hover": {
                                                boxShadow: "0 12px 20px rgba(33, 150, 243, 0.4)",
                                            },
                                        }}
                                    >
                                        Continue Shopping
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    )
}

export default OrderConfirmation
