import Container from "@/components/shared/inputs/Container";
import { SidebarInset, SidebarProvider } from "../../ui/sidebar";
import { AppSidebar, MobileSidebarTrigger } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
     <div className="hidden lg:flex">
     <AppSidebar />
     </div>

      <SidebarInset className="bg-[#F1F1F1]">
        <header className="flex items-center px-4 py-3 lg:hidden">
          <MobileSidebarTrigger />
        </header>

        <Container>
          <Outlet />
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
}
