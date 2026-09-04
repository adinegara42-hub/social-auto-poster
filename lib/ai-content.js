function clean(s=""){return s.replace(/\s+/g," ").trim()}

export async function generateContent({title="",platform="tiktok",style="persuasif"}){
  const prompt = `Buat paket konten ${platform} untuk video berjudul "${clean(title)}".
Gaya: ${style}. Bahasa Indonesia. Kembalikan JSON valid dengan field:
caption, hashtags (array maksimal 8), title, hook. Jangan mengarang fakta produk.`;

  if(process.env.AI_API_KEY && process.env.AI_API_URL){
    const res=await fetch(process.env.AI_API_URL,{
      method:"POST",headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.AI_API_KEY}`
      },
      body:JSON.stringify({
        model:process.env.AI_MODEL||"gpt-4o-mini",
        messages:[{role:"user",content:prompt}],
        temperature:0.7
      })
    });
    if(!res.ok) throw new Error(`AI provider error ${res.status}`);
    const data=await res.json();
    const raw=data?.choices?.[0]?.message?.content||"{}";
    const json=raw.match(/\{[\s\S]*\}/)?.[0];
    if(json) return JSON.parse(json);
  }

  const base=clean(title)||"video baru";
  return {
    title:base.slice(0,90),
    hook:`Jangan lewatkan ${base}!`,
    caption:`${base}. Simak sampai selesai dan cek detailnya di konten ini.`,
    hashtags:["#fyp","#viral","#rekomendasi","#konten"]
  };
}
