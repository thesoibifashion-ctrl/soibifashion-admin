import { useSearchParams } from "react-router-dom";

export function useClientPagination<T>(
  data: T[],
  pageSize = 8
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const pageCount = Math.ceil(data.length / pageSize);

  const startIndex = (page - 1) * pageSize;

  const paginatedData = data.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));

    setSearchParams(params);
  };

  return {
    page,
    pageCount,
    paginatedData,
    handlePageChange,
  };
}