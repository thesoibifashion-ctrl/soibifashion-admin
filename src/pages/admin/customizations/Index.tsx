"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonTable } from "@/components/shared/skeleton";
import ErrorState from "@/components/shared/ErrorState";

import {
  createCustomizationOption,
  deleteCustomizationOption,
  getAdminCustomizations,
  updateCustomizationOption,
} from "@/api/customizations";

import CustomizationSection from "./CustomizationSection";
import CustomizationOptionDrawer from "./CustomizationOptionDrawer";
import CarouselPage from "./HeroCarousel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfirmationModal from "@/components/shared/modals/ActionsModal";
import { toast } from "sonner";

type CustomizationOption = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  description: string | null;
  status: "active" | "inactive";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

type CustomizationCategory = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  sortOrder: number;
  options: CustomizationOption[];
  createdAt?: string;
  updatedAt?: string;
};

type OptionFormPayload = {
  name: string;
  slug: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  description: string | null;
  status: "active" | "inactive";
  sortOrder: number;
};

const CustomizationsPage = () => {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedOption, setSelectedOption] =
    useState<CustomizationOption | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CustomizationCategory | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [optionToDelete, setOptionToDelete] =
    useState<CustomizationOption | null>(null);

  const activeTab = searchParams.get("tab") || "carousel";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("tab", value);

    setSearchParams(params);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-customizations"],
    queryFn: getAdminCustomizations,
    staleTime: 1000 * 60 * 5,
  });

  const categories: CustomizationCategory[] = useMemo(() => {
    return [...(data?.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data]);

  const optionMutation = useMutation({
    mutationFn: ({
      categoryId,
      option,
      id,
    }: {
      categoryId: string;
      option: OptionFormPayload;
      id?: string;
    }) => {
      if (id) {
        return updateCustomizationOption(id, {
          name: option.name,
          slug: option.slug,
          imageUrl: option.imageUrl,
          imagePublicId: option.imagePublicId,
          description: option.description,
          status: option.status,
          sortOrder: option.sortOrder,
        });
      }

      return createCustomizationOption({
        categoryId,
        name: option.name,
        slug: option.slug,
        imageUrl: option.imageUrl,
        imagePublicId: option.imagePublicId,
        description: option.description,
        status: option.status,
        sortOrder: option.sortOrder,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-customizations"],
      });

      setDrawerOpen(false);
      setSelectedOption(null);
      setSelectedCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomizationOption,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-customizations"],
      });
      toast.success("Customization deleted successfully");
      setDeleteModalOpen(false);
      setOptionToDelete(null);
    },
    onError: () => {
     
        toast.error("Customization failed to deleted");
        setDeleteModalOpen(false);
        setOptionToDelete(null);
      },
  });

  const handleAdd = (category: CustomizationCategory) => {
    setSelectedCategory(category);
    setSelectedOption(null);
    setDrawerOpen(true);
  };

  const handleEdit = (
    category: CustomizationCategory,
    option: CustomizationOption
  ) => {
    setSelectedCategory(category);
    setSelectedOption(option);
    setDrawerOpen(true);
  };

  const handleSave = (payload: OptionFormPayload) => {
    if (!selectedCategory) return;

    optionMutation.mutate({
      categoryId: selectedCategory.id,
      option: payload,
      id: selectedOption?.id,
    });
  };

  const handleDrawerChange = (open: boolean) => {
    setDrawerOpen(open);

    if (!open) {
      setSelectedOption(null);
      setSelectedCategory(null);
    }
  };

  const handleDelete = (id: string) => {
    const option = categories
      .flatMap((category) => category.options)
      .find((option) => option.id === id);

    if (!option) return;

    setOptionToDelete(option);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!optionToDelete) return;

    deleteMutation.mutate(optionToDelete.id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <SkeletonTable />
      </div>
    );
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="p-6 mt-10 space-y-6">
      <PageHeader title="Customizations" />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-fit justify-start h-10! bg-[#F5F0EB] py-1 rounded-xl">
          <TabsTrigger
            value="carousel"
            className="px-5 rounded-lg text-[#1C1917]! text-sm data-active:bg-white data-active:shadow-sm!"
          >
            Carousel
          </TabsTrigger>

          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-5 rounded-lg text-[#1C1917]! text-sm data-active:bg-white data-active:shadow-sm!"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="carousel" className="mt-6">
          <CarouselPage />
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <CustomizationSection
              category={category}
              onAdd={() => handleAdd(category)}
              onEdit={(option) => handleEdit(category, option)}
              onDelete={handleDelete}
              loading={deleteMutation.isPending}
            />
          </TabsContent>
        ))}
      </Tabs>

      <CustomizationOptionDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerChange}
        categoryName={selectedCategory?.name ?? "Customization"}
        option={selectedOption}
        saving={optionMutation.isPending}
        onSave={handleSave}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          // Prevent closing while delete request is running
          if (deleteMutation.isPending) return;

          setDeleteModalOpen(open);

          if (!open) {
            setOptionToDelete(null);
          }
        }}
        title="Delete Option"
        description={
          optionToDelete
            ? `Are you sure you want to delete "${optionToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this customization option?"
        }
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmButtonClassName="bg-[#DC2626] hover:bg-[#B91C1C]"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CustomizationsPage;
