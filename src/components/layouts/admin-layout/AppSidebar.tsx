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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";
import logo from "../../../assets/images/soibi.png";
import { Toaster } from "sonner";
import { LogOut, Menu } from "lucide-react";

// Normal state icons
import usersIcon from "../../../assets/images/users.svg";
import contentIcon from "../../../assets/images/content.svg";
import projectIcon from "../../../assets/images/project.svg";
import researchIcon from "../../../assets/images/research.svg";

// Active state images
import activeIcon1 from "../../../assets/images/1.svg";
import activeIcon2 from "../../../assets/images/2.svg";
import activeIcon3 from "../../../assets/images/3.svg";
import activeIcon4 from "../../../assets/images/4.svg";

import { useQuery } from "@tanstack/react-query";
import { getAdminContacts } from "@/api/requests/contact";

const navMain = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/home",
        iconNormal: usersIcon,
        iconActive: activeIcon1,
      },
      {
        title: "Home",
        url: "/customization",
        iconNormal: projectIcon,
        iconActive: activeIcon3,
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
      // {
      //   title: "Quotes",
      //   url: "/quotes",
      //   iconNormal: projectIcon,
      //   iconActive: activeIcon3,
      // },

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
        title: "Blogs",
        url: "/content-management",
        iconNormal: contentIcon,
        iconActive: activeIcon2,
      },
      // {
      //   title: "Analytics",
      //   url: "/analytics",
      //   iconNormal: contentIcon,
      //   iconActive: activeIcon2
      // },
      {
        title: "Gallery",
        url: "/gallery",
        iconNormal: contentIcon,
        iconActive: activeIcon2,
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

/* Shared hooks */
function useHasUnreadContact() {
  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
  });

  return (
    data?.some((contact: { isRead?: boolean }) => contact.isRead === false) ??
    false
  );
}

function useLogout() {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };
}

/* Mobile sidebar content (same look as the desktop sidebar) */
function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const handleLogout = useLogout();
  const hasUnreadContact = useHasUnreadContact();

  return (
    <div className="flex h-full flex-col bg-[#1A0D25]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pb-2 pt-10">
        <img src={logo} alt="logo" />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4 pt-10">
        {navMain.map((group) => (
          <div key={group.title}>
            <ul className="flex flex-col">
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
                      className={`mb-4 flex items-center gap-2 rounded-[20px] px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-[linear-gradient(135deg,#1A0D25_0%,#8B5C9E_100%)]"
                          : "hover:bg-transparent"
                      }`}
                    >
                      <img
                        src={isActive ? item.iconActive : item.iconNormal}
                        alt=""
                        className="h-4 w-4"
                      />

                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-[white]" : "text-[gray]"
                        }`}
                      >
                        {item.title}
                      </span>

                      {item.title === "User Management" && hasUnreadContact && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#DE0D0D]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-[#1A0D25] px-4 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-[20px] bg-[#1A0D25] px-3 py-2 text-sm font-medium text-[#DE0D0D] transition-colors hover:bg-[#FDECEC]"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

export function MobileSidebarTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Open menu">
          <Menu />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 border-none bg-[#1A0D25] p-0 [&>button]:text-white"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>

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

/* Desktop sidebar */
export function AppSidebar() {
  const { pathname } = useLocation();
  const handleLogout = useLogout();
  const hasUnreadContact = useHasUnreadContact();

  return (
    <Sidebar>
      <SidebarHeader className="bg-[#1A0D25] pt-10">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" />
          <div></div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#1A0D25] pt-10">
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
                        className="data-[active=true]:bg-[linear-gradient(135deg,#1A0D25_0%,#8B5C9E_100%)] hover:bg-transparent! py-2 mb-4 px-3 rounded-[20px]"
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <img
                            src={isActive ? item.iconActive : item.iconNormal}
                            alt=""
                            className="w-4 h-4"
                          />

                          <span
                            className={`text-sm font-medium ${
                              isActive ? "text-[white]" : "text-[gray]"
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

      <SidebarFooter className="bg-[#1A0D25]">
        <SidebarMenu className="bg-[#1A0D25]">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="py-2 px-3 bg-[#1A0D25] rounded-[20px] text-[#DE0D0D] hover:text-[#DE0D0D] hover:bg-[#FDECEC]"
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