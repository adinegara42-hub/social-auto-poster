import { decryptToken, encryptToken } from "./crypto.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function refreshTikTokAccount(id) {
  const account = await prisma.socialAccount.findUnique({
    where: { id }
  });

  if (!account) {
    throw new Error("Akun sosial tidak ditemukan");
  }

  if (account.platform !== "tiktok") {
    throw new Error("Refresh token hanya untuk akun TikTok");
  }

  if (!account.refreshToken) {
    throw new Error(
      "Refresh token TikTok tidak tersedia. Silakan hubungkan ulang TikTok."
    );
  }

  const refreshToken = decryptToken(account.refreshToken);

  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const response = await fetch(
    "https://open.tiktokapis.com/v2/oauth/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.error) {
    throw new Error(
      `TikTok refresh token gagal: ${response.status} ${JSON.stringify(result)}`
    );
  }

  if (!result.access_token) {
    throw new Error(
      `TikTok tidak mengembalikan access token baru: ${JSON.stringify(result)}`
    );
  }

  const newRefreshToken =
    result.refresh_token || refreshToken;

  const expiresAt = new Date(
    Date.now() + Number(result.expires_in || 86400) * 1000
  );

  await prisma.socialAccount.update({
    where: { id },
    data: {
      accessToken: encryptToken(result.access_token),
      refreshToken: encryptToken(newRefreshToken),
      expiresAt
    }
  });

  return {
    ...account,
    accessToken: result.access_token,
    refreshToken: newRefreshToken,
    expiresAt
  };
}

export async function getAccount(id) {
  const account = await prisma.socialAccount.findUnique({
    where: { id }
  });

  if (!account) {
    throw new Error("Akun sosial tidak ditemukan");
  }

  const accessToken = decryptToken(account.accessToken);
  const refreshToken = account.refreshToken
    ? decryptToken(account.refreshToken)
    : null;

  if (
    account.platform === "tiktok" &&
    refreshToken &&
    account.expiresAt &&
    account.expiresAt.getTime() <= Date.now() + 30 * 60 * 1000
  ) {
    return refreshTikTokAccount(id);
  }

  return {
    ...account,
    accessToken,
    refreshToken
  };
}

export async function saveRefreshedToken(
  id,
  accessToken,
  refreshToken,
  expiresAt
) {
  const data = {
    accessToken: encryptToken(accessToken),
    expiresAt
  };

  if (refreshToken) {
    data.refreshToken = encryptToken(refreshToken);
  }

  return prisma.socialAccount.update({
    where: { id },
    data
  });
}
