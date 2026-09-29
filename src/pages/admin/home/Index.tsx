
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import LatestCollectionPage from "./LatestCollection";
import GalleryPage from "./Gallery";
import AboutPage from "./About";
import BrandValues from "./BrandValues";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "Collection";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex justify-between items-center"></div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-14.75 w-full"
      >
        <TabsList className="w-fit justify-start h-10! bg-[#F5F0EB] py-1 rounded-xl">
          {/* <TabsTrigger
            className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
            value="contact"
          >
            Hero Video
          </TabsTrigger> */}

          <TabsTrigger
            className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
            value="Collection"
          >
            Latest Collection
          </TabsTrigger>
          <TabsTrigger
            className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
            value="Gallery"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger
            className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
            value="About"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
            value="Brand"
          >
            Brand Values
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="contact">
          <HeroPages />
        </TabsContent> */}

        <TabsContent value="Collection">{/* <AcademyPage /> */}<LatestCollectionPage/></TabsContent>
        <TabsContent value="Gallery">{/* <AcademyPage /> */}<GalleryPage/></TabsContent>
        <TabsContent value="About">{/* <AcademyPage /> */}<AboutPage/></TabsContent>
        <TabsContent value="Brand">{/* <AcademyPage /> */}<BrandValues/></TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
