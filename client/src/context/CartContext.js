import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );
  const [shippingFee, setShippingFee] = useState(120); // Default
  const [loading, setLoading] = useState(true);

  // Fetch shipping fee from settings API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5001/api/admin/settings');
        setShippingFee(data.shippingFee);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Use default shipping fee on error
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const updateQuantity = (id, qty) => {
    const quantity = Number(qty);
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, qty: quantity } : x))
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const totalPrice = itemsPrice + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsPrice,
        shippingFee,
        totalPrice,
        loadingSettings: loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};