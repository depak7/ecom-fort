import { createStore } from "@/app/actions/store/action";
import { NextRequest } from "next/server";



export async function POST(req:NextRequest){

    const formData=await req.formData();

    const res=await createStore(formData);

}