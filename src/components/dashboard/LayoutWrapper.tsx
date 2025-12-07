"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
  role: "client" | "applicant" | "admin";
}

export default function LayoutWrapper({ children, role }: LayoutWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
  
  // A simple role check, in a real app this would be more robust
  if (user && user.role !== role) {
    // Redirect to a default page or show an error
    router.push("/"); 
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
