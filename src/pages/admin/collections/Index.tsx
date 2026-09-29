import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";
import { useClientPagination } from "@/hooks/useClientPagination";
import { CollectionColun } from "@/data/table-colums/collection-column";
import { PageHeader } from "@/components/shared/PageHeader";
import CollectionDrawer from "./Drawer";
import { getAdminCollections, type Collection } from "@/api/requests/collections";
// import ProductDrawerContent from "./Drawer/Index";

const ProductsPage = () => {
  const [selectedUser, setSelectedUser] = useState<Collection | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collections"],
    queryFn: getAdminCollections,
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });
  const { page, pageCount, paginatedData, handlePageChange } =
    useClientPagination<Collection>(data ?? [],8);


  if (isLoading) {
    return (
      <div>
        <SkeletonTable />
      </div>
    );
  }
  if (isError || !data) return <ErrorState />;

  const handleRowClick = (user: Collection) => {
    setSelectedUser(user);
    setOpen(true);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex mt-6 justify-between">
      <PageHeader title={"Collections"}/>
      <div>
          <button
            onClick={() => {
              setOpen(true);
              setSelectedUser(null);
            }}
            className="px-4 py-1 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={14} />
            New Collection
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <EmptyState text="You have no collection yet">
          <button
            onClick={() => {
              setOpen(true);
              setSelectedUser(null);
            }}
            className="px-4 py-1 mt-2 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Create new collection
          </button>
        </EmptyState>
      ) : (
        <div>
          <div className="flex  mt-10 justify-between items-center">
            <SearchInput
              placeholder="Filter by name"
              value={search}
              onChange={setSearch}
            />
          </div>
          {data.length === 0 ? (
            <EmptySearch text="You have no project in this search" />
          ) : (
            <div className="mt-4">
              <DataTable
                columns={CollectionColun}
                data={paginatedData}
                page={page}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                onRowClick={handleRowClick}
              />
            </div>
          )}
        </div>
      )}
        <AppDrawer
        width="w-[60%] lg:max-w-[40%]!"
        open={open}
        onOpenChange={setOpen}
      >
        <CollectionDrawer
          props={selectedUser}
          onClose={() => setOpen(false)}
          // onUpdate={handleUpdate}
        />
      </AppDrawer>
     
    </div>
  );
};
export default ProductsPage;
