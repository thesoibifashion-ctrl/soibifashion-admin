import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import EmptySearch from "@/components/shared/EmptySearch";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { newsColumn, type NewsData } from "@/data/table-colums/news-column";
import { formatDate } from "@/lib/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const NewsletterPage = () => {
  const [selectedUser, setSelectedUser] = useState<NewsData | null>(null);
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
    queryKey: ["newsletter", { search }, page],
    queryFn: () =>
      apiRequestWithParams("/newsletter/subscribers?", {
        formType: "contact",
        page: page,
        ...(search.length > 0 ? { limit: 1000 } : { limit: 10 }),
      }),
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const handleRowClick = (user: NewsData) => {
    setSelectedUser(user);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mt-40">
        <SkeletonTable />
      </div>
    );
  }
  const filteredData = data.data.filter((user: NewsData) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isError || !data) return <ErrorState/>;
  if (filteredData.length < 0) {
    return <EmptyState text="You have no subscribers yet" />;
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex mt-6 justify-between">
        <p className=" text-2xl font-semibold text-[#1A1B1D]">News Letter</p>
      </div>
      {data.data.length === 0 ? (
        <EmptyState text="You have no subscribers yet">
       
        </EmptyState>
      ) : (
        <div>
          {" "}
          <div className="flex mt-10 justify-between items-center">
            <SearchInput
              placeholder="Filter by email"
              value={search}
              onChange={setSearch}
            />
          </div>
          {filteredData.length === 0 ? (
            <EmptySearch text="You have no subscribers in this search" />
          ) : (
          <div className="mt-4">
            <DataTable
              columns={newsColumn}
              data={filteredData}
              page={search.length > 0 ? 1 : page}
              pageCount={data?.pagination?.totalPages || 1}
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
          title={selectedUser?.email}
        >
          {selectedUser && (
            <div className="space-y-5 mt-12">
              <div>
                <p className="font-semibold">id:</p>
                <p>{selectedUser._id}</p>
              </div>

              <div>
                <p className="font-semibold">Email:</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="font-semibold">Subscription date:</p>
                <p>{formatDate(selectedUser.createdAt ?? "")}</p>
              </div>
            </div>
          )}
        </AppDrawer>
      </div>
    </div>
  );
};
export default NewsletterPage;
