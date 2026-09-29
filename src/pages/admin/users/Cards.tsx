import { getAdminCartOrders } from "@/api/requests/cart";
import {  getAdminContacts } from "@/api/requests/contact";
import { Badge } from "@/components/shared/Badge";
import InfoCards from "@/components/shared/cards/InfoCards";
import SectionCard from "@/components/shared/cards/SectionCards";
import type { CartOrder, ContactForm } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Layers3,
  MessageSquare,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAdminCollections } from "@/api/requests/collections";
import { getProducts } from "@/api/requests/products";

const Cards = () => {
  const {
    data,
    isLoading: productLoading,
    // error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: collection,
    isLoading: collectionLoading,
    // isError: collectionError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: getAdminCollections,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: cartData,
    isLoading: cartLoading,
    // isError: cartError,
  } = useQuery({
    queryKey: ["admin-cart-orders"],
    queryFn: () => getAdminCartOrders(),
    staleTime: 1000 * 60 * 5,
  });


  const {
    data: contactData,
    isLoading: contactLoading,
    // isError: contactError,
  } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
  });

  // Pending cart submissions
  const pendingCartCount =
    cartData?.filter((item) => item.status === "submitted").length ?? 0;

  // Pending quote submissions

  // Unread contact submissions
  const unreadContactCount =
    contactData?.filter((item) => !item.isRead).length ?? 0;

  // Unread academy submissions
  // const unreadAcademyCount =
  //   academyData?.filter((item) => !item.isRead).length ?? 0;

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <InfoCards
          label="Products"
          value={String(data?.length ?? 0)}
          sub=""
          change=""
          icon={Package}
          loading={productLoading}
        />

        <InfoCards
          label="Collections"
          value={String(collection?.length ?? 0)}
          sub=""
          change=""
          icon={Layers3}
          loading={collectionLoading}
        />

        <InfoCards
          label="Cart Submissions"
          value={String(cartData?.length ?? 0)}
          sub={`${pendingCartCount}`}
          change=""
          icon={ShoppingCart}
          loading={cartLoading}
          pending={pendingCartCount > 0}
        />

        <InfoCards
          label="Contact Submissions"
          value={String(contactData?.length ?? 0)}
          sub={`${unreadContactCount}`}
          change=""
          icon={MessageSquare}
          loading={contactLoading}
          pending={unreadContactCount > 0}
        />

    
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SectionCard
          title="Recent Cart Orders"
          action={
            <Link to="/cart" className="text-xs font-semibold text-[#8B5E3C]">
              View All
            </Link>
          }
        >
          <div className="divide-y divide-[#E7E2DC]">
            {cartData?.slice(0, 5).map((order: CartOrder) => (
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
            {contactData?.slice(0, 5).map((contact: ContactForm) => (
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
  
      </div>
    </div>
  );
};

export default Cards;
