import Cards from "./Cards";

const UsersPage = () => {


  return (
    <div>
      <div className="mt-8">
        {" "}
        <p className=" text-2xl font-semibold text-[#1A1B1D]">
          Good Morning, SSoibi
        </p>
        <p className=" text-lg mt-1 font-normal text-[#1A1B1D]">
          Here's what's happening with your business today.
        </p>
      </div>
     <div >
     <Cards />
  
     </div>
   
    </div>
  );
};

export default UsersPage;
