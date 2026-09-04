export const dynamic = "force-dynamic";
import {NextResponse} from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(){
  try{
    const rows=await prisma.analyticsSnapshot.findMany({
      orderBy:{capturedAt:"desc"}, take:100,
      include:{post:{select:{videoName:true,schedule:true}}}
    });
    return NextResponse.json(rows);
  }catch(e){
    return NextResponse.json({error:e.message},{status:500});
  }
}
