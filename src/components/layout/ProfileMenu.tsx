"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  LogOut,
  Settings,
  User,
  Shield,
  Sun,
  Moon,
} from "lucide-react";

export default function ProfileMenu() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 overflow-hidden"
        onClick={() => setOpen(!open)}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="text-gray-600" size={20} />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {role || "USER"}
            </p>
          </div>

          <div className="py-2">
            <MenuItem
              icon={<Settings size={16} />}
              label="Profile Settings"
              onClick={() => {
                setOpen(false);
                router.push("/settings/profile");
              }}
            />
            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
              <MenuItem
                icon={<Shield size={16} />}
                label="Admin Settings"
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/settings");
                }}
              />
            )}
            {user.email === "info@rentfax.io" && (
              <MenuItem
                icon={<Shield size={16} />}
                label="Super Admin Control Center"
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/control-center");
                }}
              />
            )}
            <MenuItem
              icon={darkMode ? <Sun size={16} /> : <Moon size={16} />}
              label={darkMode ? "Light Mode" : "Dark Mode"}
              onClick={toggleDarkMode}
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
            <MenuItem
              icon={<LogOut size={16} />}
              label="Sign Out"
              onClick={handleSignOut}
              danger
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
