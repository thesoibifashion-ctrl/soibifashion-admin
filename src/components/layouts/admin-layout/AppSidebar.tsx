import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  Sidebar,
} from "../../ui/sidebar";
import logo from "../../../assets/images/cephflogo.png";
import { Toaster } from "sonner";
import { LogOut } from "lucide-react";

const navMain = [
  {
    title: "Overview",
    items: [
      { title: "Users", url: "/" },
      { title: "Content Management", url: "/content-management" },
      { title: "Projects", url: "/projects" },
      { title: "Research", url: "/research" },
      { title: "Newsletter", url: "/newsletter" },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="bg-white px-4 py-3">
      <SidebarHeader className="bg-white">
        <div className="flex items-center gap-2">
          <img className="w-14 h-14" src={logo} alt="logo" />
          <p className="font-semibold text-3xl lg:text-[38px] text-[#002E21]">
            CEPHF
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white  pt-10">
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            {/* <SidebarGroupLabel>{group.title}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="data-[active=true]:[background:linear-gradient(233.89deg,#A0F88A_-3.62%,#186D0F_47.04%)] py-2 mb-3 px-3 rounded-[20px]"
                      >
                        <Link to={item.url}>
                          <span
                            className={`text-sm font-medium ${
                              isActive ? "text-[white]" : "text-[#404944]"
                            }`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              success:
                "!bg-[#EAF7E9] !border !border-[#186D0F33] !text-[#186D0F]",
              error:
                "!bg-[#FDECEC] !border !border-[#DE0D0D33] !text-[#DE0D0D]",
                
            },
            style: { zIndex: 9999 },

          }}
          style={{ zIndex: 9999 } as React.CSSProperties}

        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="py-2 px-3 rounded-[20px] text-[#DE0D0D] hover:text-[#DE0D0D] hover:bg-[#FDECEC]"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}