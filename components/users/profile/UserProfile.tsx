"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    Divider,
    TextField,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    useTheme
} from "@mui/material"
import {
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    Store as StoreIcon,
    LocationOn as LocationIcon,
    ShoppingBag as ShoppingBagIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    VerifiedUser as VerifiedUserIcon,
    AccountBalance as AccountBalanceIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from "@mui/icons-material"
import { format } from "date-fns";

import banner from '@/components/assets/users/banner.jpg'


export default function ProfilePage({ user, storeDetails, orders }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [tabValue, setTabValue] = useState(0)
    const [editProfile, setEditProfile] = useState(false)
    const [editedUser, setEditedUser] = useState({ ...user })

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    const handleEditProfile = () => {
        setEditProfile(true)
    }

    const handleSaveProfile = () => {
        // In a real app, you would save the changes to the backend here
        setEditProfile(false)
    }

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value,
        })
    }

    const formatDate = (dateObj) => {
        if (!dateObj) return "N/A";
        try {
            const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
            return format(date, "MMM dd, yyyy - h:mm a");
        } catch (error) {
            return "Invalid Date";
        }
    };

    return (
        <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", py: 2 }}>
            <Container maxWidth="lg">
                {/* User Profile Card */}
                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mb: 3,
                        borderRadius: 2,
                        background: "linear-gradient(to right, rgba(0,172,193,0.05), rgba(233,30,99,0.05))",
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2} sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Avatar
                                src={user.avatar}
                                alt={user.name}
                                sx={{
                                    width: { xs: 80, sm: 100 },
                                    height: { xs: 80, sm: 100 },
                                    border: "3px solid #00acc1",
                                    boxShadow: "0 4px 10px rgba(0,172,193,0.2)",
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {editProfile ? (
                                <Box component="form" sx={{ "& .MuiTextField-root": { mb: 2 } }}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={editedUser.name}
                                        onChange={handleUserChange}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#00acc1" },
                                                "&.Mui-focused fieldset": { borderColor: "#00acc1" },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={editedUser.email}
                                        onChange={handleUserChange}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#00acc1" },
                                                "&.Mui-focused fieldset": { borderColor: "#00acc1" },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#00acc1" },
                                                "&.Mui-focused fieldset": { borderColor: "#00acc1" },
                                            },
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                                    <Typography variant="h4" gutterBottom fontWeight="500">
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        {user.email}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={user.role}
                                            color="secondary"
                                            size="small"
                                            sx={{
                                                bgcolor: "#e91e63",
                                                color: "white",
                                                fontWeight: 500,
                                                "& .MuiChip-label": { px: 1 },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                        {/* <Grid
                            item
                            xs={12}
                            sm={2}
                            sx={{
                                display: "flex",
                                justifyContent: { xs: "center", sm: "flex-end" },
                                mt: { xs: 2, sm: 0 },
                            }}
                        >
                            {editProfile ? (
                                <Box sx={{ display: "flex", flexDirection: { xs: "column" }, gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveProfile}
                                        sx={{
                                            bgcolor: "#00acc1",
                                            "&:hover": { bgcolor: "#008a9a" },
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CloseIcon />}
                                        onClick={() => setEditProfile(false)}
                                        sx={{
                                            borderColor: "rgba(0,0,0,0.23)",
                                            color: "text.primary",
                                            "&:hover": { borderColor: "text.primary" },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={handleEditProfile}
                                    sx={{
                                        borderColor: "#00acc1",
                                        color: "#00acc1",
                                        "&:hover": { borderColor: "#00acc1", bgcolor: "rgba(0,172,193,0.1)" },
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Grid> */}
                    </Grid>
                </Paper>

                {/* Tabs Section */}
                <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons="auto"
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            "& .MuiTabs-indicator": { bgcolor: "#e91e63" },
                            "& .Mui-selected": { color: "#e91e63" },
                        }}
                    >
                        {storeDetails && (
                            <Tab icon={<StoreIcon />} label="Store Details" iconPosition="start" />
                        )}
                        <Tab icon={<ShoppingBagIcon />} label="Orders" iconPosition="start" />
                    </Tabs>

                    {/* Store Details Tab */}
                    {storeDetails && (
                        <Box sx={{ p: { xs: 2, sm: 3 }, display: tabValue === 0 ? "block" : "none" }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: { xs: 150, sm: 200 },
                                            mb: 3,
                                            borderRadius: 2,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Image
                                            src={banner}
                                            alt="Store Banner"
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                p: 2,
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Avatar
                                                src={storeDetails.logo}
                                                alt={storeDetails.name}
                                                sx={{
                                                    width: { xs: 40, sm: 60 },
                                                    height: { xs: 40, sm: 60 },
                                                    border: "2px solid white",
                                                    mr: 2,
                                                }}
                                            />
                                            <Typography variant="h5" fontWeight="bold" color="white">
                                                {storeDetails.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" paragraph color="text.secondary">
                                        {storeDetails.description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Accordion
                                        defaultExpanded
                                        sx={{
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            "&:before": { display: "none" },
                                            mb: 2,
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <BusinessIcon sx={{ mr: 1, color: "#00acc1" }} />
                                                <Typography variant="h6">Business Details</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Business Type"
                                                        secondary={storeDetails.businessType}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                                {storeDetails.gstNumber && (
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="GST Number"
                                                            secondary={storeDetails.gstNumber}
                                                            primaryTypographyProps={{ fontWeight: 500 }}
                                                        />
                                                    </ListItem>
                                                )}
                                                {storeDetails.panNumber && (
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="PAN Number"
                                                            secondary={storeDetails.panNumber}
                                                            primaryTypographyProps={{ fontWeight: 500 }}
                                                        />
                                                    </ListItem>
                                                )}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Accordion
                                        defaultExpanded
                                        sx={{
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            "&:before": { display: "none" },
                                            mb: 2,
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <LocationIcon sx={{ mr: 1, color: "#00acc1" }} />
                                                <Typography variant="h6">Address</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body1" paragraph>
                                                {storeDetails.address}
                                                <br />
                                                {storeDetails.city}, {storeDetails.state} {storeDetails.pincode}
                                            </Typography>
                                            {storeDetails.mapLink && (
                                                <Typography variant="body2" color="primary">
                                                    Google Maps Link Available
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Accordion
                                        sx={{
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            "&:before": { display: "none" },
                                            mb: 2,
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <PhoneIcon sx={{ mr: 1, color: "#00acc1" }} />
                                                <Typography variant="h6">Contact Information</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Phone"
                                                        secondary={storeDetails.phoneNumber}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                                {storeDetails.alternatePhone && (
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Alternate Phone"
                                                            secondary={storeDetails.alternatePhone}
                                                            primaryTypographyProps={{ fontWeight: 500 }}
                                                        />
                                                    </ListItem>
                                                )}
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Email"
                                                        secondary={storeDetails.email}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Accordion
                                        sx={{
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            "&:before": { display: "none" },
                                            mb: 2,
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <VerifiedUserIcon sx={{ mr: 1, color: "#00acc1" }} />
                                                <Typography variant="h6">Verification Status</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ mb: 2 }}>
                                                <Chip
                                                    label={storeDetails.verificationStatus}
                                                    color={storeDetails.isApproved ? "success" : "warning"}
                                                    size="small"
                                                    sx={{ mb: 1 }}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    Active Status: {storeDetails.isActive ? "Active" : "Inactive"}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Submitted Documents:
                                            </Typography>
                                            <List dense>
                                                {storeDetails.addressProof && (
                                                    <ListItem>
                                                        <ListItemText primary="Address Proof" />
                                                    </ListItem>
                                                )}
                                                {storeDetails.identityProof && (
                                                    <ListItem>
                                                        <ListItemText primary="Identity Proof" />
                                                    </ListItem>
                                                )}
                                                {storeDetails.businessProof && (
                                                    <ListItem>
                                                        <ListItemText primary="Business Proof" />
                                                    </ListItem>
                                                )}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Accordion
                                        sx={{
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            "&:before": { display: "none" },
                                            mb: 2,
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <AccountBalanceIcon sx={{ mr: 1, color: "#00acc1" }} />
                                                <Typography variant="h6">Bank Details</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Bank Name"
                                                        secondary={storeDetails.bankName}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Account Number"
                                                        secondary={storeDetails.accountNumber}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="IFSC Code"
                                                        secondary={storeDetails.ifscCode}
                                                        primaryTypographyProps={{ fontWeight: 500 }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {/* Orders Tab */}
                    <Box sx={{ p: { xs: 2, sm: 3 }, display: tabValue === 1 ? "block" : "none" }}>
                        {orders && orders.length > 0 ? (
                            <>
                                {/* Mobile-friendly order cards for small screens */}
                                <Box sx={{ display: { xs: "block", md: "none" } }}>
                                    {orders.map((order) => (
                                        <Card key={order.orderId} sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                            <CardContent>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                    <Typography variant="h6" color="text.primary">
                                                        {order.orderId}
                                                    </Typography>
                                                    <Chip
                                                        label={order.status}
                                                        size="small"
                                                        color={order.status === "Delivered" ? "success" : "primary"}
                                                        sx={{
                                                            bgcolor: order.status === "Delivered" ? "#4caf50" : "#00acc1",
                                                            color: "white",
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Date: {formatDate(order.date)}
                                                </Typography>

                                                <Divider sx={{ my: 1.5 }} />

                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    Items:
                                                </Typography>

                                                {order.items.map((item, index) => (
                                                    <Box key={index} sx={{ mb: 1 }}>
                                                        <Typography variant="body2">
                                                            {item.quantity}x {item.name} -
                                                            ₹{item.price}
                                                        </Typography>
                                                    </Box>
                                                ))}

                                                <Divider sx={{ my: 1.5 }} />

                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Total:
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold" color="#00acc1">

                                                        ₹{order.total}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                        </Card>
                                    ))}
                                </Box>

                                {/* Desktop table view for larger screens */}
                                <Box sx={{ display: { xs: "none", md: "block" } }}>
                                    <Paper sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                                            <Grid container sx={{ fontWeight: "bold" }}>
                                                <Grid item xs={2}>
                                                    <Typography variant="subtitle1">Order ID</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="subtitle1">Date</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="subtitle1">Items</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="subtitle1">Total</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="subtitle1">Status</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        {orders.map((order, index) => (
                                            <Box
                                                key={order.orderId}
                                                sx={{
                                                    p: 2,
                                                    borderBottom: index < orders.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                                                    "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                                                }}
                                            >
                                                <Grid container alignItems="center">
                                                    <Grid item xs={2}>
                                                        <Typography variant="body2">{order.orderId}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography variant="body2">{formatDate(order.date)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        {order.items.map((item, idx) => (
                                                            <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                                                {item.quantity}x {item.name}
                                                            </Typography>
                                                        ))}
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography variant="body2" fontWeight="medium" color="#00acc1">

                                                            ₹{order.total}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Chip
                                                            label={order.status}
                                                            size="small"
                                                            color={order.status === "Delivered" ? "success" : "primary"}
                                                            sx={{
                                                                bgcolor: order.status === "Delivered" ? "#4caf50" : "#00acc1",
                                                                color: "white",
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </Grid>

                                                </Grid>
                                            </Box>
                                        ))}
                                    </Paper>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <ShoppingBagIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No orders found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    You haven&apos;t placed any orders yet
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
