import {NextResponse} from "next/server";
export async function GET(){
 return NextResponse.json({error:"Meta OAuth belum diaktifkan. Konfigurasikan Meta Developer App, Graph API version, permissions, Page token, dan Instagram professional account sebelum enable."},{status:501});
}