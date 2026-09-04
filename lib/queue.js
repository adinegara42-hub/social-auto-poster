import {Queue} from "bullmq"; import IORedis from "ioredis";
const connection=new IORedis(process.env.REDIS_URL,{maxRetriesPerRequest:null});
export const postQueue=new Queue("social-posts",{connection});
