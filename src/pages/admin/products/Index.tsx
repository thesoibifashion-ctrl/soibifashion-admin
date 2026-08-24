import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";
import { getProducts } from "@/api/products";
import { useClientPagination } from "@/hooks/useClientPagination";
import type { Product } from "@/types";
import { ProductColumn } from "@/data/table-colums/product-column";
import { PageHeader } from "@/components/shared/PageHeader";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const products = data?.data ?? [];

  const filteredProducts = products.filter((product: Product) => {
    if (!search.trim()) return true;

    const searchValue = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(searchValue) ||
      product.category?.toLowerCase().includes(searchValue) ||
      product.status?.toLowerCase().includes(searchValue)
    );
  });

  const { page, pageCount, paginatedData, handlePageChange } =
    useClientPagination(filteredProducts, 8);

  const handleRowClick = (product: Product) => {
    navigate(`/products-details/${product.id}`);
  };

  if (isLoading) {
    return <div><SkeletonTable /></div>;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!data) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-6 mt-10">
      <PageHeader title="Products" />

      <div className="flex items-center justify-between">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search products..."
        />

        <button
          onClick={() => navigate("/products-details")}
          className="px-4 py-1 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
        >
          <PlusCircle size={18} />
          New Product
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState text={""}        >
          <button
            onClick={() => navigate("/products/new")}
            className="px-4 py-1 mt-2 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Create New Product
          </button>
        </EmptyState>
      ) : filteredProducts.length === 0 ? (
        <EmptySearch text={""} />
      ) : (
        <DataTable
          columns={ProductColumn as any}
          data={paginatedData}
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default ProductsPage;