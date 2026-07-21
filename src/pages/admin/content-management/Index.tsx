import { Link, useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import NewsPage from "./new/Index";
import BlogPage from "./blog/Index";
import { PlusCircle } from "lucide-react";

const ContentManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "news";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params);
  };

  return (
    <div>
     <div className="mt-6 flex justify-between items-center">
     <p className=" text-2xl font-semibold text-[#1A1B1D]">Content management</p>
     <Link to={`/content-management/edit-content/${activeTab}`} className="px-4 py-1 bg-[#186D0F] rounded-[20px] text-white flex items-center gap-2"><PlusCircle size={14}/>New blog</Link>
     </div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-14.75 w-full"
      >
        <TabsList className="flex gap-6 bg-transparent">
          <TabsTrigger className="tab-trigger" value="news">
            News
          </TabsTrigger>

          <TabsTrigger className="tab-trigger" value="blog">
            Blog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <NewsPage />
        </TabsContent>

        <TabsContent value="blog">
          <BlogPage />
        </TabsContent>

     
      </Tabs>
    </div>
  );
};

export default ContentManagement;