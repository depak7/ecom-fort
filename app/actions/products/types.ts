export interface ProductResponse {
    product: {
      id: string;
      name: string;
      brand:string | null,
      description: string;
      price: any;
      storeId: string;
      productImage:string
      store: {
        name: string;
      };
      variants: Variant[];
    };
    isWishlisted?: boolean;
    userId?: string;
  }
  
  interface Variant {
    id: number;
    color: string;
    variantImage: string;
    productId: string;
    sizes: Size[];
    images: Image[];
  }
  
  interface Size {
    id: number;
    size: string;
    stock: number;
    variantId: number;
  }
  
  interface Image {
    id: number;
    url: string;
    variantId: number;
  }
  

  export interface ProductResponseforSearch {
    product: {
      id: string;
      name: string;
      description: string;
      price: any;
      storeId: string;
      store: {
        name: string;
      };
      variants: Variant[];
    };

  }