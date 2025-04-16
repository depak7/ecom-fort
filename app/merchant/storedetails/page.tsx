import { Box, Typography, Paper, Container, Alert, AlertTitle } from "@mui/material";
import StoreDashboard from "@/components/merchant/storeinfo/StoreOverview";
import { checkUserHasStore, getStoreById } from "@/app/actions/store/action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductsByStoreIdForMerchant } from "@/app/actions/products/action";
import MerchantProductCard from "@/components/merchant/storeinfo/AdminProductCard";
import Image from "next/image";
import complaint from "@/components/assets/users/complaint.png"

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
            src="/unauthorized.svg" // Add an appropriate image
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
            src="/no-store.svg" // Add an appropriate image
            alt="No Store Found"
            width={300}
            height={300}
            style={{ marginBottom: '2rem' }}
          />
          <Typography variant="h5" gutterBottom>
            You haven&apos;t created a store yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start selling by creating your store
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Handle different store verification states
  if (!storeDetails.isApproved) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Image
              src={complaint}// Add an appropriate image
              alt="Verification Status"
              width={250}
              height={250}
            />
          </Box>

          {storeDetails.verificationStatus === "PENDING" && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Application Under Review</AlertTitle>
              Your store application is currently being reviewed. This process typically takes up to 2 business days.
              We&apos;ll notify you once the review is complete.
            </Alert>
          )}

          {storeDetails.verificationStatus === "REJECTED" && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Application Rejected</AlertTitle>
              Unfortunately, your store application was not approved.
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Reason for rejection:
                </Typography>
                <Typography variant="body2">
                  {storeDetails.rejectionReason || "No specific reason provided"}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                Please update your application addressing the above concerns and submit again.
              </Box>
            </Alert>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {storeDetails.storeName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Application Status: {storeDetails.verificationStatus}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  // If store is approved, show the store dashboard
  const { store } = await getStoreById(storeDetails.storeId || "");
  const { products } = await getProductsByStoreIdForMerchant(storeDetails.storeId || "");

  return (
    <Box>
      <StoreDashboard initialStoreData={store || defaultStoreData} />
      <MerchantProductCard products={products || []} />
    </Box>
  );
}
