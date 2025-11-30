'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { usePricingCart } from "@/context/PricingCartContext";
import { Button } from "@/components/ui/button";

export default function PricingCartDrawer() {
  // ✅ Destructure with a default value for cartItems to prevent pre-hydration issues
  const { cartItems = [], removeItem, clearCart, isOpen, setIsOpen } = usePricingCart();

  // Calculate subtotal safely
  const subtotal = cartItems.reduce((acc, item) => {
    const value = parseFloat(item.price?.replace(/[^0-9.]/g, "")) || 0;
    return acc + value;
  }, 0);

  // Handle checkout via Stripe
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe checkout URL not found.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <>
      {/* Floating Cart Icon - Triggers the context state */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 text-white rounded-full shadow-lg cursor-pointer p-4 hover:bg-emerald-700"
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)} // ✅ Use context setter
      >
        <ShoppingCart size={22} />
      </motion.div>

      {/* Side Drawer controlled by context state */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsOpen(false)} // ✅ Use context setter
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white w-full sm:w-[400px] h-full shadow-xl overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart size={20} /> Your Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)} // ✅ Use context setter
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 flex-grow">
                {cartItems.length === 0 ? (
                  <p className="text-gray-600 text-sm">Your cart is empty.</p>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="space-y-4 flex-grow">
                      {cartItems.map((item, idx) => (
                        <div
                          key={`${item.name}-${idx}`}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto border-t pt-4">
                        <div className="flex justify-between items-center font-semibold mb-4">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout <ArrowRight className="ml-2" size={16} />
                      </Button>

                      <button
                        onClick={clearCart}
                        className="text-sm text-gray-500 mt-3 w-full text-center hover:underline"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
