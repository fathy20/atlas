import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div dir="rtl" className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col overflow-hidden">
          <header className="h-14 flex items-center border-b border-border bg-card px-6 shrink-0">
            <SidebarTrigger className="mr-4" />
            <span className="font-semibold text-foreground">لوحة التحكم - أطلس</span>
          </header>
          <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
