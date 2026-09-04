import {prisma} from "@/lib/prisma";
export async function GET(){
  const items=await prisma.post.findMany({include:{targets:{include:{account:{select:{displayName:true,platform:true}}}}},orderBy:{createdAt:"desc"},take:100});
  return Response.json({items});
}
