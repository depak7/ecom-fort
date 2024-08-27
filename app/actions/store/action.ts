import prisma from "@/database";

interface Store {
    id: number;
    name: string;
    logo: string | null;
    location: string;
    description: string;
  }
  
 export  async function getAllStores(): Promise<Store[]> {
    try {
      const stores = await prisma.store.findMany({
        select: {
          id: true,
          name: true,
          bannerImage: true,
          city: true,
          description: true,
        },
      });
      console.log(stores)
  
      return stores.map((store) => ({
        id: store.id,
        description: store.description,
        name: store.name,
        logo: store.bannerImage,
        location: store.city,
      }));
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      return [];
    }
  }
  