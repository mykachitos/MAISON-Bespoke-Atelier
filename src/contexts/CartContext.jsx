import { createContext, useContext, useEffect, useState } from "react";
import { getStorage, setStorage } from "../utils/storage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => getStorage("maison_cart", []));

  useEffect(() => {
    setStorage("maison_cart", cart);
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => [
      ...prev,
      {
        ...item,
        cartId: Date.now() + Math.random(),
        quantity: item.quantity || 1,
      },
    ]);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}