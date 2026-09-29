import {
  createCustomizationCategory,
  createCustomizationOption,
  deleteCustomizationCategory,
  deleteCustomizationOption,
  getAdminCustomizations,
  updateCustomizationOption,
} from "@/api/requests/customization";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


interface CollectionSlug{
  slug:string
  name:string
}
const QUERY_KEY = ["admin-customizations"] as const;

export function useLatestCollectionCategory({slug}:CollectionSlug) {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAdminCustomizations,
  });

  const category = query.data?.find(
    (category) => category.slug === slug
  );

  return {
    ...query,
    category,
  };
}

export function useCreateLatestCollectionCategory({slug,name}:CollectionSlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      createCustomizationCategory({
        name: name,
        slug: slug,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteLatestCollectionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteCustomizationCategory(categoryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useSaveLatestCollectionImage({slug,name}:CollectionSlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      existingOptionId,
      imageUrl,
      imagePublicId,
    }: {
      categoryId: string;
      existingOptionId: string | null;
      imageUrl: string;
      imagePublicId: string;
    }) => {
      if (existingOptionId) {
        return updateCustomizationOption({
          id: existingOptionId,
          payload: {
            imageUrl,
            imagePublicId,
          },
        });
      }

      return createCustomizationOption({
        categoryId,
        name: name,
        slug: slug,
        imageUrl,
        imagePublicId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteLatestCollectionOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (optionId: string) =>
      deleteCustomizationOption(optionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}