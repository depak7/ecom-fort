'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import { BaseButton } from '@/components/users/buttons/BaseButton'
import { updateStore, getTotalProductsByStoreId } from "@/app/actions/store/action"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import {  AddToPhotosRounded } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface StoreData {
  name: string
  address: string
  id: string
  description: string
  city: string
  mapLink: string
  logo: string
  bannerImage: string | null
  offerDescription: string | null
  ownerId: string
}

interface StatsData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
}

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 7000 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 8000 },
];

const categoryData = [
  { name: 'Shirts', value: 35 },
  { name: 'T-Shirts', value: 25 },
  { name: 'Trousers', value: 20 },
  { name: 'Shoes', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function StoreOverview({ initialStoreData }: { initialStoreData: StoreData }) {
  const [storeData, setStoreData] = useState<StoreData>(initialStoreData)
  const [statsData, setStatsData] = useState<StatsData>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState<StoreData>(initialStoreData)
  const [tabValue, setTabValue] = useState(0)
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const router=useRouter();
  const handleAddProduct=()=>{
    router.push('/merchant/addproduct')
  }

  useEffect(() => {
    const fetchTotalProducts = async () => {
      setIsLoading(true)
      try {
        const result = await getTotalProductsByStoreId(storeData.id)
        if (result.success) {
          setStatsData(prevStats => ({
            ...prevStats,
            totalProducts: result.totalProducts || 0
          }))
        } else {
          setError(result.error || "")
        }
      } catch (err) {
        setError("Failed to fetch product data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTotalProducts()

    setStatsData({
      totalProducts: 24,
      totalOrders: 128,
      totalRevenue: 5840,
      totalCustomers: 67
    })
  }, [storeData.id])

  const handleEditDialogOpen = () => {
    setEditedData(storeData)
    setIsEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData(prev => ({ ...prev, [name]: value }))
  }

  const handleStoreInfoUpdate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateStore(editedData)
      if (result.success) {
        setStoreData(editedData)
        setSuccess(true)
        handleEditDialogClose()
      } else {
        setError(result.error || 'An error occurred while updating the store')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderTop: `4px solid ${color}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {title === 'Revenue' ? `₹${value}` : value}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container  sx={{ py: 2 }}>
      {/* Store Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0, 
          mb: 4, 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ 
          position: 'initial', 
          width: '100%',
          height: isMobile ? '160px' : '200px',
          backgroundImage: `url(${storeData.bannerImage || '/placeholder.svg?height=200&width=1200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          alignContent:"center"
        }}>
          <Box display={'flex'} alignContent={'center'}> 
              <Avatar 
              src={storeData.logo} 
              alt={storeData.name}
              sx={{ 
                width: isMobile ? 70 : 100, 
                height: isMobile ? 70 : 100,
                border: '4px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                ml:2,
              }}
            />
          
              <Box sx={{ ml: 2,mt:3 }}>
                <Typography variant={isMobile?"body2":"h6"} sx={{ fontWeight: 'bold' }}>
                {storeData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {storeData.city}
              </Typography>
              </Box>
              </Box>
        </Box>
        
        <Box sx={{ px: 2, pb: 2 }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" fontWeight={700}  gutterBottom>
                Store Description
              </Typography>
              <Typography color="text.secondary" variant="body2" paragraph>
                {storeData.description || "No description provided. Click 'Edit Store' to add a description and help customers learn more about your business."}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<LocationOnIcon fontSize="small" />} 
                  label={`${storeData.address}`} 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  icon={<LinkIcon fontSize="small" />} 
                  label="View on Map" 
                  variant="outlined"
                  size="small"
                  component="a"
                  href={storeData.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  clickable
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gap: 1,
                mt: { xs: 2, md: 0 }
              }}>
                    <BaseButton
                  startIcon={<AddToPhotosRounded />}
                  onClick={handleAddProduct}
                  customSize='small'
                  variant="contained"
                >
                  Add Product
                </BaseButton>
                <BaseButton
                  startIcon={<EditIcon />}
                  onClick={handleEditDialogOpen}
                  customSize='small'
                >
                  Edit Store
                </BaseButton>
            
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<InventoryIcon />} 
            title="Products" 
            value={statsData.totalProducts} 
            color="#1976d2" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<ShoppingCartIcon />} 
            title="Orders" 
            value={statsData.totalOrders} 
            color="#2e7d32" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<TrendingUpIcon />} 
            title="Revenue" 
            value={statsData.totalRevenue} 
            color="#ed6c02" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PeopleIcon />} 
            title="Customers" 
            value={statsData.totalCustomers} 
            color="#9c27b0" 
          />
        </Grid>
      </Grid>

      {/* Tab Panel */} 

      {!isMobile && ( 
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Sales Overview" />
          <Tab label="Product Categories" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Sales Overview Tab */}
          {tabValue === 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>Monthly Sales Performance</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            
            </>
          )}
          
          {/* Product Categories Tab */}
          {tabValue === 1 && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>Product Categories Distribution</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
          
        </Box>
      </Paper>
      )}

      {/* Recent Activity Section */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
        <Box sx={{ 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderRadius: 1, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px'
        }}>
          <Typography variant="body1" color="text.secondary">
            No recent activity to display
          </Typography>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Store Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update your store details to attract more customers.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Store Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editedData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={editedData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                type="text"
                fullWidth
                variant="outlined"
                value={editedData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={editedData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="mapLink"
                label="Map Link"
                type="url"
                fullWidth
                variant="outlined"
                value={editedData.mapLink}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="offerDescription"
                label="Special Offers (Optional)"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={editedData.offerDescription || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleStoreInfoUpdate} 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Store information updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  )
}