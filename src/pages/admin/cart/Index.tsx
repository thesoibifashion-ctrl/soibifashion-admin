import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";
import { getAdminCartOrders, updateAdminCartOrderStatus } from "@/api/requests/cart";
import { useClientPagination } from "@/hooks/useClientPagination";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import OrderDrawer from "./Drawers";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";

import type { CartOrder } from "@/types";
import { CartOrderColumns } from "@/data/table-colums/cart-column";
import { PageHeader } from "@/components/shared/PageHeader";

const SUGGESTED_STATUSES = [
  "submitted",
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const CartOrdersPage = () => {
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<CartOrder | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-cart-orders"],
    queryFn: () => getAdminCartOrders(),
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const orders = data ?? [];

  const updateOrderMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CartOrder>;
    }) => updateAdminCartOrderStatus(id, payload),
  
    onSuccess: (response) => {
      const updatedOrder = response as CartOrder;
  
      setSelectedOrder(updatedOrder);
  
      queryClient.setQueryData(
        ["admin-cart-orders"],
        (oldData: CartOrder[] | undefined) => {
          if (!oldData) return oldData;
  
          return oldData.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
        }
      );
    },
  });

  const filteredOrders = orders.filter((order: CartOrder) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchValue) ||
      order.status?.toLowerCase().includes(searchValue) ||
      order.customer?.name?.toLowerCase().includes(searchValue) ||
      order.customer?.email?.toLowerCase().includes(searchValue) ||
      order.customer?.phone?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const { page, pageCount, paginatedData, handlePageChange } =
    useClientPagination(filteredOrders, 8);

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const handleRowClick = (order: CartOrder) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleUpdate = async (updatedOrder: CartOrder) => {
    if (!updatedOrder.id) return;

    await updateOrderMutation.mutateAsync({
      id: updatedOrder.id,
      payload: {
        status: updatedOrder.status,
      },
    });
  };

  return (
    <div className="space-y-6 mt-14">
      <PageHeader title="Cart Orders"/>
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search orders..."
        />

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`h-9 px-4 rounded-xl text-xs font-medium border capitalize transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#18120E] text-white border-[#18120E]"
                : "bg-white text-[#78716C] border-[#E7E2DC] hover:border-[#8B5E3C]/40"
            }`}
          >
            All
          </button>

          {SUGGESTED_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`h-9 px-4 rounded-xl text-xs font-medium border capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-[#18120E] text-white border-[#18120E]"
                  : "bg-white text-[#78716C] border-[#E7E2DC] hover:border-[#8B5E3C]/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState text="No cart orders found." />
      ) : filteredOrders.length === 0 ? (
        <EmptySearch text="No orders match your search or selected status." />
      ) : (
        <DataTable
          columns={CartOrderColumns}
          data={paginatedData}
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}

      <AppDrawer
        width="w-[60%] lg:max-w-[40%]!"
        open={open}
        onOpenChange={setOpen}
      >
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setOpen(false)}
            onUpdate={handleUpdate}
            isLoading={updateOrderMutation.isPending}
          />
        )}
      </AppDrawer>
    </div>
  );
};

export default CartOrdersPage;