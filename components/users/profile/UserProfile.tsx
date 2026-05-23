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
    TextField,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    useTheme,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import { useLocation } from '@/components/users/location/LocationProvider'

function orderChipSx(statusRaw: string) {
    const primary = (statusRaw || "").split(" · ")[0]?.toUpperCase() ?? ""
    if (primary === "DELIVERED") return { bgcolor: "#2e7d32", color: "#fff" }
    if (primary === "CANCELLED") return { bgcolor: "#c62828", color: "#fff" }
    if (primary === "PENDING") return { bgcolor: "#ed6c02", color: "#fff" }
    if (primary === "PROCESSING" || primary === "SHIPPED") return { bgcolor: "#0288d1", color: "#fff" }
    if (primary === "UNKNOWN") return { bgcolor: "#757575", color: "#fff" }
    return { bgcolor: "#546e7a", color: "#fff" }
}

function shortOrderId(id: string) {
    if (!id) return "—"
    return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id
}


export default function ProfilePage({ user, storeDetails, orders }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const { selectedCity } = useLocation()
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

    /** Orders tab is index 1 when "Store" exists, otherwise it is the only tab (index 0). */
    const ordersTabIndex = storeDetails ? 1 : 0
    const hasOrders = Array.isArray(orders) && orders.length > 0

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
                                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: { xs: "center", sm: "flex-start" } }}>
                                        <LocationIcon sx={{ fontSize: 16 }} />
                                        Browsing city: {selectedCity || "All cities"}
                                        <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                                            (change on home, stores, or products pages)
                                        </Typography>
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
                    <Box sx={{ p: { xs: 2, sm: 3 }, display: tabValue === ordersTabIndex ? "block" : "none" }}>
                        {hasOrders ? (
                            <Stack spacing={2.5}>
                                {orders.map((order) => (
                                    <Card
                                        key={order.orderId}
                                        elevation={0}
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                                bgcolor: "rgba(0, 172, 193, 0.06)",
                                                borderBottom: "1px solid",
                                                borderColor: "divider",
                                            }}
                                        >
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                    ORDER
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                    sx={{ fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}
                                                >
                                                    {shortOrderId(order.orderId)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                                    {order.orderId}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                                <Chip
                                                    label={order.statusLabel}
                                                    size="small"
                                                    sx={{ ...orderChipSx(order.status), fontWeight: 600 }}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <CardContent sx={{ pt: 2 }}>
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        PLACED
                                                    </Typography>
                                                    <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        LAST UPDATED
                                                    </Typography>
                                                    <Typography variant="body2">{formatDate(order.updatedAt)}</Typography>
                                                </Grid>
                                            </Grid>

                                            {order.address ? (
                                                <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
                                                        SHIP TO
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {order.address.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.address.street}, {order.address.city}, {order.address.state}{" "}
                                                        {order.address.postalCode}, {order.address.country}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        Phone: {order.address.phoneNumber}
                                                        {order.address.alternatePhoneNumber
                                                            ? ` · Alt: ${order.address.alternatePhoneNumber}`
                                                            : ""}
                                                    </Typography>
                                                </Paper>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Shipping address (ID {order.addressId}) is not available.
                                                </Typography>
                                            )}

                                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                                Order items
                                            </Typography>
                                            <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ bgcolor: "rgba(0,0,0,0.03)" }}>
                                                            <TableCell>Product</TableCell>
                                                            <TableCell>Store</TableCell>
                                                            <TableCell align="center">Size</TableCell>
                                                            <TableCell align="right">Qty</TableCell>
                                                            <TableCell align="right">Unit ₹</TableCell>
                                                            <TableCell align="right">Line ₹</TableCell>
                                                            <TableCell align="right">Status</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.items.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        No line items on this order.
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            order.items.map((item) => (
                                                                <TableRow key={item.id} hover>
                                                                    <TableCell>
                                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                                            {item.productImage ? (
                                                                                <Box
                                                                                    component="img"
                                                                                    src={item.productImage}
                                                                                    alt=""
                                                                                    sx={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        flexShrink: 0,
                                                                                        borderRadius: 1,
                                                                                        objectFit: "cover",
                                                                                        border: "1px solid",
                                                                                        borderColor: "divider",
                                                                                    }}
                                                                                />
                                                                            ) : null}
                                                                            <Box sx={{ minWidth: 0 }}>
                                                                                <Typography variant="body2" fontWeight={600}>
                                                                                    {item.name}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    ID {item.productId}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Stack>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="body2">{item.storeName}</Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {item.storeId}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="center">{item.size ?? "—"}</TableCell>
                                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                                    <TableCell align="right">{item.unitPrice}</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                                        {item.lineTotal}
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Chip
                                                                            label={item.statusLabel}
                                                                            size="small"
                                                                            sx={{ ...orderChipSx(item.status), fontWeight: 600 }}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    mt: 2,
                                                    pt: 2,
                                                    borderTop: "2px solid",
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    Order total
                                                </Typography>
                                                <Typography variant="h6" fontWeight={800} color="#00838f">
                                                    ₹{order.total}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    You have not placed any order yet.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
