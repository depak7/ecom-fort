import { prisma } from '../database/index'; 

const generateUniqueId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6; 
  let uniqueId = '';

  do {
    uniqueId = 'E'; 
    for (let i = 0; i < length; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }


    const existingRecord = await prisma.user.findUnique({
      where: { id: uniqueId }
    });

    if (!existingRecord) {
      return uniqueId;
    }
  } while (true);
};

const generateUniqueStoreId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 10;
  let uniqueId = '';

  do {
    uniqueId = 'S'; // Start with 'S' for Store
    for (let i = 0; i < length; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingRecord = await prisma.store.findUnique({
      where: { id: uniqueId }
    });

    if (!existingRecord) {
      return uniqueId;
    }
  } while (true);
};

const generateUniqueOrderId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 10;
  let uniqueId = '';

  do {
    uniqueId = 'O'; 
    for (let i = 0; i < length; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingRecord = await prisma.order.findUnique({
      where: { id: uniqueId }
    });

    if (!existingRecord) {
      return uniqueId;
    }
  } while (true);
};

const generateUniqueProductId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 10;
  let uniqueId = '';

  do {
    uniqueId = 'P'; 
    for (let i = 0; i < length; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingRecord = await prisma.product.findUnique({
      where: { id: uniqueId }
    });

    if (!existingRecord) {
      return uniqueId;
    }
  } while (true);
};

export { generateUniqueId, generateUniqueStoreId, generateUniqueOrderId, generateUniqueProductId };
