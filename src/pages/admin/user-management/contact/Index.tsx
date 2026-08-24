import {
  getAdminContacts,
  markContactAsRead,
} from "@/api/contact";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import type { ContactForm } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Clock, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const ContactPage = () => {
  const [selectedUser, setSelectedUser] = useState<ContactForm | null>(null);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact"],
    queryFn: getAdminContacts,
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markContactAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      });
    },
  });

  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((user: ContactForm) =>
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const unread =
    data?.data?.filter(
      (user: ContactForm) => user.isRead === false
    ).length ?? 0;

  const handleSelect = (user: ContactForm) => {
    setSelectedUser(user);

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

  if (isError || !data) {
    return <ErrorState />;
  }

  return (
    <div className="my-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Contact Messages
        </h1>

        <p className="text-sm text-[#78716C] mt-1">
          {unread} unread message{unread !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* List panel */}
        <div className="w-[360px] shrink-0 bg-white rounded-2xl border border-[#E7E2DC] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E7E2DC]">
            <SearchInput
              placeholder="Search messages..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F5F0EB]">
            {filteredData.length === 0 ? (
              <div className="py-12">
                <EmptyState text="No messages" />
              </div>
            ) : (
              filteredData.map((user: ContactForm) => {
                const isUnread = user.isRead === false;
                const isSelected = selectedUser?.id === user.id;

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 hover:bg-[#FAFAF8] transition-colors cursor-pointer",
                      isSelected &&
                        "bg-[#FFF8F3] border-r-2 border-r-[#8B5E3C]"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {!isUnread && (
                        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" />
                      )}

                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#8B5E3C] shrink-0 mt-1.5" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm truncate",
                              isUnread
                                ? "font-semibold text-[#1C1917]"
                                : "font-medium text-[#44403C]"
                            )}
                          >
                            {user.email}
                          </p>

                          <span className="text-[10px] text-[#A8A29E] shrink-0">
                            {new Date(
                              user.createdAt
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-[#78716C] truncate mt-0.5">
                          {user.phone || "No phone number"}
                        </p>

                        <p className="text-xs text-[#A8A29E] truncate mt-0.5">
                          {user.message?.slice(0, 60)}
                          {user.message && user.message.length > 60
                            ? "…"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Reading panel */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E7E2DC] shadow-sm overflow-hidden flex flex-col">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState text="Select a message" />
            </div>
          ) : (
            <>
              <div className="px-8 py-5 border-b border-[#E7E2DC] flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
                    {selectedUser.subject || "Contact Message"}
                  </h2>

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-sm text-[#78716C]">
                      From:{" "}
                      <span className="text-[#1C1917] font-medium">
                        {selectedUser.fullName || selectedUser.email}
                      </span>
                    </span>

                    <span className="text-[#D6CFC7]">·</span>

                    <span className="text-sm text-[#78716C]">
                      {selectedUser.email}
                    </span>

                    {selectedUser.phone && (
                      <>
                        <span className="text-[#D6CFC7]">·</span>

                        <span className="text-sm text-[#78716C]">
                          {selectedUser.phone}
                        </span>
                      </>
                    )}

                    <span className="text-[#D6CFC7]">·</span>

                    <div className="flex items-center gap-1.5 text-sm text-[#78716C]">
                      <Clock size={12} />

                      {new Date(
                        selectedUser.createdAt
                      ).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {selectedUser.isRead === false && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF8F3] text-[#8B5E3C] text-xs font-medium border border-[#E7E2DC] shrink-0">
                    Unread
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-2xl">
                  <p className="text-[#44403C] leading-relaxed text-[15px] whitespace-pre-wrap">
                    {selectedUser.message ?? ""}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;