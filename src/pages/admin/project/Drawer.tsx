import FormInput from "@/components/shared/inputs/FormInput";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Data } from "@/data/table-colums/project.column";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { apiPost, apiUpdate } from "@/api/mutation";
import SuccessModal from "@/components/shared/modals/SuccessModal";
import { Loader2 } from "lucide-react";
import MessageInput from "@/components/shared/inputs/MessageInput";

const ProjectDrawerContent = (props: Partial<Data>) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

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
      setCoverImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  function CreateProject(payload: Record<string, any>) {
    return apiPost("/project", payload);
  }
  function updateProject(payload: Record<string, any>) {
    return apiUpdate(`/project/${props._id}`, payload);
  }
  const { mutate: createProject, isPending: createPending } = useMutation({
    mutationFn: CreateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setShowModal(true);
    },
  });
  const { mutate: editProject, isPending: updatePending } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setShowModal(true);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      community: formData.get("community"),
      coverImage: formData.get("coverImage") || props.coverImage,
      date: formData.get("date"),
    };

    if (props?._id) {
      editProject(payload);
    } else {
      createProject(payload);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
        <FormInput
          placeholder="Add title"
          name="title"
          label="Title"
          type="text"
          defaultValue={props?.title || ""}
        />

        <FormInput
          placeholder="Add community"
          name="community"
          label="Community"
          type="text"
          defaultValue={props?.community || ""}
        />

        <MessageInput
          placeholder="Add description"
          name="description"
          label="Description"
          rows={5}
          defaultValue={props?.description || ""}
        />
        <input type="hidden" name="coverImage" value={coverImageUrl} />

        <Field className="mx-auto w-full ">
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="justify-start h-10 font-normal"
              >
                {date ? date.toLocaleDateString() : props?.date || ""}{" "}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                defaultMonth={date}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setDatePopoverOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-[#404944]">
            Cover Image
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading && <p className="text-sm text-[green]">Uploading...</p>}

          {coverImageUrl || props?.coverImage ? (
            <img
              src={coverImageUrl || props.coverImage}
              alt="Cover"
              onClick={openFilePicker}
              className="w-full h-60 object-top object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
            />
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="w-full h-60 object-top rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500 hover:border-[#186D0F] hover:text-[#186D0F]"
            >
              Upload Image
            </button>
          )}
        </div>

        <input
          type="hidden"
          name="date"
          value={date ? date.toISOString() : ""}
        />
        <button
          className="py-3 w-full text-[#FFFFFF] bg-[#186D0F] rounded-[16px]"
          type="submit"
          disabled={isUploading}
        >
          {props._id ? (
            <span className="flex items-center justify-center">
              {updatePending ? <Loader2 className="animate-spin" /> : "Update"}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {createPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </span>
          )}
        </button>
      </form>
      <SuccessModal
        open={showModal}
        onOpenChange={setShowModal}
        title={
          props._id
            ? "Project successfully updated"
            : "Project successfully created"
        }
        description={`Congratulation! Your Project has been ${
          props._id ? "updated" : "created"
        } successfully.`}
      />
    </div>
  );
};

export default ProjectDrawerContent;
