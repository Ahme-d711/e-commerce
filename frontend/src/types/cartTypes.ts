export interface CartProduct{
    _id: string,
    name: string,
    price: number,
    imageUrl: string
}

export interface ICartItem {
    _id: string
    product: CartProduct;
    quantity: number;
    price: number;
  }

export interface ICartF {
    _id: string;
    user: string;
    items: ICartItem[];
    totalPrice: number,
    createdAt: string,
    updatedAt: string,
    __v: number 
}
