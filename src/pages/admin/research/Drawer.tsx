import FormInput from "@/components/shared/inputs/FormInput";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { apiPost, apiUpdate } from "@/api/mutation";
import SuccessModal from "@/components/shared/modals/SuccessModal";
import { Loader2 } from "lucide-react";
import type { ResearchData } from "@/data/table-colums/research-column";
import MessageInput from "@/components/shared/inputs/MessageInput";

const ResearchDrawer = (props: ResearchData) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPdfUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  function CreateResearch(payload: Record<string, any>) {
    return apiPost("/posts", payload);
  }
  function updateProject(payload: Record<string, any>) {
    return apiUpdate(`/posts/${props._id}`, payload);
  }

  const { mutate: createResearch, isPending: createPending } = useMutation({
    mutationFn: CreateResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowModal(true);
    },
  });
  const { mutate: editProject, isPending: updatePending } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowModal(true);
    },
  });

  // turns "tech, news,  ai" into ["tech", "news", "ai"]
  const parseTags = (raw: string): string[] =>
    raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagInput = String(formData.get("tag") || "");

    const payload = {
      title: formData.get("title"),
      tags: parseTags(tagInput),
      author: formData.get("author"),
      content: formData.get("content"),
      status: "published",
      type:"research",

      // if no new file was uploaded, keep whatever pdf was already there
      pdfUrl: pdfUrl || props?.pdfUrl || "",
    };

    if (props?._id) {
      editProject(payload);
    } else {
      createResearch(payload);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <div className="mt-10">
          <div className="w-full  flex justify-end">
            <button
              className="py-2 w-fit px-6 flex items-end justify-end text-[#FFFFFF] bg-[#186D0F] rounded-[16px]"
              type="submit"
              disabled={isUploading}
            >
              {props._id ? (
                <span className="flex items-center justify-center">
                  {updatePending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {createPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <FormInput
            placeholder="Add title"
            name="title"
            label="Title"
            type="text"
            defaultValue={props?.title || ""}
          />

          <FormInput
            placeholder="Add category (comma separated)"
            name="tag"
            label="Category"
            type="text"
            defaultValue={
              Array.isArray(props?.tags)
                ? props.tags.join(", ")
                : props?.tags || ""
            }
          />
        </div>
        <FormInput
          placeholder="Add authors"
          name="author"
          label="Author(s)"
          type="text"
          defaultValue={props?.author || ""}
        />
        <MessageInput
          placeholder="Add text"
          name="content"
          label="Text"
          defaultValue={props?.content || ""}
          rows={4}
        />

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-[#404944]">Document</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading && <p className="text-sm text-[green]">Uploading...</p>}

          {pdfUrl || props?.pdfUrl ? (
            <div className="w-full h-[400px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={openFilePicker}
                className="text-sm  font-semibold text-[#186D0F]"
              >
                Change file
              </button>

              <iframe
                src={pdfUrl || props?.pdfUrl}
                className="w-full lg:w-[518px] h-[400px] lg:h-[400px]"
                title="PDF Viewer"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="w-full h-60 object-top rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500 hover:border-[#186D0F] hover:text-[#186D0F]"
            >
              Upload PDF
            </button>
          )}
        </div>
      </form>
      <SuccessModal
        open={showModal}
        onOpenChange={setShowModal}
        title={
          props._id
            ? "Research successfully updated"
            : "Research successfully created"
        }
        description={`Congratulation! Your research has been ${
          props._id ? "updated" : "created"
        } successfully.`}
      />
    </div>
  );
};

export default ResearchDrawer;
