import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import {
  donateColumn,
  type Data,
} from "@/data/table-colums/users-column";
import type { UserType } from "@/types/submissions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TotalDonationsCard from "./DonateCards";
import { useDebounce } from "@/hooks/useDebounce";
import EmptySearch from "@/components/shared/EmptySearch";

const DonatePage = () => {
  const [selectedUser, setSelectedUser] = useState<Data | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const debounceSearch = useDebounce(search, 400);
  const page = Number(searchParams.get("page") || 1);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", { debounceSearch }, page],
    queryFn: () =>
      apiRequestWithParams("/submissions", {
        formType: "donate",
        page: page,
        ...(debounceSearch.length > 0 ? { limit: 1000 } : { limit: 10 }),
      }),
    placeholderData:
      debounceSearch.length > 0 ? (previousData) => previousData : undefined,
  });

  const handleRowClick = (user: Data) => {
    setSelectedUser(user);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mt-10">
        <SkeletonTable />
      </div>
    );
  }

  if (isError || !data) return <ErrorState />;
  if (isLoading) return <SkeletonTable />;

  const filteredData = data.data.filter(
    (user: UserType) =>
      user.fullname.toLowerCase().includes(debounceSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debounceSearch.toLowerCase())
  );
  return (
    <div className="container mx-auto py-10">
      {data.data.length === 0 ? (
        <EmptyState text="You have no donations yet"></EmptyState>
      ) : (
        <div>
          <TotalDonationsCard donations={data.data} />
          <div className="flex mt-10 justify-between items-center">
            <SearchInput
              placeholder="Filter by name"
              value={search}
              onChange={setSearch}
            />
          </div>
          {filteredData.length === 0 ? (
            <EmptySearch text="You have no donations for this search"></EmptySearch>
          ) : (
            <div className="mt-4">
              <DataTable
                columns={donateColumn}
                data={filteredData}
                page={search.length > 0 ? 1 : page}
                pageCount={data?.pagination?.totalPages}
                onPageChange={handlePageChange}
                onRowClick={handleRowClick}
              />
            </div>
          )}
        </div>
      )}
      <div>
        <AppDrawer
          open={open}
          onOpenChange={setOpen}
          title={selectedUser?.title}
        >
          {selectedUser && (
            <div className="space-y-5 mt-12">
              <div>
                <p className="font-semibold">Title:</p>
                <p>{selectedUser.title}</p>
              </div>
              <div>
                <p className="font-semibold">Name:</p>
                <p>{selectedUser.fullname}</p>
              </div>

              <div>
                <p className="font-semibold">Email:</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone number:</p>
                <p>{selectedUser.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Amount:</p>
                <p>{selectedUser.position}</p>
              </div>
              <div>
                <p className="font-semibold">Message:</p>
                <p>{selectedUser.message}</p>
              </div>
              {selectedUser.receipt && (
                <div>
                  <p className="font-semibold">Receipt:</p>
                  {selectedUser.receipt.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={selectedUser.receipt}
                      className="w-full h-96 mt-2 rounded-lg border border-gray-200"
                      title="Receipt PDF"
                    />
                  ) : (
                    <img
                      src={selectedUser.receipt}
                      alt="Receipt"
                      className="w-full max-w-sm mt-2 rounded-lg border border-gray-200 object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </AppDrawer>
      </div>
    </div>
  );
};
export default DonatePage;
