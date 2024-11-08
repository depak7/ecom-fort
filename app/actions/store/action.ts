'use server'

import { prisma } from '@/database/index'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { generateUniqueStoreId } from '@/database/uniqueID'



export async function createStore(formData: FormData) {
  try {
    console.log(formData)
    const name = formData.get('name') as string
    const logo = formData.get('logo') as File
    const description = formData.get('description') as string
    const city = formData.get('city') as string
    const address = formData.get('address') as string
    const mapLink = formData.get('mapLink') as string
    const ownerId = formData.get('ownerId') as string

   
    const { url } = await put(`stores/${name}-${Date.now()}.${logo.type.split('/')[1]}`, logo, {
      access: 'public',
    })
    console.log(url)

    const id=await generateUniqueStoreId();

    const store = await prisma.store.create({
      data: {
        id,
        name,
        logo: url, 
        description,
        city,
        address,
        mapLink,
        ownerId,
        bannerImage: null,
        offerDescription: null,
      },
    })

    revalidatePath('/stores')
    return { success: true, store }
  } catch (error) {
    console.error('Failed to create store:', error)
    return { success: false, error: 'Failed to create store' }
  }
}


export async function getAllStores() {
  try {
    const stores = await prisma.store.findMany({
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

 
    let logoUrl = null
    if (logo) {
      const { url } = await put(`stores/${name}-${Date.now()}.${logo.type.split('/')[1]}`, logo, {
        access: 'public',
      })
      logoUrl = url
    }

 
    let bannerImageUrl = null
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
        name:true
      },
    })

    return { 
      success: true, 
      hasStore: !!store, 
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
      id:storeId
      }
    }
  )
}