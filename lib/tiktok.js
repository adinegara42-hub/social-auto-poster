import fs from "node:fs";

const API = "https://open.tiktokapis.com/v2";

async function postJson(url, accessToken, payload) {
  const r = await fetch(url, {
    method:"POST",
    headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json; charset=UTF-8"},
    body:JSON.stringify(payload)
  });
  const data = await r.json().catch(()=>({}));
  if (!r.ok || data.error?.code && data.error.code !== "ok") {
    throw new Error(`TikTok API gagal: ${r.status} ${JSON.stringify(data)}`);
  }
  return data;
}

export async function getTikTokCreatorInfo(accessToken) {
  return postJson(`${API}/post/publish/creator_info/query/`, accessToken, {});
}

export async function initTikTokDirectPost({
  accessToken,
  videoSize,
  videoUrl,
  caption = "",
  privacyLevel
}) {
  const creator = await getTikTokCreatorInfo(accessToken);
  const options = creator.data?.privacy_level_options || [];
  const chosen = privacyLevel || options[0];

  if (!chosen) {
    throw new Error("TikTok tidak mengembalikan privacy_level_options");
  }

  if (caption.length > 2200) {
    throw new Error("Caption TikTok melebihi 2200 karakter");
  }

  if (!videoUrl) {
    throw new Error("URL video tidak tersedia");
  }

  return postJson(
    `${API}/post/publish/video/init/`,
    accessToken,
    {
      post_info: {
        title: caption,
        privacy_level: chosen,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl
      }
    }
  );
}

export async function uploadTikTokFile({accessToken, uploadUrl, filePath}) {
  const stat = await fs.promises.stat(filePath);
  const size = stat.size;
  if (size < 5 * 1024 * 1024) {
    throw new Error("TikTok FILE_UPLOAD membutuhkan chunk minimal 5 MB. Untuk file di bawah 5 MB gunakan PULL_FROM_URL dengan URL publik.");
  }

  const chunkSize = Math.min(64 * 1024 * 1024, Math.max(5 * 1024 * 1024, size));
  const buffer = await fs.promises.readFile(filePath);
  let start = 0;
  while (start < size) {
    const end = Math.min(start + chunkSize, size) - 1;
    const chunk = buffer.subarray(start, end + 1);
    const r = await fetch(uploadUrl, {
      method:"PUT",
      headers:{
        "Content-Type":"video/mp4",
        "Content-Length":String(chunk.length),
        "Content-Range":`bytes ${start}-${end}/${size}`
      },
      body:chunk
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`TikTok media upload gagal: ${r.status} ${text}`);
    }
    start = end + 1;
  }
}

export async function queryTikTokPost(accessToken, publishId) {
  return postJson(`${API}/post/publish/status/fetch/`, accessToken, {publish_id:publishId});
}
