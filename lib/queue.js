import { Queue } from "bullmq";
import IORedis from "ioredis";

let postQueue = null;

export function getPostQueue() {
  if (!postQueue) {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error("REDIS_URL is not configured");
    }

    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    postQueue = new Queue("social-posts", { connection });
  }

  return postQueue;
}
