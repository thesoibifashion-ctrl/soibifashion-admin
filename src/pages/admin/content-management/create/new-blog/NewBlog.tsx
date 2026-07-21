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

// import { data, useNavigate, useParams } from "react-router-dom";
// import { Popover, PopoverTrigger } from "@/components/ui/popover";
// import { useDropzone } from "react-dropzone";
// import { Audio } from "./Audio";
// import { Video } from "./video";
// import { LinkModal } from "./LinkModal";
// import { CoverImageUpload } from "./CoverImageUpload";
// import { BlogContent } from "./BlogContent";
// import { EditorToolbar } from "./EditorToolBar";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { apiPost, apiUpdate } from "@/api/mutation";
// import { apiGet } from "@/api/query";
// import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
// import { Loader2, X } from "lucide-react";
// import ContentAction from "../../Actions";
// import EditContentActions from "../../EditContentActions";

// type BlogStatus = "draft" | "published";

// export default function NewBlog() {
//   const [showLinkModal, setShowLinkModal] = useState(false);
//   const [linkText, setLinkText] = useState("");
//   const [linkUrl, setLinkUrl] = useState("");
//   const [title, setTitle] = useState("");
//   const [status, setStatus] = useState("");
//   const [coverImage, setCoverImage] = useState<string | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string>("");

//   const navigate = useNavigate();
//   const { id: routeId } = useParams<{ id?: string }>();
//   const { tab } = useParams<{ tab: string }>();

//   // internal id, seeded from the URL. Autosave updates this WITHOUT
//   // navigating, so creating a post via autosave doesn't yank the user
//   // away from what they're typing. Manual Save/Publish still navigates.
//   const [blogId, setBlogId] = useState<string | undefined>(routeId);

//   const [isUploading, setIsUploading] = useState(false);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   const queryClient = useQueryClient();

//   const { data: postData, isLoading: isLoadingPost } = useQuery({
//     queryKey: ["blog", routeId],
//     queryFn: () => apiGet(`/posts/${routeId}`),
//     enabled: !!routeId, // only fetch when editing an existing post
//   });

//   // tracks whether anything has changed since the last successful save
//   const isDirty = useRef(false);
//   // makes sure the server data only overwrites local state ONCE, on
//   // initial load — not every time a background refetch happens
//   const hasPrefilled = useRef(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: { levels: [1, 2, 3, 4, 5] },
//       }),
//       Underline,
//       Audio,
//       Strike,
//       Video,
//       Link.configure({ openOnClick: false }),
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

//   useEffect(() => {
//     if (!postData?.data || !editor) return;
//     if (hasPrefilled.current) return;

//     setTitle(postData.data.title || "");
//     setCoverImage(postData.data.coverImage || null);
//     setSelectedTag(postData.data.tagId || "");
//     setStatus(postData.data.status || "");
//     editor.commands.setContent(postData.data.content || "");

//     isDirty.current = false;
//     hasPrefilled.current = true;
//   }, [postData, editor]);

//   function createBlogRequest(payload: Record<string, any>) {
//     return apiPost("/posts", payload);
//   }
//   function updateBlogRequest(payload: Record<string, any>) {
//     return apiUpdate(`/posts/${blogId}`, payload);
//   }

//   // Base onSuccess always runs: saves the id locally, never navigates.
//   // Manual Save/Publish passes an extra onSuccess (at the call sites)
//   // that also navigates. Autosave does not, so it never yanks the
//   // user's focus away while they're mid-typing.
//   const { mutate: createBlog, isPending: isCreating } = useMutation({
//     mutationFn: createBlogRequest,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["blog"] });
//       isDirty.current = false;
//       setLastSaved(new Date());
//       if (data?.data?.id) {
//         setBlogId(data.data.id);
//       }
//     },
//   });

//   const { mutate: editBlog, isPending: isUpdating } = useMutation({
//     mutationFn: updateBlogRequest,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["blog"] });
//       isDirty.current = false;
//       setLastSaved(new Date());
//     },
//   });

//   const isSaving = isCreating || isUpdating;

//   const insertLink = () => {
//     if (!linkText || !linkUrl) return;
//     const linkHTML = `<a href="${linkUrl}" class="text-[blue] underline hover:text-blue-800">${linkText}</a>`;
//     editor?.chain().focus().insertContent(linkHTML).run();
//     setShowLinkModal(false);
//     setLinkText("");
//     setLinkUrl("");
//   };

//   // single source of truth for every save — manual, autosave, cover
//   // upload, media insert — so no field ever gets silently dropped
//   const buildPayload = (nextStatus: BlogStatus) => {
//     const content = editor?.getHTML() || "";
//     return {
//       title: title || "Untitled",
//       content,
//       coverImage: coverImage || "",
//       tagId: selectedTag?.trim() ? selectedTag : undefined,
//       status: nextStatus || "draft",
//       author: "odi pearl",
//       type: tab,
//     };
//   };

//   const handleSaveBlog = (nextStatus: BlogStatus) => {
//     if (!title.trim()) return;
//     if (routeId && isLoadingPost) return;

//     const payload = buildPayload(nextStatus);

//     if (blogId) {
//       editBlog(payload, {
//         onSuccess: () => {
//           setStatus(nextStatus);
//         },
//       });
//     } else {
//       createBlog(payload, {
//         onSuccess: (data: any) => {
//           setStatus(nextStatus);
//           if (data?.data?.id) {
//             navigate(
//               `/content-management/edit-content/${tab}/${data.data.id}`,
//               { replace: true }
//             );
//           }
//         },
//       });
//     }
//   };

//   // mark dirty whenever title or cover image changes
//   useEffect(() => {
//     isDirty.current = true;
//   }, [title, coverImage]);

//   // autosave every 10s, only if something changed, there's a title,
//   // and (when editing) the original post has finished loading
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isDirty.current) return;
//       if (!title.trim()) return;
//       if (isSaving) return;
//       if (routeId && isLoadingPost) return;

//       const payload = buildPayload("draft");

//       if (blogId) {
//         editBlog(payload);
//       } else {
//         createBlog(payload, {
//           onSuccess: (data: any) => {
//             if (data?.data?.id) {
//               navigate(
//                 `/content-management/edit-content/${tab}/${data.data.id}`,
//                 { replace: true }
//               );
//             }
//           },
//         });
//       }
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [
//     title,
//     coverImage,
//     selectedTag,
//     blogId,
//     isSaving,
//     isLoadingPost,
//     routeId,
//   ]);

//   const onDrop = async (acceptedFiles: File[]) => {
//     if (!acceptedFiles || acceptedFiles.length === 0) return;

//     setIsUploading(true);
//     try {
//       const uploadedUrl = await uploadToCloudinary(acceptedFiles[0]);
//       setCoverImage(uploadedUrl);

//       const payload = {
//         ...buildPayload((status as BlogStatus) || "draft"),
//         coverImage: uploadedUrl, // override with the just-uploaded url
//       };

//       if (blogId) {
//         editBlog(payload);
//       } else {
//         createBlog(payload, {
//           onSuccess: (data: any) => {
//             if (data?.data?.id) {
//               navigate(
//                 `/content-management/edit-content/${tab}/${data.data.id}`,
//                 { replace: true }
//               );
//             }
//           },
//         });
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "image/*": [],
//       "video/*": [],
//       "audio/*": [],
//     },
//     maxSize: 20 * 1024 * 1024,
//   });

//   const handleInsertMedia = (type: "audio" | "video") => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = type === "audio" ? "audio/*" : "video/*";

//     input.onchange = async (e: Event) => {
//       const target = e.target as HTMLInputElement;
//       const file = target.files?.[0];
//       if (!file) return;

//       setIsUploading(true);
//       try {
//         const mediaUrl = await uploadToCloudinary(file);
//         if (!mediaUrl) throw new Error("Upload failed — no URL returned");

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

//         const payload = buildPayload((status as BlogStatus) || "draft");

//         if (blogId) {
//           editBlog(payload);
//         } else {
//           createBlog(payload, {
//             onSuccess: (data: any) => {
//               if (data?.data?.id) {
//                 navigate(
//                   `/content-management/edit-content/${tab}/${data.data.id}`,
//                   { replace: true }
//                 );
//               }
//             },
//           });
//         }
//       } catch (err) {
//         console.error("Media upload failed:", err);
//       } finally {
//         setIsUploading(false);
//       }
//     };

//     input.click();
//   };

//   const handleImageClick = () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = async (e: Event) => {
//       const target = e.target as HTMLInputElement;
//       const file = target.files?.[0];
//       if (!file) return;
//       setIsUploading(true);
//       try {
//         const imageUrl = await uploadToCloudinary(file);
//         editor?.chain().focus().setImage({ src: imageUrl }).run();
//       } catch (err) {
//         console.error("Image upload failed:", err);
//       } finally {
//         setIsUploading(false);
//       }
//     };
//     input.click();
//   };

//   return (
//     <div className="flex flex-col justify-center">
//       <div className="sticky top-0 z-50">
//         <div className="flex justify-between py-4 gap-2 bg-[#F1F1F1]">
//           <div className="flex items-center gap-2">
//             <a href="/content-management" className="bg-white rounded-full p-2">
//               <X size={14} />
//             </a>
//             <p>{status}</p>
//           </div>
//           <div>
//             {routeId && (
//               <div className="flex items-center gap-2">
//                 <div className="rounded-[20px] border border-[#E2E2E2] py-1 px-2">
//                   <EditContentActions contentId={routeId} />
//                 </div>
//                 <div>
//                   <button
//                     className="py-2 px-8.5 text-[#FFFFFF] bg-[#186D0F] rounded-full"
//                     disabled={isSaving}
//                     onClick={() => handleSaveBlog("published")}
//                   >
//                     {isSaving ? (
//                       <Loader2 className="animate-spin" />
//                     ) : (
//                       "Publish"
//                     )}{" "}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <EditorToolbar
//           editor={editor}
//           onLinkClick={() => setShowLinkModal(true)}
//           onImageClick={handleImageClick}
//           onAudioClick={() => handleInsertMedia("audio")}
//           onVideoClick={() => handleInsertMedia("video")}
//         />
//       </div>

//       <Popover open={showLinkModal} onOpenChange={setShowLinkModal}>
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
//           trigger={<div />}
//         />
//       </Popover>

//       <div className="mx-auto mt-[30px]">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value || "")}
//           className="w-full text-4xl font-semibold text-gray-900 border-none focus:ring-0 outline-none placeholder-gray-400"
//           placeholder="Untitled"
//         />
//       </div>

//       <CoverImageUpload
//         coverImage={coverImage || ""}
//         isUploading={isUploading}
//         getRootProps={getRootProps}
//         getInputProps={getInputProps}
//       />

//       <BlogContent editor={editor} title={title} onTitleChange={setTitle} />

//       <div className="flex items-center justify-between mt-6">
//         <span className="text-xs text-gray-400">
//           {isSaving
//             ? "Saving..."
//             : lastSaved
//             ? `Saved ${lastSaved.toLocaleTimeString()}`
//             : ""}
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
import { LinkModal } from "./LinkModal";
import { CoverImageUpload } from "./CoverImageUpload";
import { BlogContent } from "./BlogContent";
import { EditorToolbar } from "./EditorToolBar";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiUpdate } from "@/api/mutation";
import { apiGet } from "@/api/query";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Loader2, X } from "lucide-react";
import { statusBadge } from "@/lib/utils/statusBadge";

type BlogStatus = "draft" | "published";

export default function NewBlog() {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // raw comma-separated text the user types, e.g. "tech, news, ai"
  const [tagInput, setTagInput] = useState("");

  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id?: string }>();
  const { tab } = useParams<{ tab: string }>();

  // internal id, seeded from the URL. Autosave updates this WITHOUT
  // navigating, so creating a post via autosave doesn't yank the user
  // away from what they're typing. Manual Save/Publish still navigates.
  const [blogId, setBlogId] = useState<string | undefined>(routeId);

  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["blog", routeId],
    queryFn: () => apiGet(`/posts/${routeId}`),
    enabled: !!routeId, // only fetch when editing an existing post
  });

  // tracks whether anything has changed since the last successful save
  const isDirty = useRef(false);
  // makes sure the server data only overwrites local state ONCE, on
  // initial load — not every time a background refetch happens
  const hasPrefilled = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5] },
      }),
      Underline,
      Audio,
      Strike,
      Video,
      Link.configure({ openOnClick: false }),
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
    onUpdate: () => {
      isDirty.current = true;
    },
  });

  useEffect(() => {
    if (!postData?.data || !editor) return;
    if (hasPrefilled.current) return;

    setTitle(postData.data.title || "");
    setCoverImage(postData.data.coverImage || null);
    setStatus(postData.data.status || "");
    editor.commands.setContent(postData.data.content || "");

    // tags come back as an array — join into the comma-separated
    // string the input field displays
    if (Array.isArray(postData.data.tags)) {
      setTagInput(postData.data.tags.join(", "));
    }

    isDirty.current = false;
    hasPrefilled.current = true;
  }, [postData, editor]);

  function createBlogRequest(payload: Record<string, any>) {
    return apiPost("/posts", payload);
  }
  function updateBlogRequest(payload: Record<string, any>) {
    return apiUpdate(`/posts/${blogId}`, payload);
  }

  // Base onSuccess always runs: saves the id locally, never navigates.
  // Manual Save/Publish passes an extra onSuccess (at the call sites)
  // that also navigates. Autosave does not, so it never yanks the
  // user's focus away while they're mid-typing.
  const { mutate: createBlog, isPending: isCreating } = useMutation({
    mutationFn: createBlogRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      isDirty.current = false;
      setLastSaved(new Date());
      if (data?.data?.id) {
        setBlogId(data.data.id);
      }
    },
  });

  const { mutate: editBlog, isPending: isUpdating } = useMutation({
    mutationFn: updateBlogRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      isDirty.current = false;
      setLastSaved(new Date());
    },
  });

  const isSaving = isCreating || isUpdating;

  const insertLink = () => {
    if (!linkText || !linkUrl) return;
    const linkHTML = `<a href="${linkUrl}" class="text-[blue] underline hover:text-blue-800">${linkText}</a>`;
    editor?.chain().focus().insertContent(linkHTML).run();
    setShowLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  // turns "tech, news,  ai" into ["tech", "news", "ai"] — trims
  // whitespace and drops empty entries from trailing/double commas
  const parseTags = (raw: string): string[] =>
    raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

  // single source of truth for every save — manual, autosave, cover
  // upload, media insert — so no field ever gets silently dropped
  const buildPayload = (nextStatus: BlogStatus) => {
    const content = editor?.getHTML() || "";
    return {
      title: title || "Untitled",
      content,
      coverImage: coverImage || "",
      tags: parseTags(tagInput),
      status: nextStatus || "draft",
      author: "odi pearl",
      type: tab,
    };
  };

  const handleSaveBlog = (nextStatus: BlogStatus) => {
    if (!title.trim()) return;
    if (routeId && isLoadingPost) return;

    const payload = buildPayload(nextStatus);

    if (blogId) {
      editBlog(payload, {
        onSuccess: () => {
          setStatus(nextStatus);
        },
      });
    } else {
      createBlog(payload, {
        onSuccess: (data: any) => {
          setStatus(nextStatus);
          if (data?.data?.id) {
            navigate(
              `/content-management/edit-content/${tab}/${data.data.id}`,
              { replace: true }
            );
          }
        },
      });
    }
  };

  // mark dirty whenever title, cover image, or tags change
  useEffect(() => {
    isDirty.current = true;
  }, [title, coverImage, tagInput]);

  // autosave every 10s, only if something changed, there's a title,
  // and (when editing) the original post has finished loading
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDirty.current) return;
      if (!title.trim()) return;
      if (isSaving) return;
      if (routeId && isLoadingPost) return;

      const payload = buildPayload("draft");

      if (blogId) {
        editBlog(payload);
      } else {
        createBlog(payload, {
          onSuccess: (data: any) => {
            if (data?.data?.id) {
              navigate(
                `/content-management/edit-content/${tab}/${data.data.id}`,
                { replace: true }
              );
            }
          },
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [title, coverImage, tagInput, blogId, isSaving, isLoadingPost, routeId]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(acceptedFiles[0]);
      setCoverImage(uploadedUrl);

      const payload = {
        ...buildPayload((status as BlogStatus) || "draft"),
        coverImage: uploadedUrl, // override with the just-uploaded url
      };

      if (blogId) {
        editBlog(payload);
      } else {
        createBlog(payload, {
          onSuccess: (data: any) => {
            if (data?.data?.id) {
              navigate(
                `/content-management/edit-content/${tab}/${data.data.id}`,
                { replace: true }
              );
            }
          },
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
    },
    maxSize: 20 * 1024 * 1024,
  });

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
        if (!mediaUrl) throw new Error("Upload failed — no URL returned");

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

        const payload = buildPayload((status as BlogStatus) || "draft");

        if (blogId) {
          editBlog(payload);
        } else {
          createBlog(payload, {
            onSuccess: (data: any) => {
              if (data?.data?.id) {
                navigate(
                  `/content-management/edit-content/${tab}/${data.data.id}`,
                  { replace: true }
                );
              }
            },
          });
        }
      } catch (err) {
        console.error("Media upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

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
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } catch (err) {
        console.error("Image upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="sticky top-0 z-50">
        <div className="flex justify-between py-4 gap-2 bg-[#F1F1F1]">
          <div className="flex items-center gap-2">
            <a href={`/content-management?tab=${tab}`} className="bg-white rounded-full p-2">
              <X size={14} />
            </a>
            {status && <p>{statusBadge(status)}</p>}
          </div>
          <div>
            {routeId && (
              <div className="flex items-center 2">
                {/* <div className="rounded-[20px] border border-[#E2E2E2] py-1 px-2">
                  <EditContentActions contentId={routeId} />
                </div> */}
                <div className="flex gap-3">
                <button
                    className="text-[black] rounded-full"
                    disabled={isSaving}
                    onClick={() => handleSaveBlog("draft")}
                  >
                      Save as draft
                  </button>
                  <button
                    className="py-2 px-8.5 text-[#FFFFFF] bg-[#186D0F] rounded-full"
                    disabled={isSaving}
                    onClick={() => handleSaveBlog("published")}
                  >
                    {isSaving || isUploading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Publish"
                    )}{" "}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <EditorToolbar
          editor={editor}
          onLinkClick={() => setShowLinkModal(true)}
          onImageClick={handleImageClick}
          onAudioClick={() => handleInsertMedia("audio")}
          onVideoClick={() => handleInsertMedia("video")}
        />
      </div>

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
          trigger={<div />}
        />
      </Popover>

      <div className=" mt-[30px]">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value || "")}
          className="w-full text-4xl font-semibold text-gray-900 border-none focus:ring-0 outline-none placeholder-gray-400"
          placeholder="Untitled"
        />
      </div>

      <div className="mx-auto mt-2 w-full ">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          className="w-full text-sm text-gray-600 border-none focus:ring-0 outline-none placeholder-gray-400"
          placeholder="Tags (comma separated, e.g. tech, news, ai)"
        />
      </div>

      <CoverImageUpload
        coverImage={coverImage || ""}
        isUploading={isUploading}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />

      <BlogContent editor={editor} title={title} onTitleChange={setTitle} />

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
