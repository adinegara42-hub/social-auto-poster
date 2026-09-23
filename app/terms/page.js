
export const metadata = {
  title: "Ketentuan Layanan - Social Auto Poster",
  description:
    "Ketentuan Layanan Social Auto Poster untuk penggunaan aplikasi dan integrasi media sosial.",
};

export default function TermsPage() {
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
            <h1 style={{ margin: 0 }}>Ketentuan Layanan</h1>
            <p style={{ margin: 4, color: "#666" }}>
              Social Auto Poster
            </p>
          </div>
        </div>

        <p>
          <strong>Tanggal berlaku:</strong> 21 September 2026
        </p>

        <p>
          Selamat datang di Social Auto Poster. Dengan mengakses atau
          menggunakan layanan ini, Anda menyatakan telah membaca dan
          menyetujui Ketentuan Layanan berikut. Jika Anda tidak menyetujui
          ketentuan ini, jangan gunakan layanan kami.
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
          Social Auto Poster adalah aplikasi web yang membantu pengguna
          membuat, mengelola, menjadwalkan, dan mempublikasikan konten video
          ke platform media sosial yang didukung.
        </p>
        <p>
          Fitur dan platform yang tersedia dapat berubah dari waktu ke waktu
          bergantung pada kemampuan teknis dan persyaratan platform pihak
          ketiga.
        </p>
      </section>

      <section>
        <h2>2. Persyaratan Pengguna</h2>
        <p>
          Anda bertanggung jawab untuk memastikan bahwa Anda memenuhi
          persyaratan usia, hukum, dan kelayakan yang berlaku untuk
          menggunakan layanan ini.
        </p>
        <p>
          Anda harus memberikan informasi yang benar dan tidak menggunakan
          layanan untuk menyamar sebagai orang lain atau mengakses akun
          tanpa izin.
        </p>
      </section>

      <section>
        <h2>3. Akun Media Sosial dan Otorisasi</h2>
        <p>
          Pengguna hanya boleh menghubungkan akun media sosial yang
          dimilikinya atau yang pengguna memiliki izin sah untuk kelola.
        </p>
        <p>
          Saat menghubungkan akun TikTok atau platform lainnya, pengguna
          memberikan otorisasi sesuai izin yang ditampilkan dalam proses
          otorisasi platform.
        </p>
        <p>
          Pengguna bertanggung jawab untuk menjaga keamanan akun dan dapat
          mencabut otorisasi melalui pengaturan platform yang bersangkutan.
        </p>
      </section>

      <section>
        <h2>4. Penggunaan TikTok</h2>
        <p>
          Social Auto Poster dapat menggunakan TikTok Login Kit dan TikTok
          Content Posting API untuk fitur yang diotorisasi oleh pengguna.
        </p>
        <p>
          Penggunaan TikTok melalui layanan ini tetap tunduk pada
          <a
            href="https://www.tiktok.com/legal/terms-of-service"
            target="_blank"
            rel="noreferrer"
          >
            Ketentuan Layanan TikTok
          </a>
          {" "}dan kebijakan yang berlaku di TikTok.
        </p>
        <p>
          Pengguna bertanggung jawab memastikan bahwa konten dan aktivitas
          yang dilakukan melalui akun TikTok mematuhi ketentuan TikTok.
        </p>
      </section>

      <section>
        <h2>5. Konten Pengguna</h2>
        <p>
          Pengguna tetap bertanggung jawab atas video, gambar, teks,
          caption, tautan, dan materi lain yang dibuat, diunggah,
          dijadwalkan, atau dipublikasikan melalui layanan.
        </p>
        <p>
          Pengguna tidak boleh menggunakan layanan untuk:
        </p>
        <ul>
          <li>Melanggar hukum atau peraturan yang berlaku.</li>
          <li>Melanggar hak cipta, merek dagang, atau hak pihak lain.</li>
          <li>Menyebarkan penipuan, malware, atau konten berbahaya.</li>
          <li>Melanggar privasi atau mengakses akun tanpa izin.</li>
          <li>Melanggar ketentuan platform media sosial yang digunakan.</li>
        </ul>
      </section>

      <section>
        <h2>6. Publikasi dan Penjadwalan</h2>
        <p>
          Layanan membantu pengguna mengatur jadwal dan mengirimkan konten
          sesuai fitur yang tersedia. Kami tidak menjamin bahwa setiap
          publikasi akan berhasil atau diproses pada waktu tertentu.
        </p>
        <p>
          Publikasi dapat gagal atau tertunda karena gangguan teknis,
          batasan API, perubahan kebijakan, pembatasan akun, atau masalah
          pada platform pihak ketiga.
        </p>
      </section>

      <section>
        <h2>7. Hak atas Konten dan Izin</h2>
        <p>
          Pengguna menyatakan bahwa mereka memiliki hak atau izin yang
          diperlukan untuk menggunakan dan mempublikasikan konten yang
          dikirim melalui layanan.
        </p>
        <p>
          Pengguna bertanggung jawab atas klaim pihak ketiga yang timbul
          dari konten atau aktivitas pengguna yang melanggar hak pihak lain.
        </p>
      </section>

      <section>
        <h2>8. Keamanan dan Penggunaan yang Dilarang</h2>
        <p>
          Pengguna tidak boleh mencoba mengganggu layanan, mengakses sistem
          tanpa izin, menghindari pembatasan keamanan, atau menggunakan
          layanan untuk aktivitas berbahaya.
        </p>
        <p>
          Kami menerapkan langkah keamanan yang wajar, tetapi tidak ada
          sistem elektronik yang dapat dijamin sepenuhnya bebas dari risiko.
        </p>
      </section>

      <section>
        <h2>9. Penyedia Layanan Pihak Ketiga</h2>
        <p>
          Layanan dapat bergantung pada penyedia hosting, basis data,
          penyimpanan, dan platform media sosial pihak ketiga. Ketersediaan
          fitur dapat dipengaruhi oleh layanan tersebut.
        </p>
        <p>
          Penggunaan platform pihak ketiga tetap tunduk pada ketentuan dan
          kebijakan masing-masing penyedia.
        </p>
      </section>

      <section>
        <h2>10. Ketersediaan Layanan</h2>
        <p>
          Kami berusaha menjaga layanan tetap tersedia dan berfungsi dengan
          baik. Namun, kami tidak menjamin bahwa layanan akan selalu tersedia
          tanpa gangguan, kesalahan, atau penghentian sementara.
        </p>
      </section>

      <section>
        <h2>11. Penangguhan dan Penghentian</h2>
        <p>
          Pengguna dapat berhenti menggunakan layanan kapan saja. Akses
          dapat dibatasi atau dihentikan jika terdapat pelanggaran terhadap
          ketentuan ini, risiko keamanan, atau kewajiban hukum.
        </p>
        <p>
          Pengguna dapat menghubungi pengelola untuk pertanyaan mengenai
          penghentian akun atau penghapusan data.
        </p>
      </section>

      <section>
        <h2>12. Perubahan Ketentuan</h2>
        <p>
          Kami dapat memperbarui Ketentuan Layanan ini dari waktu ke waktu.
          Versi terbaru akan dipublikasikan pada halaman ini dengan tanggal
          berlaku yang diperbarui.
        </p>
      </section>

      <section>
        <h2>13. Hukum yang Berlaku</h2>
        <p>
          Ketentuan mengenai hukum yang berlaku dan penyelesaian sengketa
          harus ditetapkan sesuai yurisdiksi pengelola dan hukum yang
          berlaku. Konsultasikan bagian ini dengan penasihat hukum sebelum
          digunakan sebagai ketentuan final.
        </p>
      </section>

      <section>
        <h2>14. Kontak</h2>
        <p>
          Untuk pertanyaan mengenai layanan atau Ketentuan Layanan, silakan
          hubungi pengelola Social Auto Poster melalui alamat kontak resmi
          yang tersedia pada aplikasi.
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
