import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";
import { PageHeader } from "@/components/shared/PageHeader";
import { getAdminQuote, getAdminQuotes } from "@/api/quotes";
import { useClientPagination } from "@/hooks/useClientPagination";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import QuoteDrawer from "./Drawer";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import type { Quote } from "@/types";
import { QuoteColumns } from "@/data/table-colums/quotes-column";

const QuotesPage = () => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: () => getAdminQuotes(),
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });
  const quotes = data?.data ?? [];

  const filteredQuotes = quotes.filter((quote: Quote) => {
    const searchValue = search.toLowerCase();

    return (
      quote.referenceNumber?.toLowerCase().includes(searchValue) ||
      quote.customerName?.toLowerCase().includes(searchValue) ||
      quote.customerEmail?.toLowerCase().includes(searchValue) ||
      quote.customerPhone?.toLowerCase().includes(searchValue) ||
      quote.status?.toLowerCase().includes(searchValue)
    );
  });

 const { page, pageCount, paginatedData, handlePageChange } =
    useClientPagination<Quote>(data?.data ?? [],8);


  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const handleRowClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setOpen(true);
  };

  const handleUpdate = (updatedQuote: Quote) => {
    setSelectedQuote(updatedQuote);
  };

  return (
    <div className="space-y-6 mt-12">
      <PageHeader title="Quotes" />

      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search quotes..."
        />
      </div>

      {quotes.length === 0 ? (
        <EmptyState text={""} />
      ) : filteredQuotes.length === 0 ? (
        <EmptySearch text={""} />
      ) : (
        <DataTable
          columns={QuoteColumns}
          data={paginatedData}
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}

      <AppDrawer
        width="w-[60%] lg:max-w-[40%]!"
        open={open}
        onOpenChange={setOpen}
      >
        <QuoteDrawer
          quote={selectedQuote}
          onClose={() => setOpen(false)}
          onUpdate={handleUpdate}
        />
      </AppDrawer>
    </div>
  );
};

export default QuotesPage;
