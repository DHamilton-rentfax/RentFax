import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  disableOutsideClose?: boolean;
}

const WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function Drawer({
  open,
  onClose,
  children,
  title,
  description,
  width = "lg",
  showClose = true,
  footer,
  header,
  disableOutsideClose = false,
}: DrawerProps) {
  // Scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!disableOutsideClose) onClose();
        }}
      >
        {/* DRAWER PANEL */}
        <motion.div
          className={`relative h-full w-full ${WIDTH_MAP[width]} bg-white shadow-2xl flex flex-col`}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 240, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          {(title || header) && (
            <div className="border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div>
                {header}
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {description}
                  </p>
                )}
              </div>

              {showClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>

          {/* FOOTER */}
          {footer && (
            <div className="border-t border-gray-200 px-6 py-4 bg-white sticky bottom-0">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}