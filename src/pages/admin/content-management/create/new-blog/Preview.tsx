"use client";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/images/logos/bloglogo.svg";
import arrow from "@/assets/images/logos/arrow.svg";
export default function PreviewBlog() {

 

 


  return (
  
    <div className="bg-[#FBFBFB] ">
      <div className="mt-[51px] w-full mx-auto">
        <div className="w-full max-w-full lg:w-[1150px] shadow-[3.19px_3.19px_15.97px_0px_#00000008]  bg-[white] min-h-[80vh] mx-auto rounded-[23px] ">
          <div className="px-[60px] py-6 flex justify-between items-center ">
            <div>
              <img src={logo} />
            </div>
            <div className="flex gap-5">
              <p className="font-medium text-xs text-[#0B0B0B]">Services</p>
              <p className="font-medium text-xs text-[#0B0B0B]">Resources</p>
              <p className="font-medium text-xs text-[#0B0B0B]">Partnership</p>
              <p className="font-medium text-xs text-[#0B0B0B]">About us</p>
            </div>
            <div>
              <button className="flex items-center gap-2 bg-[#005FAD] rounded-[78.86px] pl-3 pr-[6px] font-mdeium text-xs text-white py-3">
                Contact us
                <img src={arrow} />
              </button>
            </div>
          </div>

          <div className="px-[60px] mt-10">
            <button className="bg-[#F2F2F2] rounded-[78.86px] py-[9px] px-4 font-medium text-xs text-[#0D0D0D]">
              <Link to="/" className="flex items-center gap-[6.39px]">
                <ArrowLeft size={12} /> <span>Go back</span>
              </Link>
            </button>
            <h1 className="w-full max-w-full lg:w-[719.5px] font-medium text-[43px] leading-[110%] mt-10 ">
           assa
            </h1>
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm text-[#00000080]">as</p>
              {/* {
                blog.coverMedia ?
                <div className="rounded-full px-5 p-[2px] ">
                <img src={blog.coverMedia} />
              </div>
              :
              <div className="rounded-full p-[2px] bg-[#00000080]">
              </div>
              } */}
              <p className="font-medium text-sm text-[#00000080]">
                June 18, 2025
              </p>
            </div>
          </div>
          <div className="px-1">
            <div className="w-full h-[391px] mt-[31px] rounded-[19px] bg-gray-400"></div>
          </div>
          <div
  className="w-full max-w-full lg:w-[731px] mx-auto mt-[30px] prose prose-lg text-[#0D0D0D]"
  dangerouslySetInnerHTML={{ __html: "njsaknsafjks" }}
/>

        </div>
      </div>
    </div>
  );
}
