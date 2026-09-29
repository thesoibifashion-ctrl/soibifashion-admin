import {  Menu } from "lucide-react";

interface BlogDetailsProps {
    blog: {
      id: string;
      title: string;
      content: string;
      coverMedia: string;
      status:  "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIGHLIGHTED";
      tag?: {
        id: string;
        name: string;
      };
    };
  }
  

  
export default function MobileBlogPreview({ blog }: BlogDetailsProps) {
  return (
    <div className="bg-[#FBFBFB]">
      <div className="mt-[51px] w-full mx-auto">
      <div className=" max-w-full w-[390px] shadow-[3.19px_3.19px_15.97px_0px_#00000008] bg-[#191919] min-h-[80vh] mx-auto rounded-[23px]">
      {/* Header */}
      <div className="flex w-full justify-between items-center px-4 py-[26px]">
            <div className="">
              <p className="font-semibold text-white  text-base">AedionAI</p>
            </div>
            <div className="flex gap-4  ">
             <Menu color="white"/>

             
            </div>
          </div>
          {/* Body */}
          <div className=" flex flex-col bg- justify-center items-center">
            <div className="blog-background bg-cover bg-top w-full flex flex-col justify-center items-center text-center py-20 px-6 ">
              <h1 className=" font-semibold text-[38px] text-[#FFFFFF] leading-[110%] ">
                {blog.title}
              </h1>

              <p className="font-medium text-xl text-[#DCDCDC] mt-2 text-center ">
                Effective Date:{" "}
                <span className="font-normal"> June 18, 2025</span>
              </p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="px-4">
            {blog.coverMedia ? (
              <img
                src={blog.coverMedia}
                alt={blog.title}
                className="w-full h-[308px] mt-[31px] rounded-[19px] object-cover"
              />
            ) : (
              <div className="w-full h-[308px] mt-[31px] rounded-[19px] bg-gray-400" />
            )}
          </div>

          {/* Content */}
          <div
              className="w-full px-4 max-w-full mx-auto mt-[30px]  font-normal text-lg text-[#DCDCDC]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </div>
      </div>
    </div>
  );
}
