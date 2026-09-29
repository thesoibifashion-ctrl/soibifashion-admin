// "use client";

// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Loader } from "@/components/shared/Loader";
// import { useState } from "react";
// import { gql } from "@apollo/client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useMutation } from "@apollo/client/react";
// import { RxDotsHorizontal } from "react-icons/rx";

// interface Tag { id: string; name: string; }
// interface TagSelectorProps {
//   tags: Tag[];
//   selectedTag: string;
//   onSelectTag: (tagId: string) => void;
//   newTagName: string;
//   onNewTagNameChange: (name: string) => void;
//   showTagPopover: boolean;
//   onShowTagPopoverChange: (show: boolean) => void;
//   onCreateTag: () => Promise<void>;
//   refetch: () => Promise<any>;
//   isCreatingTag: boolean;
//   isLoading: boolean;
//   error?: any;
// }

// /* -------------------- GQL -------------------- */
// const EDIT_BLOG_TAG = gql`
//   mutation EditBlogTag($id: String!, $data: EditBlogTagInput!) {
//     editBlogTag(id: $id, data: $data) {
//       id
//       name
//     }
//   }
// `;

// const REASSIGN_BLOG_TAG = gql`
//   mutation ReassignBlogTag($data: ReassignBlogInput!) {
//     reassignBlogTag(data: $data) {
//       message
//       blog { id title tag { id name } }
//     }
//   }
// `;

// /* ----------------- COMPONENT ------------------ */
// export function TagSelector({
//   tags,
//   selectedTag,
//   onSelectTag,
//   newTagName,
//   onNewTagNameChange,
//   showTagPopover,
//   onShowTagPopoverChange,
//   onCreateTag,
//   refetch,
//   isCreatingTag,
//   isLoading,
//   error,
// }: TagSelectorProps) {
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [currentTag, setCurrentTag] = useState<Tag | null>(null);
//   const [editName, setEditName] = useState("");
//   const [reassignTagId, setReassignTagId] = useState("");

//   const [editBlogTag, { loading: isEditing }] = useMutation(EDIT_BLOG_TAG);
//   const [reassignBlogTag, { loading: isReassigning }] = useMutation(REASSIGN_BLOG_TAG);

//   if (isLoading) return <div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 className="animate-spin w-4 h-4" /><span>Loading tags...</span></div>;
//   if (error) return <p className="text-sm text-red-500">Failed to load tags</p>;

//   return (
//     <>
//       <Select onValueChange={(value) => onSelectTag(value)} value={selectedTag || ""}>
//         <SelectTrigger className="w-fit bg-[white] border-[#F2F2F2] border rounded-full text-[#1E1E1E]">
//           <SelectValue placeholder="Choose a tag" />
//         </SelectTrigger>

//         <SelectContent className="w-[214px]">
//           {tags.length > 0 ? tags.map(tag => (
//             <div key={tag.id} className="flex items-center justify-between gap-2">
//               <SelectItem value={tag.id}>{tag.name}</SelectItem>

//               {/* Actions Popover */}
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <button className=""><RxDotsHorizontal/></button>
//                 </PopoverTrigger>

//                 <PopoverContent className="w-[81px] rounded-[16px] flex flex-col items-start gap-2">
//                   <button
//                     className="font-medium text-sm text-[#1E1E1E]"
//                     onClick={() => {
//                       setCurrentTag(tag);
//                       setEditName(tag.name);
//                       setEditDialogOpen(true);
//                     }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="font-medium text-sm text-[#DA291C]"
//                     onClick={() => {
//                       setCurrentTag(tag);
//                       setReassignTagId(""); // reset
//                       setDeleteDialogOpen(true);
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </PopoverContent>
//               </Popover>
//             </div>
//           )) : (
//             <div className="text-gray-500 text-sm px-3 py-2">No tags found — create one below</div>
//           )}

//           {/* Add Tag Popover */}
//           <Popover open={showTagPopover} onOpenChange={(open) => onShowTagPopoverChange(open)}>
//             <PopoverTrigger asChild>
//               <button type="button" className="w-full text-left text-[#005FAD] px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2">
//                 <span className="w-full py-[10.5px] rounded-full border border-[#F2F2F2] bg-[#FFFFFF] text-center font-medium text-base text-[#1E1E1E]">
//                   Add tag
//                 </span>
//               </button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[300px]">
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   placeholder="Add tag"
//                   value={newTagName}
//                   onChange={(e) => onNewTagNameChange(e.target.value)}
//                   className="w-full border rounded-md px-3 py-2 text-sm"
//                 />
//                 <Button
//                   onClick={async () => {
//                     await onCreateTag();
//                     const updatedTags = await refetch();
//                     const newTag = updatedTags.data?.getAllBlogTags?.find((t: any) => t.name === newTagName);
//                     if (newTag) onSelectTag(newTag.id);
//                   }}
//                   disabled={isCreatingTag}
//                   className="bg-gradient-to-b w-full from-[#6c4fffb6] via-[#5C3DFF] to-[#6d4fffb6] text-white px-6 py-3 rounded-full flex items-center gap-2"
//                 >
//                   {isCreatingTag ? <Loader /> : "Add tag"}
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </SelectContent>
//       </Select>

//       {/* ---------------- EDIT DIALOG ---------------- */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent className="!max-w-[300px] px-2">
//           <DialogHeader className="mt-4">
//             <DialogTitle className="font-normal text-[11px] text-[#1E1E1EA6]">Updating tag name will also update across all blogs that have this tag linked to them</DialogTitle>
//           </DialogHeader>
//           <input
//             type="text"
//             value={editName}
//             onChange={(e) => setEditName(e.target.value)}
//             className="w-full border rounded-md px-3 py-2 text-sm my-2"
//           />
//           <Button
//             disabled={isEditing}
//             onClick={async () => {
//               if (!currentTag) return;
//               await editBlogTag({ variables: { id: currentTag.id, data: { name: editName } } });
//               await refetch();
//               setEditDialogOpen(false);
//             }}
//             className="bg-gradient-to-b w-full from-[#6c4fffb6] via-[#5C3DFF] to-[#6d4fffb6] text-white px-4 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition"
//           >
//             {isEditing ? <Loader /> : "Save "}
//           </Button>
//         </DialogContent>
//       </Dialog>

//       {/* --------------- DELETE/REASSIGN DIALOG ---------------- */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent className="!max-w-[300px] px-2">
//           <DialogHeader className="mt-4">
//             <DialogTitle  className="font-normal text-[11px] text-[#1E1E1EA6]">You are required to reassign all blogs linked to this tag ({currentTag?.name}) before you can delete the tag</DialogTitle>
//           </DialogHeader>
       
//           <Select value={reassignTagId} onValueChange={setReassignTagId}>
//             <SelectTrigger className="w-full bg-white border border-[#F2F2F2] rounded-md text-sm">
//               <SelectValue placeholder={currentTag?.name} />
//             </SelectTrigger>
//             <SelectContent>
//               {tags.filter(t => t.id !== currentTag?.id).map(t => (
//                 <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Button
//             disabled={isReassigning || !reassignTagId || !currentTag}
//             onClick={async () => {
//               if (!currentTag) return;
//               await reassignBlogTag({ variables: { data: { currentTagId: currentTag.id, TagToAssign: reassignTagId } } });
//               await refetch();
//               setDeleteDialogOpen(false);
//             }}
//             className="w-full rounded-full  bg-gradient-to-b from-[#ff2828cb] via-[#FF2828] to-[#ff2828cb] text-white px-6 py-3 mt-2"
//           >
//             {isReassigning ? <Loader /> : "Reassign & Delete"}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

const TagSelector = () => {
  return (
    <div>TagSelector</div>
  )
}

export default TagSelector