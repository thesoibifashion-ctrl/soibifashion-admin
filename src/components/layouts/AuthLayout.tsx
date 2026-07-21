import { Toaster } from "sonner";
import authImage from "../../assets/images/auth.png";
import logo from "../../assets/images/cephflogo.png";

interface AuthProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthProps) => {
  return (
    <div className="grid grid-cols-2 h-screen ">
      <div className="flex mt-40 justify-center">
        <div className="w-full max-w-full lg:w-112.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img className="w-14 h-14" src={logo} alt="logo" />
              <p className="font-semibold text-3xl lg:text-[38px] text-[#002E21]">
                CEPHF
              </p>
            </div>
            <p className="font-medium text-2xl lg:text-[32px] mt-4 text-[#1A1B1D]">
              {title}
            </p>
            {children}
           
          </div>
          <div className="pb-10 ">
            <div>
              <p className="font-normal text-xs text-[#00000099]">
                Powered by:
              </p>
              <div className="flex mt-1 items-center gap-2">
                <img className="w-5.5 h-5.5" src={logo} alt="logo" />
                <p className="font-semibold text-base text-[#002E21]">
                  CEPHF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url(${authImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height:'100vh'
        }}
      ></div>
      <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              success:
                "!bg-[#EAF7E9] !border !border-[#186D0F33] !text-[#186D0F]",
              error:
                "!bg-[#FDECEC] !border !border-[#DE0D0D33] !text-[#DE0D0D]",
            },
          }}
        />
    </div>
  );
};

export default AuthLayout;
