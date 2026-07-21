import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import EmptySearch from "@/components/shared/EmptySearch";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { contactColumn, type Data } from "@/data/table-colums/users-column";
import type { UserType } from "@/types/submissions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ContaactPage = () => {
  const [selectedUser, setSelectedUser] = useState<Data | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", { search }, page],
    queryFn: () =>
      apiRequestWithParams("/submissions", {
        formType: "contact",
        page: page,
        ...(search.length > 0 ? { limit: 1000 } : { limit: 10 }),
      }),
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
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
  const filteredData = data.data.filter(
    (user: UserType) =>
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="container mx-auto py-10">
      {data.data.length === 0 ? (
        <EmptyState text="No contacts made yet" />
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <SearchInput
              placeholder="Filter by name"
              value={search}
              onChange={setSearch}
            />
          </div>
          {filteredData.length === 0 ? (
            <EmptySearch text="No contact with this search"></EmptySearch>
          ) : (
            <div className="mt-4">
              <DataTable
                columns={contactColumn}
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
                <p className="font-semibold">Message:</p>
                <p>{selectedUser.message}</p>
              </div>
            </div>
          )}
        </AppDrawer>
      </div>
    </div>
  );
};
export default ContaactPage;
