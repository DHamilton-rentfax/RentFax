import LayoutWrapper from "@/components/dashboard/LayoutWrapper";

export default function AdminLayout({ children }) {
  return <LayoutWrapper role="admin">{children}</LayoutWrapper>;
}
