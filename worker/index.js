import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  getAccount,
  refreshTikTokAccount
} from "../lib/tokens.js";

import {
  uploadYouTubeVideo,
  getYouTubeAccessToken
} from "../lib/youtube.js";

import {
  initTikTokDirectPost,
  uploadTikTokFile,
  queryTikTokPost
} from "../lib/tiktok.js";

const prisma = new PrismaClient();

const connection = new IORedis(
  process.env.REDIS_URL,
  {
    maxRetriesPerRequest: null
  }
);

const queue = new Queue(
  "social-posts",
  {
    connection
  }
);

function localVideoPath(videoName) {
  return path.join(
    process.cwd(),
    "public",
    "uploads",
    videoName
  );
}

function isTikTok401(error) {
  return (
    error?.message?.includes("access_token_invalid") ||
    error?.message?.includes("TikTok API gagal: 401")
  );
}

async function publishTikTok(target, account) {
  const post = target.post;

  if (!post.videoUrl) {
    throw new Error("URL video tidak tersedia");
  }

  try {
    return await initTikTokDirectPost({
      accessToken: account.accessToken,
      videoUrl: post.videoUrl,
      caption: post.caption || ""
    });
  } catch (error) {
    if (!isTikTok401(error)) {
      throw error;
    }

    console.log(
      "TikTok access token invalid. Mencoba refresh token..."
    );

    const refreshed = await refreshTikTokAccount(
      target.accountId
    );

    console.log(
      "TikTok access token berhasil diperbarui."
    );

    return await initTikTokDirectPost({
      accessToken: refreshed.accessToken,
      videoUrl: post.videoUrl,
      caption: post.caption || ""
    });
  }
}

async function queryTikTokWithRefresh(target, account) {
  try {
    return await queryTikTokPost(
      account.accessToken,
      target.externalPostId
    );
  } catch (error) {
    if (!isTikTok401(error)) {
      throw error;
    }

    console.log(
      "TikTok status check mendapat 401. Mencoba refresh token..."
    );

    const refreshed = await refreshTikTokAccount(
      target.accountId
    );

    return await queryTikTokPost(
      refreshed.accessToken,
      target.externalPostId
    );
  }
}

async function publishTarget(target) {
  const post = target.post;

  if (!target.accountId) {
    throw new Error(
      `Akun ${target.platform} belum terhubung`
    );
  }

  const account = await getAccount(
    target.accountId
  );

  const filePath = localVideoPath(
    post.videoName
  );

  if (target.platform === "youtube") {
    const token = await getYouTubeAccessToken(
      account,
      prisma
    );

    const result = await uploadYouTubeVideo({
      accessToken: token,
      filePath,
      title: post.videoName.replace(
        /\.[^.]+$/,
        ""
      ),
      description: post.caption || "",
      schedule: post.schedule,
      privacyStatus:
        new Date(post.schedule) > new Date()
          ? "private"
          : "public"
    });

    await prisma.postTarget.update({
      where: {
        id: target.id
      },
      data: {
        status: "published",
        externalPostId: result.videoId,
        publishedAt: new Date(),
        errorMessage: null
      }
    });

    return;
  }

  if (target.platform === "tiktok") {
    const init = await publishTikTok(
      target,
      account
    );

    const publishId =
      init.data?.publish_id;

    if (!publishId) {
      throw new Error(
        `TikTok init tidak lengkap: ${JSON.stringify(init)}`
      );
    }

    await prisma.postTarget.update({
      where: {
        id: target.id
      },
      data: {
        status: "processing",
        externalPostId: publishId,
        errorMessage: null
      }
    });

    await queue.add(
      "tiktok-status",
      {
        targetId: target.id
      },
      {
        delay: 8000,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        },
        removeOnComplete: true
      }
    );

    return;
  }

  throw new Error(
    `Platform ${target.platform} belum memiliki publishing engine`
  );
}

const worker = new Worker(
  "social-posts",
  async job => {
    const target =
      await prisma.postTarget.findUnique({
        where: {
          id: job.data.targetId
        },
        include: {
          post: true
        }
      });

    if (!target) {
      throw new Error(
        "Target tidak ditemukan"
      );
    }

    if (job.name === "tiktok-status") {
      const account = await getAccount(
        target.accountId
      );

      const result =
        await queryTikTokWithRefresh(
          target,
          account
        );

      const status = String(
        result.data?.status || ""
      ).toUpperCase();

      if (
        status.includes("COMPLETE") ||
        status === "PUBLISHED"
      ) {
        await prisma.postTarget.update({
          where: {
            id: target.id
          },
          data: {
            status: "published",
            publishedAt: new Date(),
            errorMessage: null
          }
        });

        return;
      }

      if (
        status.includes("FAIL") ||
        status.includes("ERROR")
      ) {
        throw new Error(
          `TikTok publish gagal: ${JSON.stringify(result)}`
        );
      }

      await prisma.postTarget.update({
        where: {
          id: target.id
        },
        data: {
          status: "processing",
          errorMessage: null
        }
      });

      await queue.add(
        "tiktok-status",
        {
          targetId: target.id
        },
        {
          delay: 10000,
          attempts: 1,
          removeOnComplete: true
        }
      );

      return;
    }

    await prisma.postTarget.update({
      where: {
        id: target.id
      },
      data: {
        status: "processing",
        attempts: {
          increment: 1
        },
        errorMessage: null
      }
    });

    try {
      await publishTarget(target);
    } catch (error) {
      await prisma.postTarget.update({
        where: {
          id: target.id
        },
        data: {
          status: "retrying",
          errorMessage: error.message
        }
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 2
  }
);

worker.on(
  "completed",
  job => {
    console.log(
      "completed",
      job.id,
      job.name
    );
  }
);

worker.on(
  "failed",
  (job, error) => {
    console.error(
      "failed",
      job?.id,
      job?.name,
      error.message
    );
  }
);
