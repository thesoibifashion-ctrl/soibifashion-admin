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
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import logo from "../../../assets/images/sarah-logo.jpg";
import { Toaster } from "sonner";
import { LogOut, Menu, Settings2, SettingsIcon } from "lucide-react";

// Normal state icons
import usersIcon from "../../../assets/images/users.svg";
import contentIcon from "../../../assets/images/content.svg";
import projectIcon from "../../../assets/images/project.svg";
import researchIcon from "../../../assets/images/research.svg";
import emailIcon from "../../../assets/images/email.svg";

// Active state images
import activeIcon1 from "../../../assets/images/1.svg";
import activeIcon2 from "../../../assets/images/2.svg";
import activeIcon3 from "../../../assets/images/3.svg";
import activeIcon4 from "../../../assets/images/4.svg";
import activeIcon5 from "../../../assets/images/5.svg";

import { useQuery } from "@tanstack/react-query";
import { getAdminContacts } from "@/api/contact";

const navMain = [
  {
    title: "Overview",
    items: [
      {
        title: "Dahsboard",
        url: "/",
        iconNormal: usersIcon,
        iconActive: activeIcon1,
      },
      {
        title: "Collections",
        url: "/collections",
        iconNormal: researchIcon,
        iconActive: activeIcon4,
      },
      {
        title: "Cart",
        url: "/cart",
        iconNormal: projectIcon,
        iconActive: activeIcon3,
      },
      {
        title: "Quotes",
        url: "/quotes",
        iconNormal: projectIcon,
        iconActive: activeIcon3,
      },
      {
        title: "Products",
        url: "/products",
        iconNormal: projectIcon,
        iconActive: activeIcon3,
      },
      {
        title: "User Management",
        url: "/user",
        iconNormal: contentIcon,
        iconActive: activeIcon2,
      },
      {
        title: "Customizations",
        url: "/customizations",
        iconNormal: contentIcon,
        iconActive: activeIcon2
      },
      {
        title: "Analytics",
        url: "/analytics",
        iconNormal: contentIcon,
        iconActive: activeIcon2
      },
      {
        title: "Gallery",
        url: "/gallery",
        iconNormal: contentIcon,
        iconActive: activeIcon2
      },
     
      // {
      //   title: "Newsletter",
      //   url: "/newsletter",
      //   iconNormal: emailIcon,
      //   iconActive: activeIcon5,
      // },
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

  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
  });

  const hasUnreadContact =
    data?.data?.some(
      (contact: { isRead?: boolean }) => contact.isRead === false
    ) ?? false;

  console.log("NavContent contacts:", data);
  console.log("Has unread:", hasUnreadContact);

  return (
    <>
    <div className="flex items-center gap-2 px-4 py-3">
    <img className="w-14 h-14" src={logo} alt="logo" />
    <p className="font-semibold text-3xl lg:text-[38px] text-[#002E21]">
        SBS
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
                          ? "text-white [background:linear-gradient(233.89deg,#A0F88A_-3.62%,#C9A227_47.04%)]"
                          : "text-[#404944] hover:bg-transparent!"
                      }`}
                    >
                      <img
                        src={isActive ? item.iconActive : item.iconNormal}
                        alt=""
                        className="w-4 h-4"
                      />

                      {item.title}

                      {item.title === "User Management" &&
                        hasUnreadContact && (
                          <span className="w-2 h-2 rounded-full bg-[#DE0D0D] shrink-0" />
                        )}
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
          className="flex items-center gap-2 py-2 px-3 rounded-[20px] text-[#DE0D0D] w-full text-sm font-medium"
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
        <button>
          <Menu />
        </button>
      </SheetTrigger>

      <SheetContent side="left">
        <NavContent
          onNavigate={() =>
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape" })
            )
          }
        />
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

  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
  });

  const hasUnreadContact =
    data?.data?.some(
      (contact: { isRead?: boolean }) => contact.isRead === false
    ) ?? false;

  console.log("AppSidebar contacts:", data);
  console.log("AppSidebar has unread:", hasUnreadContact);

  return (
    <Sidebar>
    <SidebarHeader className="bg-[#18120E] pt-10">
    <div className="flex items-center gap-2">
      <img className="w-10 h-10 rounded-full" src={logo} alt="logo" />
     <div>
     <p className="font-semibold font-display text-3xl lg:text-[16px] text-gold">
        SIGNATURE
      </p>
      <p className="font-semibold text-3xl lg:text-sm font-display text-white">
        by Sarah
      </p>
     </div>
    </div>
  </SidebarHeader>
      <SidebarContent className="bg-[#18120E] pt-10">
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
                        className="data-[active=true]:bg-[linear-gradient(135deg,#A67C00_0%,#18120E_100%)] hover:bg-transparent! py-2 mb-4 px-3 rounded-[20px]"
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={
                              isActive
                                ? item.iconActive
                                : item.iconNormal
                            }
                            alt=""
                            className="w-4 h-4"
                          />

                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-[white]"
                                : "text-[gray]"
                            }`}
                          >
                            {item.title}
                          </span>

                          {item.title === "User Management" &&
                            hasUnreadContact && (
                              <span className="w-2 h-2 rounded-full bg-[#DE0D0D] shrink-0" />
                            )}
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
                "!bg-[#EAF7E9] !border !border-[#C9A22733] !text-[black]",
              error:
                "!bg-[#FDECEC] !border !border-[#DE0D0D33] !text-[#DE0D0D]",
            },
            style: { zIndex: 9999 },
          }}
          style={{ zIndex: 9999 } as React.CSSProperties}
        />
      </SidebarContent>

      <SidebarFooter className="bg-[#18120E]">
        <SidebarMenu className="bg-[#18120E]">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="py-2 px-3 bg-[#18120E] rounded-[20px] text-[#DE0D0D] hover:text-[#DE0D0D] hover:bg-[#FDECEC]"
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