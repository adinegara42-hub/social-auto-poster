import { decryptToken, encryptToken } from "./crypto.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAccount(id) {
  const account = await prisma.socialAccount.findUnique({where:{id}});
  if (!account) throw new Error("Akun sosial tidak ditemukan");
  return {
    ...account,
    accessToken: decryptToken(account.accessToken),
    refreshToken: account.refreshToken ? decryptToken(account.refreshToken) : null
  };
}

export async function saveRefreshedToken(id, accessToken, refreshToken, expiresAt) {
  const data = {accessToken:encryptToken(accessToken), expiresAt};
  if (refreshToken) data.refreshToken = encryptToken(refreshToken);
  return prisma.socialAccount.update({where:{id}, data});
}
