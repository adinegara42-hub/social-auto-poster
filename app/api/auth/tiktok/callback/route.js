export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";
import { consumeState } from "@/lib/oauth";

export async function GET(req) {
  const u = new URL(req.url);

  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");

  // Validasi OAuth state
  if (!state || !(await consumeState("tiktok", state))) {
    return NextResponse.json(
      { error: "OAuth state tidak valid/kedaluwarsa" },
      { status: 400 }
    );
  }

  // Pastikan authorization code ada
  if (!code) {
    return NextResponse.json(
      { error: "OAuth code tidak ditemukan" },
      { status: 400 }
    );
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const appUrl = process.env.APP_URL;

  if (!clientKey || !clientSecret || !appUrl) {
    return NextResponse.json(
      {
        error:
          "Konfigurasi TikTok belum lengkap: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET atau APP_URL",
      },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

  // Tukar authorization code menjadi access token + refresh token
  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const t = await r.json();

  if (!r.ok || t.error) {
    console.error("TikTok OAuth token error:", {
      status: r.status,
      error: t?.error,
      message: t?.error_description || t?.message,
    });

    return NextResponse.json(
      {
        error: "TikTok OAuth gagal",
        details: t,
      },
      { status: 400 }
    );
  }

  if (!t.access_token || !t.open_id) {
    return NextResponse.json(
      {
        error: "TikTok tidak mengembalikan access_token atau open_id",
      },
      { status: 400 }
    );
  }

  // Ambil nama akun TikTok
  let displayName = "TikTok account";

  try {
    const profileResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${t.access_token}`,
        },
        cache: "no-store",
      }
    );

    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      console.error("TikTok profile error:", profile);
    }

    const name = profile?.data?.user?.display_name;

    if (name) {
      displayName = name;
    }
  } catch (error) {
    console.error("Gagal mengambil profil TikTok:", error);
  }

  // Simpan token baru
  const accountData = {
    platform: "tiktok",
    externalId: t.open_id,

    accessToken: encryptToken(t.access_token),

    refreshToken: t.refresh_token
      ? encryptToken(t.refresh_token)
      : null,

    expiresAt: t.expires_in
      ? new Date(Date.now() + Number(t.expires_in) * 1000)
      : null,

    displayName,
  };

  // Cari akun TikTok yang sama
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

    console.log("TikTok account token diperbarui:", existing.id);
  } else {
    const created = await prisma.socialAccount.create({
      data: accountData,
    });

    console.log("TikTok account baru tersimpan:", created.id);
  }

  return NextResponse.redirect(
    new URL("/?connected=tiktok", u)
  );
}
