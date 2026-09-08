"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [schedule, setSchedule] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
  ? data
  : data.accounts || data.items || [];
        setAccounts(list);

        const tiktok = list.find((a) => a.platform === "tiktok");
        if (tiktok) setAccountId(tiktok.id);
      })
      .catch(() => {});
  }, []);

  
async function handleVideoChange(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("video/")) {
    setMessage("File harus berupa video.");
    return;
  }

  setVideo(file);
  setVideoName(file.name);
  setMessage("Mengupload video...");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Gagal mengupload video.");
      return;
    }

    setMessage("Video berhasil diupload.");

    window.__uploadedVideoUrl = data.url;
  } catch (error) {
    setMessage("Gagal mengupload video.");
  }
}
  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("Menyimpan posting...");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoName,
          videoUrl: window.__uploadedVideoUrl || "",
          caption,
          schedule: schedule || null,
          platforms: [platform],
          accountIds: accountId ? { tiktok: accountId } : {},
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan posting.");
        return;
      }

      setMessage("Posting berhasil disimpan.");
    } catch (error) {
      setMessage("Terjadi kesalahan.");
    }
  }

  const tiktokAccounts = accounts.filter(
    (account) => account.platform === "tiktok"
  );

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Social Auto Poster</h1>

      <p>Kelola dan jadwalkan posting media sosial.</p>

      <hr />

      <form onSubmit={handleSubmit}>
        <h2>Buat Posting</h2>

        <label>
          <strong>🎥 Video</strong>
        </label>

        <br />

        <input
          type="file"
          accept="video/mp4,video/quicktime,video/*"
          onChange={handleVideoChange}
          style={{ marginTop: 10, marginBottom: 10 }}
        />

        {video && (
          <div
            style={{
              padding: 12,
              background: "#f3f3f3",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <strong>Video dipilih:</strong>
            <br />
            {video.name}
            <br />
            {(video.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}

        <br />

        <label>
          <strong>Nama video</strong>
        </label>

        <input
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          placeholder="Nama video"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 6,
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />

        <label>
          <strong>Caption</strong>
        </label>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tulis caption..."
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 6,
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />

        <label>
          <strong>Platform</strong>
        </label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 6,
            marginBottom: 16,
          }}
        >
          <option value="tiktok">TikTok</option>
        </select>

        <label>
          <strong>Akun TikTok</strong>
        </label>

        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 6,
            marginBottom: 16,
          }}
        >
          <option value="">Pilih akun TikTok</option>

          {tiktokAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.displayName || "TikTok account"}
            </option>
          ))}
        </select>

        <label>
          <strong>Jadwal</strong>
        </label>

        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 6,
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={!video}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            cursor: video ? "pointer" : "not-allowed",
          }}
        >
          Simpan Posting
        </button>

        {message && (
          <p style={{ marginTop: 16 }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
