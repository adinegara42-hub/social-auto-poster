import {prisma} from "@/lib/prisma";
export async function GET(){
  return Response.json({items:await prisma.socialAccount.findMany({select:{id:true,platform:true,externalId:true,displayName:true,expiresAt:true,createdAt:true},orderBy:{createdAt:"desc"}})});
}
