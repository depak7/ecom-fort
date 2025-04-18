'use server'

import  prisma from '@/database/index'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { generateUniqueStoreId } from '@/database/uniqueID'
import { readOnlyPrisma } from '@/database/index'


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

    const stores = await readOnlyPrisma.store.findMany({
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
    const store = await readOnlyPrisma.store.findUnique({
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

export async function updateStore(storeData: any) {
  try {
    const updatedStore = await prisma.store.update({
      where: { id: storeData.id },
      data: {
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        city: storeData.city,
        mapLink: storeData.mapLink,
      },
    });

    console.log(updateStore)

    return { success: true, store: updatedStore };
  } catch (error) {
    console.error("Failed to update store:", error);
    return { success: false, error: "Failed to update store" };
  }
}

export async function checkUserHasStore(userId: string) {
  try {
    const store = await readOnlyPrisma.store.findFirst({
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

  const storeDetails=await readOnlyPrisma.store.findUnique(
    {
      where:{
      id:storeId,
      isApproved: true,
      }
    }
  )
}

export async function getTotalProductsByStoreId(storeId: string) {
  try {
    const totalProducts = await readOnlyPrisma.product.count({
      where: { storeId: storeId },
    });

    return { success: true, totalProducts };
  } catch (error) {
    console.error("Failed to fetch total products:", error);
    return { success: false, error: "Failed to fetch total products" };
  }
}

export async function getProductsCountByCategory(storeId: string) {
  try {
    const productsByCategory = await readOnlyPrisma.product.groupBy({
      by: ['category'],
      where: { storeId: storeId },
      _count: {
        _all: true
      },
    });

    // Transform the data into a more usable format
    const categoryCounts = productsByCategory.map(item => ({
      category: item.category || 'Uncategorized',
      count: item._count._all
    }));

    return { success: true, categoryCounts };
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return { success: false, error: "Failed to fetch products by category" };
  }
}