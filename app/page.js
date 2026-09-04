"use client";
import {useEffect,useState} from "react";

export default function Home(){
 const [title,setTitle]=useState("Video baru"),[platform,setPlatform]=useState("tiktok");
 const [style,setStyle]=useState("persuasif"),[result,setResult]=useState(null),[loading,setLoading]=useState(false);
 async function generate(){
  setLoading(true);setResult(null);
  const r=await fetch("/api/ai/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title,platform,style})});
  const j=await r.json();setResult(j);setLoading(false);
 }
 return <main style={{maxWidth:900,margin:"40px auto",padding:20,fontFamily:"Arial"}}>
  <h1>Social Auto Poster v1.3</h1>
  <p>AI Content Generator • Caption • Hashtag • Hook • Multi-platform workflow</p>
  <section style={{border:"1px solid #ddd",padding:20,borderRadius:12}}>
   <h2>AI Content Generator</h2>
   <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul/topik video" style={{width:"100%",padding:12,marginBottom:10}}/>
   <select value={platform} onChange={e=>setPlatform(e.target.value)} style={{padding:10,marginRight:10}}>
    <option value="tiktok">TikTok</option><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option>
   </select>
   <select value={style} onChange={e=>setStyle(e.target.value)} style={{padding:10}}>
    <option>persuasif</option><option>santai</option><option>edukatif</option><option>storytelling</option>
   </select>
   <div><button onClick={generate} disabled={loading} style={{padding:"12px 18px",marginTop:14}}>{loading?"Membuat...":"Generate Konten"}</button></div>
  </section>
  {result&&<section style={{border:"1px solid #ddd",padding:20,borderRadius:12,marginTop:20}}>
   {result.error?<p>{result.error}</p>:<>
    <h3>Hook</h3><p>{result.hook}</p>
    <h3>Title</h3><p>{result.title}</p>
    <h3>Caption</h3><textarea value={result.caption} readOnly rows={5} style={{width:"100%",padding:10}}/>
    <h3>Hashtag</h3><p>{result.hashtags?.join(" ")}</p>
   </>}
  </section>}
 </main>
}
