import {NextResponse} from "next/server";

export async function GET(){
  const configured=Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
  return NextResponse.json({
    configured,
    instagram:"gated",
    facebook:"gated",
    message: configured
      ? "Meta credentials tersedia; publishing tetap gated sampai endpoint/permissions/account configuration diverifikasi."
      : "META_APP_ID dan META_APP_SECRET belum diisi."
  });
}
