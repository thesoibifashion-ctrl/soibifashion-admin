import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import BigCheck from '@/assets/images/checkbig.svg'
  type SuccessModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children?:React.ReactNode
  };
  
  const SuccessModal = ({
    open,
    onOpenChange,
    title = "Success!",
    description = "Your submission was received.",
    children
  }: SuccessModalProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
          <img className="w-20 h-20" src={BigCheck}/>
            <DialogTitle className="mt-2">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        {children}
         
        </DialogContent>
      </Dialog>
    );
  };
  
  export default SuccessModal;