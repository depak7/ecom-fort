import { Box, Typography, Paper, Container, Button, Card, CardContent, Avatar, Divider, Chip } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StoreDashboard from "@/components/merchant/storeinfo/StoreOverview";
import { checkUserHasStore, getStoreById, getTotalProductsByStoreId, getProductsCountByCategory, getStoreSalesData } from "@/app/actions/store/action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductsByStoreIdForMerchant } from "@/app/actions/products/action";
import MerchantProductCard from "@/components/merchant/storeinfo/AdminProductCard";
import Image from "next/image";
import { getGroupedOrdersByStore } from "@/app/actions/order/action";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link'
import oops from '@/components/assets/users/oops.jpg'
import unauthorized from '@/components/assets/users/unauthorized.jpg'

interface Store {
  address: string;
  id: string;
  name: string;
  logo: string;
  bannerImage: string | null;
  description: string;
  offerDescription: string | null;
  city: string;
  mapLink: string;
  ownerId: string;
}

interface StatsData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
}

const defaultStoreData: Store = {
  address: "",
  id: "",
  name: "",
  logo: "",
  bannerImage: null,
  description: "",
  offerDescription: null,
  city: "",
  mapLink: "",
  ownerId: "",
};


export default async function StorePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;


  if (!userId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Image
            src={unauthorized} // Add an appropriate image
            alt="Unauthorized"
            width={300}
            height={300}
            style={{ marginBottom: '2rem' }}
          />
          <Typography variant="h5" gutterBottom>
            Please login to access your store dashboard
          </Typography>
        </Paper>
      </Container>
    );
  }

  const storeDetails = await checkUserHasStore(userId);

  if (!storeDetails.hasStore) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Image
            src={oops} // Add an appropriate image
            alt="No Store Found"
            width={300}
            height={300}
            style={{ marginBottom: '2rem' }}
          />
            <Typography variant="h5" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We couldn&apos;t load your store data. Please try again.
        </Typography>
        </Paper>
      </Container>
    );
  }

  // Handle different store verification states
  if (!storeDetails.isApproved) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Status Icon/Image */}
            <Box
              sx={{
                mb: 4,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.05)',
                  filter: 'blur(5px)'
                }
              }}
            >
            </Box>

            {/* Store Name with Badge */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2196F3, #3f51b5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {storeDetails.storeName}
              </Typography>
              <Chip
                label={storeDetails.verificationStatus}
                color={storeDetails.verificationStatus === "PENDING" ? "primary" : "error"}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {/* Status Cards */}
            {storeDetails.verificationStatus === "PENDING" && (
              <Card
                variant="outlined"
                sx={{
                  mb: 4,
                  width: '100%',
                  borderLeft: '4px solid #2196F3',
                  borderRadius: 2,
                  overflow: 'visible',
                  position: 'relative'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ position: 'absolute', top: -20, left: 20, bgcolor: 'background.paper', p: 1, borderRadius: '50%' }}>
                    <Avatar sx={{ bgcolor: '#bbdefb' }}>
                      <HourglassEmptyIcon color="primary" />
                    </Avatar>
                  </Box>
                  <Box sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                      Application Under Review
                    </Typography>
                    <Typography variant="body1">
                      Your store application is currently being reviewed. This process typically takes up to 2 business days.
                      We&apos;ll notify you once the review is complete.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {storeDetails.verificationStatus === "REJECTED" && (
              <Card
                variant="outlined"
                sx={{
                  mb: 4,
                  width: '100%',
                  borderLeft: '4px solid #f44336',
                  borderRadius: 2,
                  overflow: 'visible',
                  position: 'relative'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ position: 'absolute', top: -20, left: 20, bgcolor: 'background.paper', p: 1, borderRadius: '50%' }}>
                    <Avatar sx={{ bgcolor: '#ffcdd2' }}>
                      <ErrorOutlineIcon color="error" />
                    </Avatar>
                  </Box>
                  <Box sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 600 }}>
                      Application Rejected
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Unfortunately, your store application was not approved.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Reason for rejection:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(244, 67, 54, 0.05)',
                        borderColor: 'rgba(244, 67, 54, 0.2)',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2">
                        {storeDetails.rejectionReason || "No specific reason provided"}
                      </Typography>
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1">
                        Please update your application addressing the above concerns and submit again.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
            {storeDetails.verificationStatus === "REJECTED" &&
              <Link href="/merchant/addstore" passHref>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<EditIcon />}
                  sx={{
                    mt: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Update Application
                </Button>
              </Link>
            }
          </Box>
        </Paper>
      </Container>
    );
  }

  if (storeDetails.isApproved) {
    const storeId = storeDetails.storeId;

    const [store, totalProducts, categoryCounts, ordersData, productsData] = await Promise.all([
      getStoreById(storeId),
      getTotalProductsByStoreId(storeId),
      getProductsCountByCategory(storeId),
      getGroupedOrdersByStore(storeId),
      getProductsByStoreIdForMerchant(storeId),
    ]);

    const totalRevenue = ordersData.success
      ? ordersData.orders?.reduce((acc: number, order: any) => {
        if (order.status === 'DELIVERED') {
          const orderTotal = order.items.reduce(
            (sum: number, item: any) => sum + Number(item.price) * item.quantity,
            0
          );
          return acc + orderTotal;
        }
        return acc;
      }, 0)
      : 0;

    const totalOrders = ordersData.success ? ordersData.orders?.length : 0;

    const uniqueCustomerIds = new Set(
      ordersData.success ? ordersData.orders?.map((order: any) => order.user.id) : []
    );
    const statsData:StatsData = {
      totalProducts: totalProducts.success ? totalProducts.totalProducts : 0,
      totalOrders: totalOrders ?? 0,
      totalRevenue:totalRevenue ?? 0,
      totalCustomers: new Set( uniqueCustomerIds ).size,
    };

    const salesData=await getStoreSalesData(storeId || "")

    return (
      <>
      <StoreDashboard
        initialStoreData={store.success ? store.store : defaultStoreData}
        stats={statsData}
        categoryClassification={categoryCounts.success ? categoryCounts.categoryCounts || [] : []}
        orders={ordersData.success ? ordersData.orders : []}
        salesData={salesData.salesData}
      />
      <MerchantProductCard products={productsData.success?productsData.products:[]}/>
      </>
      
    );
  }
}
