"use client"

import type React from "react"
import { useState } from "react"
import { createStore } from "@/app/actions/store/action"
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { BaseButton } from "../users/buttons/BaseButton"
import { useSession } from "next-auth/react"
import {  useRouter } from "next/navigation"

const FilePreview = ({
  preview,
  fileName,
  fieldName,
  onRemove,
}: {
  preview: string | null
  fileName: string
  fieldName: string
  onRemove: () => void
}) => {
  if (!preview) return null

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {fileName}
        </Typography>
        <Button size="small" color="error" onClick={onRemove} sx={{ minWidth: "auto", p: "4px 8px" }}>
          Remove
        </Button>
      </Box>
      <Card sx={{ mt: 1, maxWidth: 300 }}>
        {preview && (
          <CardMedia
            component="img"
            height="140"
            image={preview}
            alt={`Preview of ${fieldName}`}
            sx={{ objectFit: "contain" }}
          />
        )}
      </Card>
    </Box>
  )
}

export default function CreateStoreForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileNames, setFileNames] = useState({
    logo: "",
    addressProof: "",
    identityProof: "",
    businessProof: "",
  })
  const [previewData, setPreviewData] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    mapLink: "",
    logo: null as string | null,
    addressProof: null as string | null,
    identityProof: null as string | null,
    businessProof: null as string | null,
  })
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router=useRouter()

  const { data: session, status } = useSession()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!session?.user?.id) {
      setError("Please login to create a store")
      setIsLoading(false)
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append("ownerId", session.user.id)

    try {
      const result = await createStore(formData)
      if (result.success) {
        setSuccess(true)
        form.reset()
        setFileNames({
          logo: "",
          addressProof: "",
          identityProof: "",
          businessProof: "",
        })
        setPreviewData({
          name: "",
          description: "",
          city: "",
          address: "",
          mapLink: "",
          logo: null,
          addressProof: null,
          identityProof: null,
          businessProof: null,
        })
        router.push('/merchant/storedetails')
      } else {
        setError(result.error || "Failed to create store")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPreviewData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fieldName = e.target.name

      setFileNames((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }))

      // Generate preview for all files
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewData((prev) => ({
          ...prev,
          [fieldName]: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = (fieldName: string) => {
    setFileNames((prev) => ({
      ...prev,
      [fieldName]: "",
    }))
    setPreviewData((prev) => ({
      ...prev,
      [fieldName]: null,
    }))

    // Reset the file input
    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Show loading state while checking session
  if (status === "loading") {
    return <CircularProgress />
  }

  // Redirect if not logged in
  if (status === "unauthenticated") {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Please login to create a store
        </Typography>
        <Button variant="contained" href="/auth/signin" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    )
  }


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 6 } }}>
            <Typography variant={isMobile?"subtitle1":"h6"}  sx={{ fontWeight: "bold", mb: 2 }} component="h1" gutterBottom align="center">
              Apply here to become a merchant of ecom-fort !
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Basic Details Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"} gutterBottom>
                    Basic Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Store Name"
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: "50px",
                      boxShadow: "none",
                      padding: {xs:1,sm:2},
                      color: "black",
                      backgroundColor: "white",
                      border: "1px solid black",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                      "&:active": {
                        boxShadow: "none",
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                    }}
                  >
                    {fileNames.logo || "Upload Store Logo"}
                    <input type="file" name="logo" hidden required accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {previewData.logo && (
                    <FilePreview
                      preview={previewData.logo}
                      fileName={fileNames.logo}
                      fieldName="logo"
                      onRemove={() => handleRemoveFile("logo")}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Store Description"
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Business Details Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"} gutterBottom>
                    Business Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="businessType"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    helperText="Select your business structure"
                  >
                    <option value="Individual">Individual/Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Corporation">Private Limited</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="gstNumber"
                    label="GST Number"
                    variant="outlined"
                    helperText="Optional - Enter if registered under GST"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="panNumber"
                    label="PAN Number"
                    variant="outlined"
                    helperText="Business/Personal PAN number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="businessLicense"
                    label="Business License Number"
                    variant="outlined"
                    helperText="Optional - Shop & Establishment or other license"
                  />
                </Grid>

                {/* Address Details Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"} gutterBottom>
                    Address Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    label="Street Address"
                    variant="outlined"
                    helperText="Complete street address with landmarks"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="city" label="City" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="state" label="State" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="pincode" label="Pincode" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="mapLink"
                    label="Google Maps Link"
                    variant="outlined"
                    helperText="Share your store's Google Maps location"
                  />
                </Grid>

                {/* Contact Details Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"}  gutterBottom>
                    Contact Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="Primary Phone Number"
                    variant="outlined"
                    helperText="WhatsApp enabled number for orders"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="alternatePhone"
                    label="Alternate Phone"
                    variant="outlined"
                    helperText="Optional - Secondary contact number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Business Email"
                    type="email"
                    variant="outlined"
                    helperText="Email for business communications"
                  />
                </Grid>

                {/* Bank Details Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"}  gutterBottom>
                    Bank Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="bankName" label="Bank Name" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="accountNumber" label="Account Number" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="ifscCode" label="IFSC Code" variant="outlined" />
                </Grid>

                {/* KYC Documents Section */}
                <Grid item xs={12}>
                  <Typography variant={isMobile?"subtitle1":"h6"}  gutterBottom>
                    KYC Documents
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: "50px",
                      boxShadow: "none",
                      padding: {xs:1,sm:2},
                      color: "black",
                      backgroundColor: "white",
                      border: "1px solid black",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                      "&:active": {
                        boxShadow: "none",
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                    }}
                  >
                    {fileNames.addressProof || "Upload Address Proof"}
                    <input
                      type="file"
                      name="addressProof"
                      hidden
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Utility Bill/Rent Agreement/Property Tax Receipt (Not older than 3 months)
                  </Typography>
                  {previewData.addressProof && (
                    <FilePreview
                      preview={previewData.addressProof}
                      fileName={fileNames.addressProof}
                      fieldName="addressProof"
                      onRemove={() => handleRemoveFile("addressProof")}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: "50px",
                      boxShadow: "none",
                      padding: {xs:1,sm:2},
                      color: "black",
                      backgroundColor: "white",
                      border: "1px solid black",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                      "&:active": {
                        boxShadow: "none",
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                    }}
                  >
                    {fileNames.identityProof || "Upload Identity Proof"}
                    <input
                      type="file"
                      name="identityProof"
                      hidden
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Aadhaar Card/PAN Card/Voter ID/Driving License
                  </Typography>
                  {previewData.identityProof && (
                    <FilePreview
                      preview={previewData.identityProof}
                      fileName={fileNames.identityProof}
                      fieldName="identityProof"
                      onRemove={() => handleRemoveFile("identityProof")}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: "50px",
                      boxShadow: "none",
                      padding: {xs:1,sm:2},
                      color: "black",
                      backgroundColor: "white",
                      border: "1px solid black",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                      "&:active": {
                        boxShadow: "none",
                        backgroundColor: "white",
                        borderColor: "black",
                      },
                    }}
                  >
                    {fileNames.businessProof || "Upload Business Proof"}
                    <input
                      type="file"
                      name="businessProof"
                      hidden
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    GST Certificate/Shop License/MSME Registration
                  </Typography>
                  {previewData.businessProof && (
                    <FilePreview
                      preview={previewData.businessProof}
                      fileName={fileNames.businessProof}
                      fieldName="businessProof"
                      onRemove={() => handleRemoveFile("businessProof")}
                    />
                  )}
                </Grid>
              </Grid>

              <BaseButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : "Apply"}
              </BaseButton>
            </Box>
          </Paper>
        </Grid>

        {/* Guidelines Section */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              position: "sticky",
              top: 24,
              backgroundColor: "#f8f9fa",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Application Guidelines
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                Required Documents
              </Typography>
              <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Valid ID Proof (Aadhaar/PAN/Voter ID)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Recent Address Proof (≤ 3 months old)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Business Registration Proof
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">Active Bank Account Details</Typography>
                </li>
              </ul>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                Verification Process
              </Typography>
              <Typography variant="body2" paragraph>
                • Application review: 2-3 business days
                <br />• Document verification
                <br />• Background check
                <br />• Final approval
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                Important Notes
              </Typography>
              <Typography variant="body2" paragraph>
                • All documents must be clearly readable
                <br />• File size limit: 5MB per document
                <br />• Supported formats: PDF, JPG, PNG
                <br />• Keep documents ready before starting
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email:deepakfordev@gmail.com
              </Typography>
              <Typography variant="body2">X:depak_7</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Style the file upload buttons */}
      <style jsx global>{`
        .file-upload-btn {
          transition: all 0.3s ease;
          border: 2px dashed #2196F3;
          background-color: #F8F9FA;
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
        .file-upload-btn:hover {
          border-color: #1976D2;
          background-color: #E3F2FD;
        }
      `}</style>

      {/* Update Snackbar positions */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Application created successfully! Your application is under review.
        </Alert>
      </Snackbar>
    </Container>
  )
}

