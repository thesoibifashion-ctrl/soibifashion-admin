import { apiRequestWithParams } from "@/api/query";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import {  type Data } from "@/data/table-colums/project.column";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  ContentColumn,
  type ContentData,
} from "@/data/table-colums/content-column";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";

const NewsPage = () => {
  const [selectedUser, setSelectedUser] = useState<ContentData | null>(null);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") || 1);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", { search, type: "news" }, page],
    queryFn: () =>
      apiRequestWithParams("/posts", {
        page: page,
        type: "news",
        ...(search.length > 0 ? { limit: 1000 } : { limit: 10 }),
      }),
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  // const handleRowClick = (user: Data) => {
  //   setSelectedUser(user);
  //   setOpen(true);
  // };
  const handleRowClick = (user: ContentData) => {
    setSelectedUser(user);
    navigate(`/content-management/edit-content/news/${user._id}`);
    console.log(selectedUser)
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
    (user: Data) => user.title.toLowerCase().includes(search.toLowerCase())
    // user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto ">
      {data.data.length === 0 ? (
        <EmptyState text="You have no news yet">
          <Link
            to="/content-management/edit-content/news"
            className="px-4 py-1 mt-2 bg-[#186D0F] rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Create News
          </Link>
        </EmptyState>
      ) : (
        <div>
       
            <div>
              {" "}
              <div className="flex  mt-10 justify-between items-center">
                <SearchInput
                  placeholder="Filter by name"
                  value={search}
                  onChange={setSearch}
                />
              </div>
              {filteredData.length === 0 ? (
            <EmptySearch text="You have no news for this search" />
          ) : (
              <div className="mt-4">
                <DataTable
                  columns={ContentColumn}
                  data={filteredData}
                  page={search.length > 0 ? 1 : page}
                  pageCount={data?.pagination?.totalPages}
                  onPageChange={handlePageChange}
                  onRowClick={handleRowClick}
                />
              </div>
          )}

            </div>
        </div>
      )}
    </div>
  );
};
export default NewsPage;
