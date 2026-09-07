export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";
import { consumeState } from "@/lib/oauth";

export async function GET(req) {
  const u = new URL(req.url);

  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");

  if (!(await consumeState("tiktok", state))) {
    return NextResponse.json(
      { error: "OAuth state tidak valid/kedaluwarsa" },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "OAuth code tidak ditemukan" },
      { status: 400 }
    );
  }

  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: `${process.env.APP_URL}/api/auth/tiktok/callback`,
  });

  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const t = await r.json();

  if (!r.ok || t.error) {
    return NextResponse.json(t, { status: 400 });
  }

  let displayName = "TikTok account";

  try {
    const profileResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
      {
        headers: {
          Authorization: `Bearer ${t.access_token}`,
        },
      }
    );

    const profile = await profileResponse.json();
    const name = profile?.data?.user?.display_name;

    if (name) {
      displayName = name;
    }
  } catch (error) {
    console.error("Gagal mengambil profil TikTok:", error);
  }

  const accountData = {
    platform: "tiktok",
    externalId: t.open_id,
    accessToken: encryptToken(t.access_token),
    refreshToken: t.refresh_token
      ? encryptToken(t.refresh_token)
      : null,
    expiresAt: new Date(Date.now() + t.expires_in * 1000),
    displayName,
  };

  const existing = await prisma.socialAccount.findFirst({
    where: {
      platform: "tiktok",
      externalId: t.open_id,
    },
  });

  if (existing) {
    await prisma.socialAccount.update({
      where: {
        id: existing.id,
      },
      data: accountData,
    });
  } else {
    await prisma.socialAccount.create({
      data: accountData,
    });
  }

  return NextResponse.redirect(
    new URL("/?connected=tiktok", u)
  );
}
