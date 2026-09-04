import {NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import {postQueue} from "../../../lib/queue";

export async function POST(req){
  try{
    const {targetId}=await req.json();
    if(!targetId) return NextResponse.json({error:"targetId wajib"},{status:400});
    const t=await prisma.postTarget.findUnique({where:{id:targetId},include:{post:true}});
    if(!t) return NextResponse.json({error:"Target tidak ditemukan"},{status:404});
    if(t.status==="published") return NextResponse.json({error:"Post sudah published"},{status:409});
    const updated=await prisma.postTarget.update({
      where:{id:targetId},
      data:{status:"scheduled",errorMessage:null}
    });
    await postQueue.add("publish", {postId:t.postId,targetId:t.id},{attempts:3,backoff:{type:"exponential",delay:30000},removeOnComplete:true,removeOnFail:false});
    return NextResponse.json({ok:true,target:updated});
  }catch(e){return NextResponse.json({error:e.message},{status:500});}
}
