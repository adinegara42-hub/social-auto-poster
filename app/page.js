"use client";

import {useEffect,useState} from "react";

export default function Home(){
  const [title,setTitle]=useState("Video baru");
  const [platform,setPlatform]=useState("tiktok");
  const [style,setStyle]=useState("persuasif");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const [videoName,setVideoName]=useState("");
  const [caption,setCaption]=useState("");
  const [schedule,setSchedule]=useState("");
  const [accounts,setAccounts]=useState([]);
  const [accountId,setAccountId]=useState("");
  const [saveMessage,setSaveMessage]=useState("");

  useEffect(()=>{
    loadAccounts();
  },[]);

  async function loadAccounts(){
    try{
      const r=await fetch("/api/accounts");
      const j=await r.json();
      setAccounts(j.items||[]);
    }catch(e){
      console.error(e);
    }
  }

  async function generate(){
    setLoading(true);
    setResult(null);

    const r=await fetch("/api/ai/generate",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({title,platform,style})
    });

    const j=await r.json();
    setResult(j);

    if(j.caption) setCaption(j.caption);
    if(j.title) setVideoName(j.title);

    setLoading(false);
  }

  async function savePost(){
    setSaveMessage("");

    if(!videoName){
      setSaveMessage("Nama video wajib diisi.");
      return;
    }

    if(!schedule){
      setSaveMessage("Tanggal dan jam wajib diisi.");
      return;
    }

    if(!accountId){
      setSaveMessage("Akun sosial belum tersedia. Hubungkan akun terlebih dahulu.");
      return;
    }

    try{
      const r=await fetch("/api/posts",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          videoName,
          caption,
          schedule,
          platforms:[platform],
          accountIds:{
            [platform]:accountId
          }
        })
      });

      const j=await r.json();

      if(!r.ok){
        setSaveMessage(j.error||"Gagal menyimpan posting.");
        return;
      }

      setSaveMessage("✅ Posting berhasil disimpan ke database.");

    }catch(e){
      setSaveMessage("Gagal terhubung ke server.");
    }
  }

  const platformAccounts=accounts.filter(
    a=>a.platform===platform
  );

  return (
    <main style={{
      maxWidth:900,
      margin:"40px auto",
      padding:20,
      fontFamily:"Arial"
    }}>

      <h1>Social Auto Poster v1.3</h1>

      <p>
        AI Content Generator • Caption • Hashtag •
        Multi-platform workflow
      </p>

      <section style={{
        border:"1px solid #ddd",
        padding:20,
        borderRadius:12
      }}>

        <h2>1. Buat Konten</h2>

        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Judul/topik video"
          style={{
            width:"100%",
            padding:12,
            marginBottom:10
          }}
        />

        <select
          value={platform}
          onChange={e=>{
            setPlatform(e.target.value);
            setAccountId("");
          }}
          style={{
            padding:10,
            marginRight:10
          }}
        >
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>

        <select
          value={style}
          onChange={e=>setStyle(e.target.value)}
          style={{padding:10}}
        >
          <option>persuasif</option>
          <option>santai</option>
          <option>edukatif</option>
          <option>storytelling</option>
        </select>

        <div>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding:"12px 18px",
              marginTop:14
            }}
          >
            {loading?"Membuat...":"Generate Konten"}
          </button>
        </div>

      </section>

      {result && (
        <section style={{
          border:"1px solid #ddd",
          padding:20,
          borderRadius:12,
          marginTop:20
        }}>

          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <h3>Hook</h3>
              <p>{result.hook}</p>

              <h3>Title</h3>
              <p>{result.title}</p>

              <h3>Caption</h3>

              <textarea
                value={caption}
                onChange={e=>setCaption(e.target.value)}
                rows={6}
                style={{
                  width:"100%",
                  padding:10
                }}
              />

              <h3>Hashtag</h3>
              <p>{result.hashtags?.join(" ")}</p>

            </>
          )}

        </section>
      )}

      <section style={{
        border:"1px solid #ddd",
        padding:20,
        borderRadius:12,
        marginTop:20
      }}>

        <h2>2. Simpan Posting</h2>

        <label>Nama video</label>

        <input
          value={videoName}
          onChange={e=>setVideoName(e.target.value)}
          placeholder="Contoh: Review Produk Viral"
          style={{
            width:"100%",
            padding:12,
            margin:"8px 0 15px"
          }}
        />

        <label>Caption</label>

        <textarea
          value={caption}
          onChange={e=>setCaption(e.target.value)}
          placeholder="Caption posting"
          rows={6}
          style={{
            width:"100%",
            padding:12,
            margin:"8px 0 15px"
          }}
        />

        <label>Platform</label>

        <p>
          <strong>{platform.toUpperCase()}</strong>
        </p>

        <label>Akun</label>

        <select
          value={accountId}
          onChange={e=>setAccountId(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            margin:"8px 0 15px"
          }}
        >
          <option value="">
            Pilih akun {platform}
          </option>

          {platformAccounts.map(account=>(
            <option
              key={account.id}
              value={account.id}
            >
              {account.displayName ||
               account.externalId ||
               account.id}
            </option>
          ))}

        </select>

        {platformAccounts.length===0 && (
  <div>
    <p>
      ⚠️ Belum ada akun {platform} yang terhubung.
    </p>

    {platform==="tiktok" && (
      <a
        href="/api/auth/tiktok"
        style={{
          display:"inline-block",
          padding:"12px 18px",
          marginTop:10,
          border:"1px solid #000",
          borderRadius:8,
          textDecoration:"none",
          fontWeight:"bold"
        }}
      >
        🔗 Hubungkan TikTok
      </a>
    )}
  </div>
)}

        <label>Jadwal posting</label>

        <input
          type="datetime-local"
          value={schedule}
          onChange={e=>setSchedule(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            margin:"8px 0 15px"
          }}
        />

        <button
          onClick={savePost}
          style={{
            padding:"12px 20px",
            fontWeight:"bold"
          }}
        >
          💾 Simpan Posting
        </button>

        {saveMessage && (
          <p style={{
            marginTop:15,
            fontWeight:"bold"
          }}>
            {saveMessage}
          </p>
        )}

      </section>

    </main>
  );
}
