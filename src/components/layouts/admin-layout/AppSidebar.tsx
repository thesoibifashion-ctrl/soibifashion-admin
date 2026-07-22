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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../ui/sheet";
import logo from "../../../assets/images/cephflogo.png";
import { Toaster } from "sonner";
import { LogOut, Menu } from "lucide-react";

// Normal state icons
import usersIcon from "../../../assets/images/users.svg";
import contentIcon from "../../../assets/images/content.svg";
import projectIcon from "../../../assets/images/project.svg";
import researchIcon from "../../../assets/images/research.svg";
import emailIcon from "../../../assets/images/email.svg";

// Active state images — TODO: rearrange these to match the correct item once you confirm which is which
import activeIcon1 from "../../../assets/images/1.svg";
import activeIcon2 from "../../../assets/images/2.svg";
import activeIcon3 from "../../../assets/images/3.svg";
import activeIcon4 from "../../../assets/images/4.svg";
import activeIcon5 from "../../../assets/images/5.svg";

const navMain = [
  {
    title: "Overview",
    items: [
      { title: "Users", url: "/", iconNormal: usersIcon, iconActive: activeIcon1 },
      { title: "Content Management", url: "/content-management", iconNormal: contentIcon, iconActive: activeIcon2 },
      { title: "Projects", url: "/projects", iconNormal: projectIcon, iconActive: activeIcon3 },
      { title: "Research", url: "/research", iconNormal: researchIcon, iconActive: activeIcon4 },
      { title: "Newsletter", url: "/newsletter", iconNormal: emailIcon, iconActive: activeIcon5 },
    ],
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3">
        <img className="w-14 h-14" src={logo} alt="logo" />
        <p className="font-semibold text-3xl lg:text-[38px] text-[#002E21]">
          CEPHF
        </p>
      </div>

      <div className="flex-1 pt-10 px-4">
        {navMain.map((group) => (
          <div key={group.title}>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);

                return (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 py-2 mb-3 px-3 rounded-[20px] text-sm font-medium transition-colors ${
                        isActive
                          ? "text-white [background:linear-gradient(233.89deg,#A0F88A_-3.62%,#186D0F_47.04%)]"
                          : "text-[#404944] hover:bg-gray-100"
                      }`}
                    >
                      <img
                        src={isActive ? item.iconActive : item.iconNormal}
                        alt=""
                        className="w-4 h-4"
                      />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-4 py-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 py-2 px-3 rounded-[20px] text-[#DE0D0D] hover:bg-[#FDECEC] w-full text-sm font-medium"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );
}

export function MobileSidebarTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
          <Menu size={22} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col" showCloseButton={false}>
        <NavContent onNavigate={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))} />
      </SheetContent>
    </Sheet>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="hidden lg:flex bg-[white] px-4 py-3">
      <SidebarHeader className="bg-white">
        <div className="flex items-center gap-2">
          <img className="w-14 h-14" src={logo} alt="logo" />
          <p className="font-semibold text-3xl lg:text-[38px] text-[#002E21]">
            CEPHF
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white pt-10">
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
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
                        className="data-[active=true]:[background:linear-gradient(233.89deg,#A0F88A_-3.62%,#186D0F_47.04%)] py-2 mb-4 px-3 rounded-[20px]"
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <img
                            src={isActive ? item.iconActive : item.iconNormal}
                            alt=""
                            className="w-4 h-4"
                          />
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