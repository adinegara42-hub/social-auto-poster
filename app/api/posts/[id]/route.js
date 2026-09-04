export const dynamic = "force-dynamic";
import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(_req,{params}){
  const post=await prisma.post.findUnique({
    where:{id:params.id},
    include:{targets:{include:{account:true}}}
  });
  if(!post) return NextResponse.json({error:"Post tidak ditemukan"},{status:404});
  return NextResponse.json(post);
}

export async function DELETE(_req,{params}){
  const post=await prisma.post.findUnique({where:{id:params.id},include:{targets:true}});
  if(!post) return NextResponse.json({error:"Post tidak ditemukan"},{status:404});
  const locked=post.targets.some(t=>["processing","published"].includes(t.status));
  if(locked) return NextResponse.json({error:"Post sudah diproses dan tidak dapat dihapus"},{status:409});
  await prisma.post.delete({where:{id:params.id}});
  return NextResponse.json({ok:true});
}
