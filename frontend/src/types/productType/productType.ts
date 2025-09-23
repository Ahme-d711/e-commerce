export interface Product {
    _id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    countInStock: number;
    imageUrl?: string;
    imagePublicId?: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export interface ProductResponse {
    success: boolean;
    total: number;
    results: number;
    data: Product[];
  };

  export interface ProductRequest {
    name: string,
    description?: string,
    price: number,
    category: string,
    countInStock: number,
    image: File, 
  }
  