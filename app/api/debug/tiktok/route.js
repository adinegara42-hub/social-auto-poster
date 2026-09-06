export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.TIKTOK_CLIENT_KEY || "";

  return Response.json({
    clientKeyExists: Boolean(key),
    prefix: key ? key.slice(0, 4) : "",
    suffix: key ? key.slice(-4) : "",
    length: key.length,
    appUrlExists: Boolean(process.env.APP_URL),
    appUrl: process.env.APP_URL
      ? process.env.APP_URL.replace(/https?:\/\//, "").replace(/\/+$/, "")
      : "",
  });
}
