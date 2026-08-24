import { getAdminCartOrders } from "@/api/cart";
import { getCollections } from "@/api/Collections";
import { getAdminAcademy, getAdminContacts } from "@/api/contact";
import { getProducts } from "@/api/products";
import { getAdminQuotes } from "@/api/quotes";
import { Badge } from "@/components/shared/Badge";
import InfoCards from "@/components/shared/cards/InfoCards";
import SectionCard from "@/components/shared/cards/SectionCards";
import type { AcademyApplication, CartOrder, ContactForm } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Layers3,
  MessageSquare,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cards = () => {
  const {
    data,
    isLoading: productLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: collection,
    isLoading: collectionLoading,
    isError: collectionError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
  } = useQuery({
    queryKey: ["admin-cart-orders"],
    queryFn: () => getAdminCartOrders(),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: quotesData,
    isLoading: quotesLoading,
    isError: quotesError,
  } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: () => getAdminQuotes(),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: contactData,
    isLoading: contactLoading,
    isError: contactError,
  } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: academyData,
    isLoading: academyLoading,
    isError: academyError,
  } = useQuery({
    queryKey: ["academy"],
    queryFn: getAdminAcademy,
    staleTime: 1000 * 60 * 5,
  });

  // Pending cart submissions
  const pendingCartCount =
    cartData?.data?.filter((item) => item.status === "submitted").length ?? 0;

  // Pending quote submissions
  const pendingQuoteCount =
    quotesData?.data?.filter((item) => item.status === "pending").length ?? 0;

  // Unread contact submissions
  const unreadContactCount =
    contactData?.data?.filter((item) => !item.isRead).length ?? 0;

  // Unread academy submissions
  const unreadAcademyCount =
    academyData?.data?.filter((item) => !item.isRead).length ?? 0;

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
        <InfoCards
          label="Products"
          value={String(data?.data?.length ?? 0)}
          sub=""
          change=""
          icon={Package}
          loading={productLoading}
        />

        <InfoCards
          label="Collections"
          value={String(collection?.data?.length ?? 0)}
          sub=""
          change=""
          icon={Layers3}
          loading={collectionLoading}
        />

        <InfoCards
          label="Cart Submissions"
          value={String(cartData?.data?.length ?? 0)}
          sub={`${pendingCartCount}`}
          change=""
          icon={ShoppingCart}
          loading={cartLoading}
          pending={pendingCartCount > 0}
        />

        <InfoCards
          label="Quote Submissions"
          value={String(quotesData?.data?.length ?? 0)}
          sub={`${pendingQuoteCount}`}
          change=""
          icon={Tags}
          loading={quotesLoading}
          pending={pendingQuoteCount > 0}
        />

        <InfoCards
          label="Contact Submissions"
          value={String(contactData?.data?.length ?? 0)}
          sub={`${unreadContactCount}`}
          change=""
          icon={MessageSquare}
          loading={contactLoading}
          pending={unreadContactCount > 0}
        />

        <InfoCards
          label="Academy Submissions"
          value={String(academyData?.data?.length ?? 0)}
          sub={`${unreadAcademyCount}`}
          change=""
          icon={GraduationCap}
          loading={academyLoading}
          pending={unreadAcademyCount > 0}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <SectionCard
          title="Recent Cart Orders"
          action={
            <Link to="/cart" className="text-xs font-semibold text-[#8B5E3C]">
              View All
            </Link>
          }
        >
          <div className="divide-y divide-[#E7E2DC]">
            {cartData?.data?.slice(0, 5).map((order: CartOrder) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1C1917]">
                    {order.orderNumber || order.id.slice(0, 8)}
                  </p>

                  <p className="mt-1 text-xs text-[#78716C]">
                    {order.customerEmail ||
                      order.customer?.name ||
                      "Guest Customer"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1C1917]">
                    ₦{order.totalSnapshot.toLocaleString()}
                  </p>

                          <Badge variant={order.status}>{order.status}</Badge>
                    
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title="Recent Contact Submissions"
          action={
            <Link to="/user" className="text-xs font-semibold text-[#8B5E3C]">
              View All
            </Link>
          }
        >
          <div className="divide-y divide-[#E7E2DC]">
            {contactData?.data?.slice(0, 5).map((contact: ContactForm) => (
              <div
                key={contact.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!contact.isRead && (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}

                    <p className="truncate text-sm font-semibold text-[#1C1917]">
                      {contact.name || "Unknown"}
                    </p>
                  </div>

                  <p className="mt-1 truncate text-xs text-[#78716C]">
                    {contact.subject || "No subject"}
                  </p>
                </div>

                <p className="ml-4 shrink-0 text-[10px] text-[#A8A29E]">
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title="Recent Academy Applications"
          action={
            <Link
              to="user?tab=Academy"
              className="text-xs font-semibold text-[#8B5E3C]"
            >
              View All
            </Link>
          }
        >
          <div className="divide-y divide-[#E7E2DC]">
            {academyData?.data
              ?.slice(0, 5)
              .map((application: AcademyApplication) => (
                <div
                  key={`${application.email}-${application.phone}`}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0 flex items-center gap-2">
                  {!application.isRead && (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                    <p className="truncate text-sm font-semibold text-[#1C1917]">
                      {application.fullName}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#78716C]">
                      {application.email}
                    </p>
                  </div>

                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-xs text-[#78716C]">
                      {application.phone}
                    </p>

                    <p className="mt-1 text-[10px] text-[#A8A29E]">
                      {application.address}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Cards;
