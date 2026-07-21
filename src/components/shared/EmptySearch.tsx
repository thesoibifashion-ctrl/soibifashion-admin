import emptyfile from "@/assets/images/nofile.png";

interface EmptyProps{
    text:string
    children?:React.ReactNode
}
const EmptySearch = ({text,children}: EmptyProps) => {
  return (
    <div className="flex justify-center flex-col items-center">
      <img className="w-100 " src={emptyfile} />
      <p className="font-medium text-base">{text}</p>
      {children}
    </div>
  );
};

export default EmptySearch;
