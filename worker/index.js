import {Worker, Queue} from "bullmq";
import IORedis from "ioredis";
import path from "node:path";
import {PrismaClient} from "@prisma/client";
import {getAccount} from "../lib/tokens.js";
import {uploadYouTubeVideo, getYouTubeAccessToken} from "../lib/youtube.js";
import {initTikTokDirectPost, uploadTikTokFile, queryTikTokPost} from "../lib/tiktok.js";

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL,{maxRetriesPerRequest:null});
const queue = new Queue("social-posts",{connection});

function localVideoPath(videoName) {
  return path.join(process.cwd(), "public", "uploads", videoName);
}

async function publishTarget(target) {
  const post = target.post;
  if (!target.accountId) throw new Error(`Akun ${target.platform} belum terhubung`);
  const account = await getAccount(target.accountId);
  const filePath = localVideoPath(post.videoName);

  if (target.platform === "youtube") {
    const token = await getYouTubeAccessToken(account, prisma);
    const result = await uploadYouTubeVideo({
      accessToken:token,
      filePath,
      title:post.videoName.replace(/\.[^.]+$/,""),
      description:post.caption || "",
      schedule: post.schedule,
      privacyStatus: new Date(post.schedule) > new Date() ? "private" : "public"
    });
    await prisma.postTarget.update({
      where:{id:target.id},
      data:{status:"published",externalPostId:result.videoId,publishedAt:new Date(),errorMessage:null}
    });
    return;
  }

  if (target.platform === "tiktok") {
    const stat = await fsStat(filePath);
    const init = await initTikTokDirectPost({
      accessToken:account.accessToken,
      videoSize:stat.size,
      caption:post.caption || ""
    });
    const publishId = init.data?.publish_id;
    const uploadUrl = init.data?.upload_url;
    if (!publishId || !uploadUrl) throw new Error(`TikTok init tidak lengkap: ${JSON.stringify(init)}`);
    await uploadTikTokFile({accessToken:account.accessToken,uploadUrl,filePath});
    await prisma.postTarget.update({
      where:{id:target.id},
      data:{status:"processing",externalPostId:publishId,errorMessage:null}
    });
    await queue.add("tiktok-status",{targetId:target.id},{delay:8000,attempts:3,backoff:{type:"exponential",delay:5000},removeOnComplete:true});
    return;
  }

  throw new Error(`Platform ${target.platform} belum memiliki publishing engine`);
}

async function fsStat(filePath) {
  const fs = await import("node:fs/promises");
  return fs.stat(filePath);
}

const worker = new Worker("social-posts", async job => {
  const target = await prisma.postTarget.findUnique({
    where:{id:job.data.targetId}, include:{post:true}
  });
  if (!target) throw new Error("Target tidak ditemukan");

  if (job.name === "tiktok-status") {
    const account = await getAccount(target.accountId);
    const result = await queryTikTokPost(account.accessToken,target.externalPostId);
    const status = String(result.data?.status || "").toUpperCase();
    if (status.includes("COMPLETE") || status === "PUBLISHED") {
      await prisma.postTarget.update({where:{id:target.id},data:{status:"published",publishedAt:new Date(),errorMessage:null}});
      return;
    }
    if (status.includes("FAIL") || status.includes("ERROR")) {
      throw new Error(`TikTok publish gagal: ${JSON.stringify(result)}`);
    }
    await prisma.postTarget.update({where:{id:target.id},data:{status:"processing",errorMessage:null}});
    await queue.add("tiktok-status",{targetId:target.id},{delay:10000,attempts:1,removeOnComplete:true});
    return;
  }

  await prisma.postTarget.update({
    where:{id:target.id},
    data:{status:"processing",attempts:{increment:1},errorMessage:null}
  });
  try {
    await publishTarget(target);
  } catch (e) {
    await prisma.postTarget.update({
      where:{id:target.id},
      data:{status:"retrying",errorMessage:e.message}
    });
    throw e;
  }
},{connection,concurrency:2});

worker.on("completed",j=>console.log("completed",j.id,j.name));
worker.on("failed",(j,e)=>console.error("failed",j?.id,j?.name,e.message));
