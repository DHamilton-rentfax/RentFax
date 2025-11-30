'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 1. Strong Typing for Cart Items
interface CartItem {
  type: "plan" | "addon";
  name: string;
  price?: string;
  id?: string | null;
  [key: string]: any;
}

// 2. Strong Typing for the Context API
interface PricingCartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// 3. Initialize Context with a clear undefined state
const PricingCartContext = createContext<PricingCartContextType | undefined>(undefined);

// 4. Create the Provider Component
export function PricingCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false); // ✅ Centralized state for drawer visibility

  // 5. Load from localStorage on initial mount (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pricingCart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.warn("Failed to load pricing cart from localStorage:", error);
    }
  }, []);

  // 6. Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("pricingCart", JSON.stringify(cartItems));
    } catch (error) {
      console.warn("Failed to save pricing cart to localStorage:", error);
    }
  }, [cartItems]);

  // 7. Core Cart Logic (add, remove, clear)
  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) return prev; // Prevent duplicates
      setIsOpen(true); // ✅ Automatically open drawer on new item
      return [...prev, item];
    });
  };

  const removeItem = (item: CartItem) => {
    setCartItems((prev) => prev.filter((i) => i.name !== item.name));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("pricingCart");
  };

  return (
    <PricingCartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, isOpen, setIsOpen }}>
      {children}
    </PricingCartContext.Provider>
  );
}

// 8. Custom Hook with Built-in Error Handling
export function usePricingCart() {
  const context = useContext(PricingCartContext);
  if (context === undefined) {
    throw new Error("usePricingCart must be used within a PricingCartProvider");
  }
  return context;
}
