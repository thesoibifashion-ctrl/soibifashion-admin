// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import Strike from "@tiptap/extension-strike";
// import Placeholder from "@tiptap/extension-placeholder";

// import { Button } from "@/components/ui/button";
// import { useNavigate, useParams } from "react-router-dom";
// import { Popover, PopoverTrigger } from "@/components/ui/popover";
// import { useDropzone } from "react-dropzone";

// import { Audio } from "./Audio";
// import { Video } from "./video";
// import { YoutubeEmbed, getYoutubeEmbedUrl } from "./YoutubeEmbed";
// import { LinkModal } from "./LinkModal";
// import { CoverImageUpload } from "./CoverImageUpload";
// import { BlogContent } from "./BlogContent";
// import { EditorToolbar } from "./EditorToolBar";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   createBlogPost,
//   getBlogPost,
//   updateBlogPost,
//   type CreateBlogPostPayload,
//   type UpdateBlogPostPayload,
// } from "@/api/requests/blog";

// import { Loader2, X } from "lucide-react";
// import { statusBadge } from "@/lib/utils/statusBadge";
// import { toast } from "sonner";
// import BlogSkeleton from "./BlogSkeleton";
// import { uploadToCloudinary } from "@/lib/Cloudinary";

// type BlogStatus = "draft" | "published";

// export default function NewBlog() {
//   const [showLinkModal, setShowLinkModal] = useState(false);
//   const [linkText, setLinkText] = useState("");
//   const [linkUrl, setLinkUrl] = useState("");

//   const [showYoutubeModal, setShowYoutubeModal] = useState(false);
//   const [youtubeUrl, setYoutubeUrl] = useState("");

//   const [title, setTitle] = useState("");
//   const [excerpt, setExcerpt] = useState("");
//   const [status, setStatus] = useState<BlogStatus>("draft");
//   const [coverImage, setCoverImage] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const { id: routeId } = useParams<{ id?: string }>();

//   const isExistingBlog = Boolean(routeId && routeId !== "new");

//   const [blogId, setBlogId] = useState<string | undefined>(isExistingBlog ? routeId : undefined);

//   const [isUploading, setIsUploading] = useState(false);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   const queryClient = useQueryClient();

//   const isDirty = useRef(false);
//   const hasPrefilled = useRef(false);

//   /*
//    * Get existing blog post when editing.
//    */
//   const {
//     data: postData,
//     isLoading: isLoadingPost,
//   } = useQuery({
//     queryKey: ["blog", routeId],
//     queryFn: () => getBlogPost(routeId!),
//     enabled: isExistingBlog,
//   });

//   /*
//    * Editor
//    */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: {
//           levels: [1, 2, 3, 4, 5],
//         },
//       }),
//       Underline,
//       Audio,
//       Strike,
//       Video,
//       YoutubeEmbed,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//       Placeholder.configure({
//         placeholder: "Start creating blog",
//       }),
//     ],

//     editorProps: {
//       attributes: {
//         class: "prose-editor",
//       },
//     },

//     content: "",

//     onUpdate: () => {
//       isDirty.current = true;
//     },
//   });

//   /*
//    * Populate editor when editing.
//    */
//   useEffect(() => {
//     if (!postData || !editor) return;
//     if (hasPrefilled.current) return;

//     const post = postData ?? postData;

//     setBlogId(post.id);
//     setTitle(post.title || "");
//     setExcerpt(post.excerpt || "");
//     setCoverImage(post.coverImageUrl || null);
//     setStatus(post.status || "draft");

//     editor.commands.setContent(post.content || "");

//     isDirty.current = false;
//     hasPrefilled.current = true;
//   }, [postData, editor]);

//   /*
//    * Create blog
//    */
//   const { mutate: createBlog, isPending: isCreating } = useMutation({
//     mutationFn: (payload: CreateBlogPostPayload) =>
//       createBlogPost(payload),

//     onSuccess: (data: any) => {
//       queryClient.invalidateQueries({
//         queryKey: ["admin-blog"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["blog"],
//       });

//       isDirty.current = false;
//       setLastSaved(new Date());

//       if (data?.data?.id) {
//         setBlogId(data.data.id);
//       }
//     },

//     onError: (error: Error) => {
//       toast.error(error.message || "Failed to create post", {
//         position: "bottom-right",
//       });
//     },
//   });

//   /*
//    * Update blog
//    */
//   const { mutate: editBlog, isPending: isUpdating } = useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: UpdateBlogPostPayload;
//     }) => updateBlogPost(id, payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["admin-blog"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["blog"],
//       });

//       isDirty.current = false;
//       setLastSaved(new Date());
//     },

//     onError: (error: Error) => {
//       toast.error(error.message || "Failed to update post", {
//         position: "bottom-right",
//       });
//     },
//   });

//   const isSaving = isCreating || isUpdating;

//   /*
//    * Insert link
//    */
//   const insertLink = () => {
//     if (!linkText || !linkUrl) return;

//     const linkHTML = `
//       <a
//         href="${linkUrl}"
//         class="text-[blue] underline hover:text-blue-800"
//       >
//         ${linkText}
//       </a>
//     `;

//     editor?.chain().focus().insertContent(linkHTML).run();

//     setShowLinkModal(false);
//     setLinkText("");
//     setLinkUrl("");
//   };

//   /*
//    * Insert YouTube
//    */
//   const insertYoutube = () => {
//     const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

//     if (!embedUrl) return;

//     editor
//       ?.chain()
//       .focus()
//       .insertContent({
//         type: "youtubeEmbed",
//         attrs: {
//           src: embedUrl,
//         },
//       })
//       .run();

//     setShowYoutubeModal(false);
//     setYoutubeUrl("");
//   };

//   /*
//    * Build blog payload
//    */
//   const buildPayload = (
//     nextStatus: BlogStatus,
//   ): CreateBlogPostPayload => {
//     return {
//       title: title.trim(),
//       slug: title
//         .trim()
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, ""),
//       excerpt: excerpt.trim(),
//       content: editor?.getHTML() || "",
//       coverImageUrl: coverImage || undefined,
//       status: nextStatus,
//     };
//   };

//   /*
//    * Save / publish
//    */
//   const handleSaveBlog = (nextStatus: BlogStatus) => {
//     if (!title.trim()) {
//       toast.error("Please enter a title", {
//         position: "bottom-right",
//       });
//       return;
//     }

//     if (isExistingBlog && isLoadingPost) return;

//     const payload = buildPayload(nextStatus);

//     if (blogId) {
//       editBlog(
//         {
//           id: blogId,
//           payload,
//         },
//         {
//           onSuccess: () => {
//             setStatus(nextStatus);
//           },
//         },
//       );
//     } else {
//       createBlog(payload, {
//         onSuccess: (data: any) => {
//           setStatus(nextStatus);

//           if (data?.data?.id) {
//             setBlogId(data.data.id);

//             navigate(
//               `/content-management/edit-content/blog/${data.data.id}`,
//               {
//                 replace: true,
//               },
//             );
//           }
//         },
//       });
//     }
//   };

//   /*
//    * Mark dirty when content changes.
//    */
//   useEffect(() => {
//     if (!hasPrefilled.current) return;

//     isDirty.current = true;
//   }, [title, excerpt, coverImage]);

//   /*
//    * Autosave every 10 seconds.
//    */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isDirty.current) return;
//       if (!title.trim()) return;
//       if (isSaving) return;
//       if (isExistingBlog && isLoadingPost) return;

//       const payload = buildPayload("draft");

//       if (blogId) {
//         editBlog({
//           id: blogId,
//           payload,
//         });
//       } else {
//         createBlog(payload, {
//           onSuccess: (data: any) => {
//             if (data?.data?.id) {
//               setBlogId(data.data.id);

//               navigate(
//                 `/content-management/edit-content/blog/${data.data.id}`,
//                 {
//                   replace: true,
//                 },
//               );
//             }
//           },
//         });
//       }
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [
//     title,
//     excerpt,
//     coverImage,
//     blogId,
//     isSaving,
//     isLoadingPost,
//     routeId,
//   ]);

//   /*
//    * Cover image upload
//    */
//   const onDrop = async (acceptedFiles: File[]) => {
//     if (!acceptedFiles.length) return;

//     setIsUploading(true);

//     try {
//       const uploadedUrl = await uploadToCloudinary(
//         acceptedFiles[0],
//       );

//       setCoverImage(uploadedUrl);

//       const payload = buildPayload(status);

//       if (blogId) {
//         editBlog({
//           id: blogId,
//           payload,
//         });
//       } else {
//         createBlog(payload, {
//           onSuccess: (data: any) => {
//             if (data?.data?.id) {
//               setBlogId(data.data.id);

//               navigate(
//                 `/content-management/edit-content/blog/${data.data.id}`,
//                 {
//                   replace: true,
//                 },
//               );
//             }
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);

//       toast.error("Failed to upload cover image", {
//         position: "bottom-right",
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,

//     accept: {
//       "image/*": [],
//     },

//     maxSize: 20 * 1024 * 1024,
//   });

//   /*
//    * Insert audio / video
//    */
//   const handleInsertMedia = (
//     type: "audio" | "video",
//   ) => {
//     const input = document.createElement("input");

//     input.type = "file";
//     input.accept =
//       type === "audio"
//         ? "audio/*"
//         : "video/*";

//     input.onchange = async (e: Event) => {
//       const target = e.target as HTMLInputElement;
//       const file = target.files?.[0];

//       if (!file) return;

//       setIsUploading(true);

//       try {
//         const mediaUrl =
//           await uploadToCloudinary(file);

//         if (!mediaUrl) {
//           throw new Error(
//             "Upload failed — no URL returned",
//           );
//         }

//         editor
//           ?.chain()
//           .focus()
//           .insertContent({
//             type,
//             attrs: {
//               src: mediaUrl,
//               type: file.type,
//             },
//           })
//           .run();

//         isDirty.current = true;
//       } catch (error) {
//         console.error(
//           "Media upload failed:",
//           error,
//         );

//         toast.error(
//           `Failed to upload ${type}`,
//           {
//             position: "bottom-right",
//           },
//         );
//       } finally {
//         setIsUploading(false);
//       }
//     };

//     input.click();
//   };

//   /*
//    * Insert image inside editor
//    */
//   const handleImageClick = () => {
//     const input =
//       document.createElement("input");

//     input.type = "file";
//     input.accept = "image/*";

//     input.onchange = async (e: Event) => {
//       const target =
//         e.target as HTMLInputElement;

//       const file = target.files?.[0];

//       if (!file) return;

//       setIsUploading(true);

//       try {
//         const imageUrl =
//           await uploadToCloudinary(file);

//         editor
//           ?.chain()
//           .focus()
//           .setImage({
//             src: imageUrl,
//           })
//           .run();

//         isDirty.current = true;
//       } catch (error) {
//         console.error(
//           "Image upload failed:",
//           error,
//         );

//         toast.error(
//           "Failed to upload image",
//           {
//             position: "bottom-right",
//           },
//         );
//       } finally {
//         setIsUploading(false);
//       }
//     };

//     input.click();
//   };

//   if (isExistingBlog && isLoadingPost) {
//     return <BlogSkeleton />;
//   }

//   return (
//     <div className="flex flex-col justify-center">
//       {/* Header */}
//       <div className="sticky top-0 z-50">
//         <div className="flex justify-between py-4 gap-2 bg-[#F1F1F1]">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() =>
//                 navigate("/content-management?tab=blog")
//               }
//               className="bg-white rounded-full p-2"
//             >
//               <X size={14} />
//             </button>

//             {status && (
//               <p>{statusBadge(status)}</p>
//             )}
//           </div>

//           <div>
//             <div className="flex gap-3">
//               <button
//                 className="text-black rounded-full"
//                 disabled={isSaving}
//                 onClick={() =>
//                   handleSaveBlog("draft")
//                 }
//               >
//                 Save as draft
//               </button>

//               <button
//                 className="py-2 px-8.5 text-white bg-[#186D0F] rounded-full"
//                 disabled={
//                   isSaving || isUploading
//                 }
//                 onClick={() =>
//                   handleSaveBlog("published")
//                 }
//               >
//                 {isSaving || isUploading ? (
//                   <Loader2 className="animate-spin" />
//                 ) : (
//                   "Publish"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <EditorToolbar
//           editor={editor}
//           onLinkClick={() =>
//             setShowLinkModal(true)
//           }
//           onImageClick={handleImageClick}
//           onAudioClick={() =>
//             handleInsertMedia("audio")
//           }
//           onVideoClick={() =>
//             handleInsertMedia("video")
//           }
//           onYoutubeClick={() =>
//             setShowYoutubeModal(true)
//           }
//         />
//       </div>

//       {/* Link modal */}
//       <Popover
//         open={showLinkModal}
//         onOpenChange={setShowLinkModal}
//       >
//         <PopoverTrigger asChild>
//           <Button className="hidden" />
//         </PopoverTrigger>

//         <LinkModal
//           isOpen={showLinkModal}
//           onClose={setShowLinkModal}
//           linkText={linkText}
//           linkUrl={linkUrl}
//           onLinkTextChange={setLinkText}
//           onLinkUrlChange={setLinkUrl}
//           onInsert={insertLink}
//         />
//       </Popover>

//       {/* YouTube modal */}
//       {showYoutubeModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
//             <p className="font-semibold text-base">
//               Embed YouTube Video
//             </p>

//             <input
//               type="text"
//               value={youtubeUrl}
//               onChange={(e) =>
//                 setYoutubeUrl(e.target.value)
//               }
//               placeholder="Paste YouTube URL (e.g. https://youtu.be/abc123)"
//               className="border rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-[#186D0F]"
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   setShowYoutubeModal(false);
//                   setYoutubeUrl("");
//                 }}
//                 className="px-4 py-2 text-sm rounded-lg border"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={insertYoutube}
//                 className="px-4 py-2 text-sm rounded-lg bg-[#186D0F] text-white"
//               >
//                 Embed
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Title */}
//       <div className="mt-[30px]">
//         <textarea
//           value={title}
//           onChange={(e) =>
//             setTitle(e.target.value)
//           }
//           rows={2}
//           className="w-full resize-none overflow-hidden text-4xl font-semibold text-gray-900 border-none focus:ring-0 outline-none placeholder-gray-400"
//           placeholder="Untitled"
//         />
//       </div>

//       {/* Excerpt */}
//       <div className="mx-auto mt-2 w-full">
//         <textarea
//           value={excerpt}
//           onChange={(e) =>
//             setExcerpt(e.target.value)
//           }
//           rows={2}
//           className="w-full resize-none text-sm text-gray-600 border-none focus:ring-0 outline-none placeholder-gray-400"
//           placeholder="Write a short excerpt..."
//         />
//       </div>

//       {/* Cover image */}
//       <CoverImageUpload
//         coverImage={coverImage || ""}
//         isUploading={isUploading}
//         getRootProps={getRootProps}
//         getInputProps={getInputProps}
//       />

//       {/* Content */}
//       <BlogContent
//         editor={editor}
//         title={title}
//         onTitleChange={setTitle}
//       />

//       {/* Save status */}
//       <div className="flex items-center justify-between mt-6">
//         <span className="text-xs text-gray-400">
//           {isSaving
//             ? "Saving..."
//             : lastSaved
//               ? `Saved ${lastSaved.toLocaleTimeString()}`
//               : ""}
//         </span>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Strike from "@tiptap/extension-strike";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useDropzone } from "react-dropzone";

import { Audio } from "./Audio";
import { Video } from "./video";
import { YoutubeEmbed, getYoutubeEmbedUrl } from "./YoutubeEmbed";
import { LinkModal } from "./LinkModal";
import { CoverImageUpload } from "./CoverImageUpload";
import { BlogContent } from "./BlogContent";
import { EditorToolbar } from "./EditorToolBar";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlogPost,
  getBlogPost,
  updateBlogPost,
  type CreateBlogPostPayload,
  type UpdateBlogPostPayload,
} from "@/api/requests/blog";

import { Loader2, X } from "lucide-react";
import { statusBadge } from "@/lib/utils/statusBadge";
import { toast } from "sonner";
import BlogSkeleton from "./BlogSkeleton";
import { uploadToCloudinary } from "@/lib/Cloudinary";

type BlogStatus = "draft" | "published";

export default function NewBlog() {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<BlogStatus>("draft");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const { id: routeId } = useParams<{ id?: string }>();

  const isExistingBlog = Boolean(routeId && routeId !== "new");

  const [blogId, setBlogId] = useState<string | undefined>(
    isExistingBlog ? routeId : undefined,
  );

  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  const hasPrefilled = useRef(false);

  /*
   * Get existing blog post when editing.
   */
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["blog", routeId],
    queryFn: () => getBlogPost(routeId!),
    enabled: isExistingBlog,
  });

  /*
   * Editor
   */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      Underline,
      Audio,
      Strike,
      Video,
      YoutubeEmbed,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Start creating blog",
      }),
    ],

    editorProps: {
      attributes: {
        class: "prose-editor",
      },
    },

    content: "",
  });

  /*
   * Populate editor when editing.
   */
  useEffect(() => {
    if (!postData || !editor) return;
    if (hasPrefilled.current) return;

    const post = postData;

    setBlogId(post.id);
    setTitle(post.title || "");
    setExcerpt(post.excerpt || "");
    setCoverImage(post.coverImageUrl || null);
    setStatus(post.status || "draft");

    editor.commands.setContent(post.content || "");

    hasPrefilled.current = true;
  }, [postData, editor]);

  /*
   * Create blog
   */
  const { mutate: createBlog, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateBlogPostPayload) => createBlogPost(payload),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-blog"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });

      setLastSaved(new Date());

      if (data?.data?.id) {
        setBlogId(data.data.id);
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create post", {
        position: "bottom-right",
      });
    },
  });

  /*
   * Update blog
   */
  const { mutate: editBlog, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBlogPostPayload;
    }) => updateBlogPost(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-blog"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });

      setLastSaved(new Date());
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update post", {
        position: "bottom-right",
      });
    },
  });

  const isSaving = isCreating || isUpdating;

  /*
   * Insert link
   */
  const insertLink = () => {
    if (!linkText || !linkUrl) return;

    const linkHTML = `
      <a
        href="${linkUrl}"
        class="text-[blue] underline hover:text-blue-800"
      >
        ${linkText}
      </a>
    `;

    editor?.chain().focus().insertContent(linkHTML).run();

    setShowLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  /*
   * Insert YouTube
   */
  const insertYoutube = () => {
    const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

    if (!embedUrl) return;

    editor
      ?.chain()
      .focus()
      .insertContent({
        type: "youtubeEmbed",
        attrs: {
          src: embedUrl,
        },
      })
      .run();

    setShowYoutubeModal(false);
    setYoutubeUrl("");
  };

  /*
   * Build blog payload
   */
  const buildPayload = (nextStatus: BlogStatus): CreateBlogPostPayload => {
    return {
      title: title.trim(),
      slug: title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      excerpt: excerpt.trim(),
      content: editor?.getHTML() || "",
      coverImageUrl: coverImage || undefined,
      status: nextStatus,
    };
  };

  /*
   * Save / publish (manual only)
   */
  const handleSaveBlog = (nextStatus: BlogStatus) => {
    if (!title.trim()) {
      toast.error("Please enter a title", {
        position: "bottom-right",
      });
      return;
    }

    if (isExistingBlog && isLoadingPost) return;

    const payload = buildPayload(nextStatus);

    if (blogId) {
      editBlog(
        {
          id: blogId,
          payload,
        },
        {
          onSuccess: () => {
            setStatus(nextStatus);
          },
        },
      );
    } else {
      createBlog(payload, {
        onSuccess: (data: any) => {
          setStatus(nextStatus);

          if (data?.data?.id) {
            setBlogId(data.data.id);

            navigate(`/content-management/edit-content/blog/${data.data.id}`, {
              replace: true,
            });
          }
        },
      });
    }
  };

  /*
   * Cover image upload (only uploads and sets the image;
   * it is persisted on the next manual save)
   */
  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(acceptedFiles[0]);

      setCoverImage(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);

      toast.error("Failed to upload cover image", {
        position: "bottom-right",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    accept: {
      "image/*": [],
    },

    maxSize: 20 * 1024 * 1024,
  });

  /*
   * Insert audio / video
   */
  const handleInsertMedia = (type: "audio" | "video") => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = type === "audio" ? "audio/*" : "video/*";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      setIsUploading(true);

      try {
        const mediaUrl = await uploadToCloudinary(file);

        if (!mediaUrl) {
          throw new Error("Upload failed — no URL returned");
        }

        editor
          ?.chain()
          .focus()
          .insertContent({
            type,
            attrs: {
              src: mediaUrl,
              type: file.type,
            },
          })
          .run();
      } catch (error) {
        console.error("Media upload failed:", error);

        toast.error(`Failed to upload ${type}`, {
          position: "bottom-right",
        });
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  /*
   * Insert image inside editor
   */
  const handleImageClick = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;

      const file = target.files?.[0];

      if (!file) return;

      setIsUploading(true);

      try {
        const imageUrl = await uploadToCloudinary(file);

        editor
          ?.chain()
          .focus()
          .setImage({
            src: imageUrl,
          })
          .run();
      } catch (error) {
        console.error("Image upload failed:", error);

        toast.error("Failed to upload image", {
          position: "bottom-right",
        });
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  if (isExistingBlog && isLoadingPost) {
    return <BlogSkeleton />;
  }

  return (
    <div className="flex flex-col justify-center">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <div className="flex justify-between py-4 gap-2 bg-[#F1F1F1]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/content-management?tab=blog")}
              className="bg-white rounded-full p-2"
            >
              <X size={14} />
            </button>

            {status && <p>{statusBadge(status)}</p>}
          </div>

          <div>
            <div className="flex gap-3">
              <button
                className="text-black rounded-full"
                disabled={isSaving}
                onClick={() => handleSaveBlog("draft")}
              >
                Save as draft
              </button>

              <button
                className="py-2 px-8.5 text-white bg-[#186D0F] rounded-full"
                disabled={isSaving || isUploading}
                onClick={() => handleSaveBlog("published")}
              >
                {isSaving || isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
        </div>

        <EditorToolbar
          editor={editor}
          onLinkClick={() => setShowLinkModal(true)}
          onImageClick={handleImageClick}
          onAudioClick={() => handleInsertMedia("audio")}
          onVideoClick={() => handleInsertMedia("video")}
          onYoutubeClick={() => setShowYoutubeModal(true)}
        />
      </div>

      {/* Link modal */}
      <Popover open={showLinkModal} onOpenChange={setShowLinkModal}>
        <PopoverTrigger asChild>
          <Button className="hidden" />
        </PopoverTrigger>

        <LinkModal
          isOpen={showLinkModal}
          onClose={setShowLinkModal}
          linkText={linkText}
          linkUrl={linkUrl}
          onLinkTextChange={setLinkText}
          onLinkUrlChange={setLinkUrl}
          onInsert={insertLink}
        />
      </Popover>

      {/* YouTube modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
            <p className="font-semibold text-base">Embed YouTube Video</p>

            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL (e.g. https://youtu.be/abc123)"
              className="border rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-[#186D0F]"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowYoutubeModal(false);
                  setYoutubeUrl("");
                }}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={insertYoutube}
                className="px-4 py-2 text-sm rounded-lg bg-[#186D0F] text-white"
              >
                Embed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="mt-[30px]">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full resize-none overflow-hidden text-4xl font-semibold text-gray-900 border-none focus:ring-0 outline-none placeholder-gray-400"
          placeholder="Untitled"
        />
      </div>

      {/* Excerpt */}
      <div className="mx-auto mt-2 w-full">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full resize-none text-sm text-gray-600 border-none focus:ring-0 outline-none placeholder-gray-400"
          placeholder="Write a short excerpt..."
        />
      </div>

      {/* Cover image */}
      <CoverImageUpload
        coverImage={coverImage || ""}
        isUploading={isUploading}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />

      {/* Content */}
      <BlogContent editor={editor} title={title} onTitleChange={setTitle} />

      {/* Save status */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-xs text-gray-400">
          {isSaving
            ? "Saving..."
            : lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString()}`
              : ""}
        </span>
      </div>
    </div>
  );
}