'use server'

import  prisma from '@/database/index'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { generateUniqueStoreId } from '@/database/uniqueID'



export async function createStore(formData: FormData) {
  try {
    const ownerId = formData.get('ownerId') as string
    
    // First verify the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!userExists) {
      return { success: false, error: 'User not authenticated or invalid user' }
    }

    // Basic Details
    const name = formData.get('name') as string
    const logo = formData.get('logo') as File
    const description = formData.get('description') as string

    // Business Details
    const businessType = formData.get('businessType') as string
    const gstNumber = formData.get('gstNumber') as string || null
    const panNumber = formData.get('panNumber') as string
    const businessLicense = formData.get('businessLicense') as string || null

    // Address Details
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const pincode = formData.get('pincode') as string
    const mapLink = formData.get('mapLink') as string

    // Contact Details
    const phoneNumber = formData.get('phoneNumber') as string
    const alternatePhone = formData.get('alternatePhone') as string || null
    const email = formData.get('email') as string

    // Bank Details
    const bankName = formData.get('bankName') as string
    const accountNumber = formData.get('accountNumber') as string
    const ifscCode = formData.get('ifscCode') as string

    // Upload files
    const { url: logoUrl } = await put(`stores/${name}-logo-${Date.now()}.${logo.type.split('/')[1]}`, logo, {
      access: 'public',
    })

    // KYC Documents
    const addressProof = formData.get('addressProof') as File
    const identityProof = formData.get('identityProof') as File
    const businessProof = formData.get('businessProof') as File

    const { url: addressProofUrl } = addressProof ? 
      await put(`stores/${name}-address-proof-${Date.now()}.${addressProof.type.split('/')[1]}`, addressProof, { access: 'public' }) : 
      { url: null }

    const { url: identityProofUrl } = identityProof ? 
      await put(`stores/${name}-identity-proof-${Date.now()}.${identityProof.type.split('/')[1]}`, identityProof, { access: 'public' }) : 
      { url: null }

    const { url: businessProofUrl } = businessProof ? 
      await put(`stores/${name}-business-proof-${Date.now()}.${businessProof.type.split('/')[1]}`, businessProof, { access: 'public' }) : 
      { url: null }

    const id = await generateUniqueStoreId();

    const store = await prisma.store.create({
      data: {
        id,
        name,
        logo: logoUrl,
        description,
        ownerId,
        
        // Business Details
        businessType,
        gstNumber,
        panNumber,
        businessLicense,
        
        // Address Details
        address,
        city,
        state,
        pincode,
        mapLink,
        
        // Contact Details
        phoneNumber,
        alternatePhone,
        email,
        
        // Bank Details
        bankName,
        accountNumber,
        ifscCode,
        
        // KYC Documents
        addressProof: addressProofUrl,
        identityProof: identityProofUrl,
        businessProof: businessProofUrl,
        
        // Default fields
        bannerImage: null,
        offerDescription: null,
        isApproved: false,
        isActive: true,
        verificationStatus: "PENDING"
      },
    })

    revalidatePath('/stores')
    return { success: true, store }
  } catch (error) {
    console.error('Failed to create store:', error)
    return { success: false, error: 'Failed to create store' }
  }
}

// actions/store/action.ts

export async function getAllStores(sortBy?: string) {
  try {
    let orderBy = {};
    if (sortBy === 'name') {
      orderBy = { name: 'asc' };
    } else if (sortBy === 'city') {
      orderBy = { city: 'asc' };
    }

    const stores = await prisma.store.findMany({
      orderBy,
      where:{
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        city: true,
        address: true,
        mapLink: true,
        ownerId: true,
        bannerImage: true,
        offerDescription: true,
        isApproved: true,
        isActive: true,
        verificationStatus: true,
      },
    })

    return { success: true, stores }
  } catch (error) {
    console.error('Failed to retrieve stores:', error)
    return { success: false, error: 'Failed to retrieve stores' }
  }
}

export async function getStoreById(storeId: string) {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        phoneNumber:true,
        city: true,
        address: true,
        mapLink: true,
        ownerId: true,
        bannerImage: true,
        offerDescription: true,
        isApproved: true,
        isActive: true,
        verificationStatus: true,
      },
    })

    if (!store) {
      return { success: false, error: 'Store not found' }
    }

    return { success: true, store }
  } catch (error) {
    console.error('Failed to retrieve store:', error)
    return { success: false, error: 'Failed to retrieve store' }
  }
}

export async function updateStore(storeId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const logo = formData.get('logo') as File | null
    const description = formData.get('description') as string
    const city = formData.get('city') as string
    const address = formData.get('address') as string
    const mapLink = formData.get('mapLink') as string
    const bannerImage = formData.get('bannerImage') as File | null
    const offerDescription = formData.get('offerDescription') as string | null

 
    let logoUrl: string | null = null
    if (logo) {
      const { url } = await put(`stores/${name}-${Date.now()}.${logo.type.split('/')[1]}`, logo, {
        access: 'public',
      })
      logoUrl = url
    }

 
    let bannerImageUrl :string | null=null
    if (bannerImage) {
      const { url } = await put(`stores/${name}-banner-${Date.now()}.${bannerImage.type.split('/')[1]}`, bannerImage, {
        access: 'public',
      })
      bannerImageUrl = url
    }

    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        description,
        city,
        address,
        mapLink,
        offerDescription,
        ...(logoUrl && { logo: logoUrl }),
        ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
      },
    })

    revalidatePath(`/stores/${storeId}`) 
    return { success: true, store }
  } catch (error) {
    console.error('Failed to update store:', error)
    return { success: false, error: 'Failed to update store' }
  }
}

export async function checkUserHasStore(userId: string) {
  try {
    const store = await prisma.store.findFirst({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name:true,
        isApproved:true,
        isActive:true,
        verificationStatus:true,
        rejectionReason:true,
      },
    })

    return { 
      success: true, 
      hasStore: !!store, 
      isApproved:store?.isApproved,
      isActive:store?.isActive,
      verificationStatus:store?.verificationStatus,
      rejectionReason:store?.rejectionReason,
      storeName:store?store.name:"",
      storeId: store ? store.id : null 
    }
  } catch (error) {
    console.error('Failed to check if user has store:', error)
    return { success: false, error: 'Failed to check if user has store' }
  }
}


export async function getStoreDetailsByStoreId(storeId:string){

  const storeDetails=await prisma.store.findUnique(
    {
      where:{
      id:storeId,
      isApproved: true,
      }
    }
  )
}