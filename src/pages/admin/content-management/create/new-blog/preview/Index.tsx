"use client";

import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  X } from "lucide-react";
import Container from "@/components/shared/inputs/Container";

const BlogPreviews = () => {

 

  return (
    <Container className="w-full">
      <Tabs defaultValue="preview" className="w-full flex justify-center">
        <div className="flex justify-between p-8">
          <Link to={`/new-blog`}> 
            <X />
          </Link>
          <TabsList className="flex w-full bg-transparent justify-center gap-4 ">
            <div className="flex gap-6">
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-[#5C3DFF] data-[state=active]:text-white w-10 h-10 rounded-full text-[#42455199] bg-transparent"
              >
                {/* <FaDesktop /> */}des
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-[#5C3DFF] data-[state=active]:text-white w-10 h-10 rounded-full text-[#42455199] "
              >
                {/* <CiMobile1 />mob */}mob
              </TabsTrigger>
            </div>
          </TabsList>
          <div />
        </div>

        <TabsContent value="preview">
          {/* <BlogPreview blog={blog} /> */}mobile
        </TabsContent>

        <TabsContent value="mobile">
          {/* <MobileBlogPreview blog={blog} /> */}desk
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default BlogPreviews;
