import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { useAuth } from "../Auth/AuthContext";
import { BASE_URL } from "../../constants/baseUrl";
import type { Product } from "../../types/Product";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to fetch user card. Please try again");
        return;
      }

      const cart = await response.json();

      const cartItemsMapped = cart.items.map(
        ({ product, quantity }: { product: Product; quantity: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice: product.price,
        })
      );

      setCartItems(cartItemsMapped);
    };

    fetchCart();
  }, [token]);

  const addItemToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        setError("Failed to add to cart");
        return;
      }

      const cart = await response.json();

      if (!cart) {
        setError("Failed to parse cart data");
        return;
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity }: { product: Product; quantity: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice: product.price,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
