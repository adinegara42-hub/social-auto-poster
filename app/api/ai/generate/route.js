import {NextResponse} from "next/server";
import {generateContent} from "../../../../lib/ai-content";

export async function POST(req){
  try{
    const body=await req.json();
    if(!body.title) return NextResponse.json({error:"title wajib"},{status:400});
    return NextResponse.json(await generateContent(body));
  }catch(e){return NextResponse.json({error:e.message},{status:500});}
}
