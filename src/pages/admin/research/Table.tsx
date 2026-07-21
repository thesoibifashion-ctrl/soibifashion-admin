
import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { ProjectColumn } from "@/data/table-colums/project.column";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectDrawerContent from "./Drawer";
import { PlusCircle } from "lucide-react";
import type { ResearchData } from "@/data/table-colums/research-column";

const ProjectTab = () => {
  const [selectedUser, setSelectedUser] = useState<ResearchData | null>(null);
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
    queryKey: ["posts", { search }, page],
    queryFn: () =>
      apiRequestWithParams("/posts", {
        page: page,
        ...(search.length > 0 ? { limit: 1000 } : { limit: 10 }),
      }),
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const handleRowClick = (user: ResearchData) => {
    setSelectedUser(user);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div  className="mt-40">
        <SkeletonTable />
      </div>
    );
  }
  if (isError || !data) return <div>Failed to fetch users</div>;
 
  return (
    <div className="container mx-auto py-10">
      <div>
        <p className="mt-6 text-2xl font-semibold text-[#1A1B1D]">Research</p>
        <button className="px-4 py-1 bg-[#186D0F] rounded-[20px] text-white flex items-center gap-2">
          <PlusCircle size={14} />
          New research
        </button>
      </div>
      <div className="flex justify-between items-center">
        <SearchInput
          placeholder="Filter by name"
          value={search}
          onChange={setSearch}
        />
      </div>
      <div className="mt-4">
        <DataTable
          columns={ProjectColumn}
          data={data}
          page={search.length > 0 ? 1 : page}
          pageCount={data?.pagination?.totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />

        <AppDrawer
          open={open}
          onOpenChange={setOpen}
          title={selectedUser?.title}
        >
          {selectedUser && <ProjectDrawerContent {...selectedUser} />}
        </AppDrawer>
      </div>
    </div>
  );
};
export default ProjectTab;
