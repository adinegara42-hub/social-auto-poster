import fs from "node:fs";
import path from "node:path";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos";

async function refreshAccessToken(account, prisma) {
  if (!account.refreshToken) throw new Error("YouTube refresh token tidak tersedia");
  const body = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    refresh_token: account.refreshToken,
    grant_type: "refresh_token",
  });
  const r = await fetch(TOKEN_URL, {method:"POST", headers:{"content-type":"application/x-www-form-urlencoded"}, body});
  const data = await r.json();
  if (!r.ok || !data.access_token) throw new Error(`YouTube token refresh gagal: ${data.error_description || data.error || r.status}`);
  const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);
  await prisma.socialAccount.update({
    where:{id:account.id},
    data:{accessToken: data.access_token, expiresAt}
  });
  return data.access_token;
}

export async function getYouTubeAccessToken(account, prisma) {
  if (account.expiresAt && new Date(account.expiresAt).getTime() > Date.now() + 60_000) {
    return account.accessToken;
  }
  return refreshAccessToken(account, prisma);
}

export async function uploadYouTubeVideo({
  accessToken, filePath, title, description, schedule, privacyStatus
}) {
  const stat = await fs.promises.stat(filePath);
  const metadata = {
    snippet: {
      title: (title || path.basename(filePath)).slice(0, 100),
      description: description || "",
      categoryId: "22"
    },
    status: {
      privacyStatus: privacyStatus || (schedule ? "private" : "public"),
      ...(schedule ? {publishAt: new Date(schedule).toISOString()} : {})
    }
  };

  const init = await fetch(`${UPLOAD_URL}?part=snippet,status`, {
    method:"POST",
    headers:{
      Authorization:`Bearer ${accessToken}`,
      "Content-Type":"application/json; charset=UTF-8",
      "X-Upload-Content-Length":String(stat.size),
      "X-Upload-Content-Type":"video/mp4"
    },
    body:JSON.stringify(metadata)
  });
  const initText = await init.text();
  if (!init.ok) throw new Error(`YouTube upload init gagal: ${init.status} ${initText}`);

  const uploadUrl = init.headers.get("location");
  if (!uploadUrl) throw new Error("YouTube tidak mengembalikan upload URL");

  const file = await fs.promises.readFile(filePath);
  const put = await fetch(uploadUrl, {
    method:"PUT",
    headers:{
      Authorization:`Bearer ${accessToken}`,
      "Content-Type":"video/mp4",
      "Content-Length":String(file.length)
    },
    body:file
  });
  const data = await put.json().catch(()=>({}));
  if (!put.ok || !data.id) throw new Error(`YouTube upload gagal: ${put.status} ${JSON.stringify(data)}`);
  return {videoId:data.id, raw:data};
}
