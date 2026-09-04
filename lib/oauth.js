import crypto from "node:crypto"; import {prisma} from "@/lib/prisma";
export async function createState(provider){const state=crypto.randomBytes(24).toString("hex");await prisma.oAuthState.create({data:{provider,state,expiresAt:new Date(Date.now()+600000)}});return state;}
export async function consumeState(provider,state){if(!state)return false;const row=await prisma.oAuthState.findUnique({where:{state}});if(!row||row.provider!==provider||row.expiresAt.getTime()<Date.now())return false;await prisma.oAuthState.delete({where:{state}});return true;}
