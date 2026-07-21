import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverImageUploadProps {
  coverImage: string | null;
  isUploading?: boolean;
  isLoading?: boolean;
  getRootProps: any;
  getInputProps: any;
}

export function CoverImageUpload({
  coverImage,
  isUploading,
  isLoading,
  getRootProps,
  getInputProps,
}: CoverImageUploadProps) {
  if (isLoading) {
    return (
      <div  className="mt-10">
        <Skeleton />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 w-full lg:w-[80vww] mx-auto mt-6 h-[462px] flex flex-col justify-center items-center border-dashed rounded-lg text-center bg-[#FBFBFB] cursor-pointer transition border-[#E1E1E1]`}
    >
      <input {...getInputProps()} />
      {coverImage ? (
        <div className="w-full h-full">
          <img
            src={coverImage}
            alt="Cover"
            className="mx-auto rounded-md h-full w-full object-cover"
          />
        </div>
      ) : (
        <div>
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
            </div>
          ) : (
            <div className="w-[458px] mx-auto">
              <p className="font-medium text-2xl text-[#121212]">
                Drag and drop featured media, or browse{" "}
              </p>
              <p className="font-normal w-[413px] text-center text-[15px] mt-3 text-[#121212B2]">
                Add an image (png, jpg, gif) or video (mp4) to serve as your
                featured media—the first thing people will view at the top of
                your blog.
              </p>
              <p className="font-normal text-base text-[#121212B2] mt-3">
                Recommended: 1420 × 760 (max 20MB)
              </p>
              <Button
                variant="ghost"
                className="px-4 py-2 mt-[25px] rounded-[100px] font-medium text-base text-[#121212] bg-[#EFEFEF]"
              >
                Add media
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}