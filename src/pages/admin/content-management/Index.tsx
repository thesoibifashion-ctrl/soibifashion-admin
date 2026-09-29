import { SearchInput } from "@/components/shared/inputs/SearchInput";
import { SkeletonTable } from "@/components/shared/skeleton";
import { DataTable } from "@/components/shared/table/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import EmptySearch from "@/components/shared/EmptySearch";
import { useClientPagination } from "@/hooks/useClientPagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { useNavigate } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/api/requests/blog";
import { BlogColumn } from "@/data/table-colums/blog-column";

const BlogPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: getBlogPosts,
    staleTime: 1000 * 60 * 5,
    placeholderData:
      search.length > 0 ? (previousData) => previousData : undefined,
  });

  const posts: BlogPost[] = data ?? [];

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    const searchValue = search.toLowerCase();

    return (
      post.title?.toLowerCase().includes(searchValue) ||
      post.excerpt?.toLowerCase().includes(searchValue) ||
      post.status?.toLowerCase().includes(searchValue)
    );
  });

  const { page, pageCount, paginatedData, handlePageChange } =
    useClientPagination(filteredPosts, 8);

  const handleRowClick = (post: BlogPost) => {
    navigate(`/content-management/edit-content/blog/${post.id}`);
  };

  if (isLoading) {
    return (
      <div>
        <SkeletonTable />
      </div>
    );
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-6 mt-10">
      <PageHeader title="Blog" />

      <div className="flex items-center justify-between">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search blog posts..."
        />

        <button
          onClick={() =>
            navigate("/content-management/edit-content/blog/new")
          }
          className="px-4 py-1 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
        >
          <PlusCircle size={18} />
          New Blog
        </button>
      </div>

      {posts.length === 0 ? (
        <EmptyState text="">
          <button
            onClick={() =>
              navigate("/content-management/edit-content/blog/new")
            }
            className="px-4 py-1 mt-2 bg-near-brown rounded-[20px] text-white flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Create New Blog
          </button>
        </EmptyState>
      ) : filteredPosts.length === 0 ? (
        <EmptySearch text="" />
      ) : (
        <DataTable
          columns={BlogColumn}
          data={paginatedData}
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default BlogPage;