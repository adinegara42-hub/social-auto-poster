import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export async function POST(req){
  const form=await req.formData();
  const file=form.get("video");
  if(!file || typeof file.arrayBuffer!=="function")
    return Response.json({error:"Field video wajib diisi"},{status:400});
  const allowed=["video/mp4","video/webm","video/quicktime"];
  if(!allowed.includes(file.type))
    return Response.json({error:"Format video tidak didukung"},{status:400});
  if(file.size>200*1024*1024)
    return Response.json({error:"Ukuran maksimum development upload 200MB"},{status:400});
  const ext=path.extname(file.name)||".mp4";
  const name=`${Date.now()}-${crypto.randomUUID()}${ext}`;
  await mkdir(path.join(process.cwd(),"public","uploads"),{recursive:true});
  await writeFile(path.join(path.join(process.cwd(),"public","uploads"),name),Buffer.from(await file.arrayBuffer()));
  return Response.json({ok:true,fileName:name,url:`/uploads/${name}`});
}