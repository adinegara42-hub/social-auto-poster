
export const metadata = {
  title: "Kebijakan Privasi - Social Auto Poster",
  description:
    "Kebijakan Privasi Social Auto Poster mengenai penggunaan data dan integrasi platform media sosial.",
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 20px 60px",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.7,
        color: "#222",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <img
            src="/icon.svg"
            alt="Logo Social Auto Poster"
            width="64"
            height="64"
            style={{ borderRadius: 14 }}
          />
          <div>
            <h1 style={{ margin: 0 }}>Kebijakan Privasi</h1>
            <p style={{ margin: 4, color: "#666" }}>
              Social Auto Poster
            </p>
          </div>
        </div>

        <p>
          <strong>Tanggal berlaku:</strong> 21 September 2026
        </p>

        <p>
          Kebijakan Privasi ini menjelaskan bagaimana Social Auto Poster
          mengumpulkan, menggunakan, menyimpan, dan melindungi informasi
          ketika Anda menggunakan layanan kami.
        </p>
      </header>

      <nav
        aria-label="Navigasi legal"
        style={{
          padding: 16,
          background: "#f5f5f5",
          borderRadius: 10,
          marginBottom: 28,
        }}
      >
        <strong>Dokumen legal:</strong>
        <div style={{ marginTop: 8 }}>
          <a href="/terms">Ketentuan Layanan</a>
          {" | "}
          <a href="/privacy">Kebijakan Privasi</a>
        </div>
      </nav>

      <section>
        <h2>1. Tentang Layanan</h2>
        <p>
          Social Auto Poster adalah aplikasi web untuk membantu pengguna
          membuat, mengelola, menjadwalkan, dan mempublikasikan konten video
          ke platform media sosial yang didukung.
        </p>
      </section>

      <section>
        <h2>2. Informasi yang Kami Proses</h2>
        <p>
          Bergantung pada fitur yang digunakan, layanan dapat memproses
          informasi berikut:
        </p>
        <ul>
          <li>
            Informasi akun platform yang dihubungkan, seperti identitas
            akun, nama tampilan, dan informasi profil yang diberikan oleh
            platform.
          </li>
          <li>
            Token akses dan informasi otorisasi yang diperlukan untuk
            menjalankan fitur yang diminta pengguna.
          </li>
          <li>
            Informasi posting, seperti nama video, URL video, caption,
            platform tujuan, dan jadwal publikasi.
          </li>
          <li>
            Informasi teknis dan log yang diperlukan untuk keamanan,
            pemeliharaan, dan pemecahan masalah layanan.
          </li>
        </ul>
        <p>
          Kami hanya meminta akses dan informasi yang diperlukan untuk fitur
          yang digunakan dan diizinkan oleh pengguna.
        </p>
      </section>

      <section>
        <h2>3. Integrasi dengan TikTok</h2>
        <p>
          Social Auto Poster menggunakan integrasi TikTok untuk membantu
          pengguna menghubungkan akun dan menjalankan fitur publikasi
          konten yang diotorisasi.
        </p>
        <p>
          Melalui TikTok Login Kit, pengguna dapat memberikan otorisasi
          untuk menghubungkan akun TikTok. Informasi akun yang diterima
          digunakan untuk mengenali akun yang terhubung dan menjalankan
          fitur layanan.
        </p>
        <p>
          Melalui TikTok Content Posting API, aplikasi dapat mengirimkan
          konten yang dipilih dan diotorisasi oleh pengguna untuk
          dipublikasikan ke akun TikTok pengguna, sesuai dengan izin,
          batasan, dan ketentuan TikTok yang berlaku.
        </p>
        <p>
          Pengguna dapat mencabut akses aplikasi melalui pengaturan akun
          TikTok atau mekanisme yang disediakan TikTok.
        </p>
      </section>

      <section>
        <h2>4. Tujuan Penggunaan Informasi</h2>
        <p>Informasi digunakan untuk:</p>
        <ul>
          <li>Menghubungkan dan mengelola akun media sosial pengguna.</li>
          <li>Menyimpan dan mengelola informasi posting.</li>
          <li>Menjalankan penjadwalan dan publikasi konten.</li>
          <li>Memelihara keamanan, keandalan, dan kinerja layanan.</li>
          <li>Menangani pertanyaan, permintaan, dan masalah pengguna.</li>
          <li>Memenuhi kewajiban hukum yang berlaku.</li>
        </ul>
      </section>

      <section>
        <h2>5. Penyimpanan dan Keamanan Data</h2>
        <p>
          Kami menerapkan langkah keamanan teknis dan organisasi yang wajar
          untuk melindungi informasi dari akses, penggunaan, perubahan,
          atau pengungkapan yang tidak sah.
        </p>
        <p>
          Token dan informasi otorisasi diproses untuk menjalankan fungsi
          yang diminta pengguna. Tidak ada metode transmisi atau
          penyimpanan elektronik yang dapat dijamin sepenuhnya aman.
        </p>
      </section>

      <section>
        <h2>6. Penyedia Layanan dan Pihak Ketiga</h2>
        <p>
          Untuk menjalankan layanan, kami dapat menggunakan penyedia
          infrastruktur dan layanan teknologi, termasuk layanan hosting,
          basis data, penyimpanan file, dan antrean pekerjaan.
        </p>
        <p>
          Kami dapat mengirim informasi yang diperlukan ke platform yang
          dipilih pengguna, termasuk TikTok, untuk menjalankan fitur yang
          telah diotorisasi. Penggunaan platform pihak ketiga juga tunduk
          pada kebijakan dan ketentuan masing-masing platform.
        </p>
      </section>

      <section>
        <h2>7. Penyimpanan dan Penghapusan Data</h2>
        <p>
          Informasi disimpan selama diperlukan untuk menyediakan layanan,
          memenuhi tujuan yang dijelaskan dalam kebijakan ini, atau
          memenuhi kewajiban hukum yang berlaku.
        </p>
        <p>
          Pengguna dapat meminta penghapusan data yang berkaitan dengan
          akun atau penggunaan layanan dengan menghubungi pengelola melalui
          alamat kontak di bagian bawah halaman ini.
        </p>
        <p>
          Permintaan penghapusan dapat memerlukan verifikasi untuk
          melindungi keamanan akun. Beberapa informasi mungkin perlu
          dipertahankan apabila diwajibkan oleh hukum atau diperlukan untuk
          menyelesaikan kewajiban yang sah.
        </p>
      </section>

      <section>
        <h2>8. Hak dan Pilihan Pengguna</h2>
        <p>
          Pengguna dapat menghubungi kami untuk menanyakan informasi yang
          berkaitan dengan datanya, meminta koreksi, atau meminta penghapusan
          data sesuai hukum yang berlaku.
        </p>
        <p>
          Pengguna juga dapat menghentikan penggunaan integrasi TikTok
          dengan mencabut otorisasi melalui pengaturan akun TikTok.
        </p>
      </section>

      <section>
        <h2>9. Anak-Anak</h2>
        <p>
          Layanan ini tidak ditujukan untuk anak-anak yang belum memenuhi
          usia minimum yang diwajibkan oleh hukum yang berlaku. Kami tidak
          dengan sengaja mengumpulkan data pribadi anak-anak tanpa dasar
          dan persetujuan yang diperlukan.
        </p>
      </section>

      <section>
        <h2>10. Perubahan Kebijakan Privasi</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
          Versi terbaru akan dipublikasikan pada halaman ini dengan tanggal
          berlaku yang diperbarui.
        </p>
      </section>

      <section>
        <h2>11. Kontak</h2>
        <p>
          Untuk pertanyaan tentang privasi, penghapusan data, atau
          penggunaan informasi, silakan hubungi pengelola Social Auto
          Poster:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto: adinegara42@gmail.com">
            adinegara42@gmail.com
          </a>
        </p>
      </section>

      <footer
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid #ddd",
          color: "#666",
        }}
      >
        <a href="/terms">Ketentuan Layanan</a>
        {" | "}
        <a href="/privacy">Kebijakan Privasi</a>
      </footer>
    </main>
  );
}
