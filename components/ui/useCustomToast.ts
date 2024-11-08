import { toast, ToasterProps } from "sonner";

export default function UseCustomToast(){
    const showToast=(message:string,options?:ToasterProps)=>
    {
      toast(message)
    }
    const successToast=(message:string,options?:ToasterProps)=>{
      toast.success(message)
    }
    const errorToast=(message:string,options?:ToasterProps)=>{
      toast.error(message)
    }

    return {showToast,errorToast,successToast}
}

