export const PLATFORMS = ["youtube","tiktok","instagram","facebook"];

export function validateCaption(platform, caption="") {
  const max = platform === "tiktok" ? 2200 : 5000;
  if (caption.length > max) throw new Error(`${platform}: caption terlalu panjang (maks ${max})`);
}

export function validateVideoName(name) {
  if (!name || /[\\/]/.test(name) || name.includes("..")) throw new Error("Nama file video tidak valid");
}
