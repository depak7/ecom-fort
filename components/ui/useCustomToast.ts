import { toast, ToasterProps } from "sonner";

export default function UseCustomToast(){
    const showToast=(message:string,options?:ToasterProps)=>
    {
      toast(message, { duration: 1000 })
    }
    const successToast=(message:string,options?:ToasterProps)=>{
      toast.success(message, { duration: 1000 })
    }
    const errorToast=(message:string,options?:ToasterProps)=>{
      toast.error(message, { duration: 1000 })
    }

    return {showToast,errorToast,successToast}
}

