
interface BlogDetailsProps {
  blog: {
    id: string;
    title: string;
    content: string;
    coverMedia: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIGHLIGHTED";
    tag?: {
      id: string;
      name: string;
    };
  };
}

export default function BlogPreview({ blog }: BlogDetailsProps) {
  return (
    <div className="bg-[]">
      <div className="mt-[51px] w-full mx-auto">
        <div className="w-full max-w-full lg:w-[1150px] shadow-[3.19px_3.19px_15.97px_0px_#00000008] bg-[#191919] min-h-[80vh] mx-auto rounded-[23px]">
          {/* Header */}
          <div className="flex w-full justify-between items-center px-20 py-[26px]">
            <div className="">
              <p className="font-semibold text-white  text-xl">AedionAI</p>
            </div>
            <div className="flex gap-4  ">
              <button className="px-4  py-2 cursor-pointer  bg-[linear-gradient(to_bottom,rgba(177,162,255,1)_1%,rgba(138,56,245,1)_10%,rgba(94,64,255,1)_100%)] font-semibold text-[16px] hover:shadow-[0_0_20px_rgba(138,56,245,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 rounded-full text-white ">
                Sign up
              </button>

              <button className="px-4  py-2 cursor-pointer bg-[linear-gradient(to_bottom,rgba(138,138,138,1)_0.2%,rgba(47,46,46,1)_10%,rgba(26,26,26,1)_100%)] text-[16px] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 rounded-[32px] font-semibold text-white border border-gray-800 ">
                Login
              </button>
            </div>
          </div>
          {/* Body */}
          <div className=" mt-10 flex flex-col bg- justify-center items-center">
            <div className="blog-background bg-cover bg-top w-full flex flex-col justify-center items-center text-center py-20 px-6 h-[350px]">
              <h1 className=" font-semibold text-[38px] text-[#FFFFFF] leading-[110%] mt-10">
                {blog.title}
              </h1>

              <p className="font-medium text-xl text-[#DCDCDC] mt-2 text-center ">
                Effective Date:{" "}
                <span className="font-normal"> June 18, 2025</span>
              </p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="px-20 pb-10">
            <div className="px-1">
              {blog.coverMedia ? (
                <img
                  src={blog.coverMedia}
                  alt={blog.title}
                  className="w-full h-[391px] mt-[31px] rounded-[19px] object-cover"
                />
              ) : (
                <div className="w-full h-[391px] mt-[31px] rounded-[19px] bg-gray-400" />
              )}
            </div>
            <div>
              <p className="font-semibold  text-2xl text-[#FFFFFF] mt-5">
                {blog.title}
              </p>
            </div>

            {/* Content */}
            <div>
            <div
                className="w-full max-w-full mx-auto mt-[30px]  font-normal text-lg text-[#DCDCDC]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
