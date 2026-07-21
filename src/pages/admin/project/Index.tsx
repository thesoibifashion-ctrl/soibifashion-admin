import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { ProjectColumn, type Data } from "@/data/table-colums/project.column";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectDrawerContent from "./Drawer";
import { PlusCircle } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";

const ProjectPage = () => {
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
    queryKey: ["project", { search }, page],
    queryFn: () =>
      apiRequestWithParams("/project", {
        page: page,
        ...(search.length === 0 && { limit: 10 }),
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
      <div className="mt-40">
        <SkeletonTable />
      </div>
    );
  }
  if (isError || !data) return <ErrorState />;
  const filteredData = data.data.filter(
    (user: Data) =>
      user.title.toLowerCase().includes(search.toLowerCase()) ||
      user.community.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex mt-6 justify-between">
        <p className=" text-2xl font-semibold text-[#1A1B1D]">Projects</p>
        <div>
          <button
            onClick={() => {
              setOpen(true);
              setSelectedUser(null);
            }}
            className="px-4 py-1 bg-[#186D0F] rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={14} />
            New project
          </button>
        </div>
      </div>
      {data.data.length === 0 ? (
        <EmptyState text="You have no project yet">
          <button
            onClick={() => {
              setOpen(true);
              setSelectedUser(null);
            }}
            className="px-4 py-1 mt-2 bg-[#186D0F] rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Create new project
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
          {filteredData.length === 0 ? (
            <EmptySearch text="You have no project in this search" />
          ) : (
            <div className="mt-4">
              <DataTable
                columns={ProjectColumn}
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
      <AppDrawer open={open} onOpenChange={setOpen} title={selectedUser?.title}>
       <ProjectDrawerContent {...selectedUser} />
      </AppDrawer>
    </div>
  );
};
export default ProjectPage;
