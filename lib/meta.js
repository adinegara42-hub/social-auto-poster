function requireMetaConfig() {
  const required = ["META_APP_ID","META_APP_SECRET"];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) throw new Error(`Meta belum dikonfigurasi: ${missing.join(", ")}`);
}

export async function publishInstagramReel() {
  requireMetaConfig();
  throw new Error(
    "Instagram Reels adapter masih gated: konfigurasi Meta App, approved permissions, " +
    "Instagram Professional account dan endpoint publishing resmi diperlukan."
  );
}

export async function publishFacebookReel() {
  requireMetaConfig();
  throw new Error(
    "Facebook Reels adapter masih gated: konfigurasi Meta App, approved permissions, " +
    "Page access token/Page configuration dan endpoint publishing resmi diperlukan."
  );
}
