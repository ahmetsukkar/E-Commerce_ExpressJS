import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  addItemToCart: (productId: string, quantity?: number) => void;
  updateItemInCart: (productId: string, quantity: number) => void;
  removeItemInCart:(productId:string) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  removeItemInCart: () => {},
});

// Custom Hook (useCart)
export const useCart = () => useContext(CartContext);
