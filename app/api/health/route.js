import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(){
  const started=Date.now();
  try{
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ok:true,database:"ok",latencyMs:Date.now()-started,time:new Date().toISOString()});
  }catch(e){
    return NextResponse.json({ok:false,database:"error",error:e.message},{status:503});
  }
}
