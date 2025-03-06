import { toast, ToasterProps } from "sonner";

export default function UseCustomToast(){
    const showToast=(message:string,options?:ToasterProps)=>
    {
      toast(message, { duration: 2000 })
    }
    const successToast=(message:string,options?:ToasterProps)=>{
      toast.success(message, { duration: 2000 })
    }
    const errorToast=(message:string,options?:ToasterProps)=>{
      toast.error(message, { duration: 2000 })
    }

    return {showToast,errorToast,successToast}
}

