import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {queue} from "../../../lib/queue.js";
import {PLATFORMS, validateCaption, validateVideoName} from "../../../lib/validation.js";
const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy:{schedule:"asc"},
    include:{targets:{include:{account:true}}}
  });
  return NextResponse.json(posts);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {videoName, videoUrl, caption="", schedule, platforms, accountIds={}} = body;
    if (!videoName || !Array.isArray(platforms) || platforms.length === 0 || !schedule)
      return NextResponse.json({error:"videoName, platforms dan schedule wajib diisi"},{status:400});

    validateVideoName(videoName);
    const uniquePlatforms=[...new Set(platforms)];
    for(const p of uniquePlatforms){
      if(!PLATFORMS.includes(p)) return NextResponse.json({error:`Platform tidak didukung: ${p}`},{status:400});
      validateCaption(p,caption);
      if(!accountIds[p]) return NextResponse.json({error:`Akun ${p} wajib dipilih`},{status:400});
    }

    const when = new Date(schedule);
    if(Number.isNaN(when.getTime())) return NextResponse.json({error:"schedule tidak valid"},{status:400});
    if(when.getTime() < Date.now()-30_000) return NextResponse.json({error:"Jadwal harus di masa depan"},{status:400});

    for(const p of uniquePlatforms){
      const account=await prisma.socialAccount.findFirst({where:{id:accountIds[p],platform:p}});
      if(!account) return NextResponse.json({error:`Akun ${p} tidak valid atau tidak terhubung`},{status:400});
    }

    const post=await prisma.post.create({
      data:{
        videoName,videoUrl:videoUrl||null,caption:caption||null,schedule:when,
        targets:{create:uniquePlatforms.map(platform=>({platform,accountId:accountIds[platform]}))}
      },
      include:{targets:true}
    });

    for(const target of post.targets){
      await queue.add("publish",{targetId:target.id},{
        delay:Math.max(0,when.getTime()-Date.now()),
        attempts:3,
        backoff:{type:"exponential",delay:30_000},
        removeOnComplete:true,
        removeOnFail:false
      });
    }
    return NextResponse.json({ok:true,post});
  }catch(e){
    return NextResponse.json({error:e.message},{status:500});
  }
}
