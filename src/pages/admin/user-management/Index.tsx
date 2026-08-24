import {  useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import AcademyPage from "./academy/Index";
import ContactPage from "./contact/Index";

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "contact";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
     
      </div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-14.75 w-full"
      >
          <TabsList className="w-fit justify-start h-10! bg-[#F5F0EB] py-1 rounded-xl">
          <TabsTrigger
                           className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "

            value="contact">
            Contact
          </TabsTrigger>

          <TabsTrigger                 className="px-5 rounded-lg text-[#1C1917]!  text-sm data-active:bg-[white] data-active:shadow-sm! "
 value="Academy">
            Academy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <ContactPage />
        </TabsContent>

        <TabsContent value="Academy">
          <AcademyPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
