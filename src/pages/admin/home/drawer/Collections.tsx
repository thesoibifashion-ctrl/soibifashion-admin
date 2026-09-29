// import { AppDrawer } from '@/components/shared/drawer/DataDrawer'
// import React from 'react'
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useCreateLatestCollectionCategory, useLatestCollectionCategory, useSaveLatestCollectionImage } from "@/hooks/use-customization";
// import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// const Collections = () => {
//     const { category, isLoading, isError } = useLatestCollectionCategory();
//     const createCategory = useCreateLatestCollectionCategory();
//     const saveImage = useSaveLatestCollectionImage();
//     const [open, setOpen] = useState(false);
  
//     const [file, setFile] = useState<File | null>(null);
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
  
//     const existingOption = category?.options[0] ?? null;
  
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const selected = e.target.files?.[0];
//       if (!selected) return;
//       setFile(selected);
//       setPreviewUrl(URL.createObjectURL(selected));
//       setError(null);
//     };
  
//     const handleSave = async () => {
//       if (!file || !category) return;
//       setError(null);
  
//       try {
//         setIsUploading(true);
//         const uploaded = await uploadToCloudinary(file);
  
//         await saveImage.mutateAsync({
//           categoryId: category.id,
//           existingOptionId: existingOption?.id ?? null,
//           imageUrl: uploaded.secureUrl,
//           imagePublicId: uploaded.publicId,
//         });
  
//         setFile(null);
//         setPreviewUrl(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to save image");
//       } finally {
//         setIsUploading(false);
//       }
//     };
  
//     if (isLoading) {
//       return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
//     }
  
//     if (isError) {
//       return <p className="p-6 text-sm text-red-500">Failed to load.</p>;
//     }
  
//     // Category doesn't exist yet — only show the create button
//     if (!category) {
//       return (
//         <div className="mx-auto max-w-md p-6">
//           <h1 className="mb-4 text-xl font-semibold">Latest Collection</h1>
//           <p className="mb-4 text-sm text-muted-foreground">
//             Not set up yet.
//           </p>
//           <Button
//             onClick={() => createCategory.mutate()}
//             disabled={createCategory.isPending}
//           >
//             {createCategory.isPending ? "Adding..." : "Add Latest Collection"}
//           </Button>
//           {createCategory.isError && (
//             <p className="mt-2 text-sm text-red-500">
//               Failed to create — try again.
//             </p>
//           )}
//         </div>
//       );
//     }
  
//     // Category exists — edit mode
//     const displayImage = previewUrl ?? existingOption?.imageUrl ?? null;
  
//   return (
//     <div>
//         <AppDrawer       open={open}
//         onOpenChange={setOpen}>
//         <div className="mx-auto max-w-md p-6">
//       <h1 className="mb-4 text-xl font-semibold">Latest Collection Image</h1>
//       <p className="mb-4 text-xs text-muted-foreground">
//         This image shows on the homepage. Use a different, homepage-sized
//         image — not the same one used on the gallery/collections page.
//       </p>

//       {displayImage ? (
//         <img
//           src={displayImage}
//           alt="Latest collection preview"
//           className="mb-4 aspect-video w-full rounded-md border object-cover"
//         />
//       ) : (
//         <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
//           No image uploaded yet
//         </div>
//       )}

//       <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 block text-sm" />

//       {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

//       <Button
//         onClick={handleSave}
//         disabled={!file || isUploading || saveImage.isPending}
//       >
//         {isUploading || saveImage.isPending
//           ? "Saving..."
//           : existingOption
//           ? "Update Image"
//           : "Upload Image"}
//       </Button>
//     </div>
//         </AppDrawer>
//     </div>
//   )
// }

// export default Collections

const Collections = () => {
  return (
    <div>Collections</div>
  )
}

export default Collections