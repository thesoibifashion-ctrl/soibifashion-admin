import { getAdminAcademy, getAdminContacts, markAcademyAsRead, markContactAsRead } from "@/api/contact";
import { apiRequestWithParams } from "@/api/query";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import EmptySearch from "@/components/shared/EmptySearch";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { academyColumn } from "@/data/table-colums/users-column";
import { formatDate } from "@/lib/utils/formatDate";
import type { ContactForm } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ContactPage = () => {
  const [selectedUser, setSelectedUser] = useState<ContactForm | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page") || 1);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["academy"],
    queryFn: getAdminAcademy,
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markAcademyAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academy"],
      });
    },
  });
  const handleRowClick = (user: ContactForm) => {
    setSelectedUser(user);
    setOpen(true);
    if (user.isRead === false) {
      markAsRead(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="">
        <SkeletonTable />
      </div>
    );
  }
  const filteredData = data.data.filter((user: ContactForm) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );
 
  if (isError || !data) return <ErrorState />;
  if (filteredData.length < 0) {
    return <EmptyState text="You have no subscribers yet" />;
  }
  return (
    <div className="container mx-auto py-10">
      {data.data.length === 0 ? (
        <EmptyState text="You have no subscribers yet"></EmptyState>
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
                columns={academyColumn}
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
  width="w-[60%] lg:max-w-[40%]!"
  open={open}
  onOpenChange={setOpen}
  title={selectedUser?.email}
>
  {selectedUser && (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
          <span className="font-serif text-lg font-semibold text-[#8B5E3C]">
            {selectedUser.email.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold text-[#1C1917] truncate">
            {selectedUser.email}
          </p>

          <p className="text-sm text-[#78716C]">
            {selectedUser.country} · {selectedUser.status}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC] space-y-2">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
          Contact
        </p>

        <p className="text-sm text-[#44403C]">
          ✉️ {selectedUser.email}
        </p>

        <p className="text-sm text-[#44403C]">
          📞 {selectedUser.phone}
        </p>

        <p className="text-sm text-[#44403C]">
          🌍 {selectedUser.country}
        </p>
      </div>

      {/* Experience */}
      <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-2">
          Experience Level
        </p>

        <p className="text-sm text-[#44403C] capitalize">
          {selectedUser.experienceLevel}
        </p>
      </div>

      {/* Status */}
      <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-2">
          Status
        </p>

        <p className="text-sm text-[#44403C] capitalize">
          {selectedUser.status}
        </p>
      </div>

      {/* Motivation */}
      <div>
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
          Motivation Statement
        </p>

        <div className="bg-[#FAFAF8] rounded-xl p-4 border border-[#E7E2DC] text-sm text-[#44403C] leading-relaxed">
          {selectedUser.motivation ?? ""}
        </div>
      </div>

      {/* Applied date */}
      <p className="text-xs text-[#A8A29E]">
        Applied{" "}
        {formatDate(selectedUser.createdAt)}
      </p>
    </div>
  )}
</AppDrawer>

      </div>
    </div>
  );
};
export default ContactPage;
