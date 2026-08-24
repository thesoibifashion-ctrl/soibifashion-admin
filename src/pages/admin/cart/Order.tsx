import ErrorState from "@/components/shared/ErrorState";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import OrderDrawer from "./Drawer";
import type { CartOrder } from "@/types";
import { getAdminCartOrderById } from "@/api/cart";
import CartOrderDrawer from "./Drawer";

const CartOrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-cart-order", id],
    queryFn: () => getAdminCartOrderById(id!),
    enabled: !!id,
  });

  const order: CartOrder | null = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E7E2DC] border-t-[#8B5E3C] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#78716C]">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <ErrorState text="Order could not be found." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <CartOrderDrawer
        order={order}
        onClose={() => navigate("/admin/cart-orders")}
        onUpdate={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CartOrderDetailsPage;