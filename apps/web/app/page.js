import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { archiveBooks } from "@/lib/archive";
import { getLibraryMetrics, getRackMetrics, getRackStatus, getStatusTone } from "@/lib/focuspace";
import { libraryBooks, libraryRacks, libraryRoot } from "@/lib/library";

function StatCard({ label, value, detail }) {
  return (
    <Card className="border-[#d8ddcf] bg-[#fffdf7]">
      <CardContent className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="text-sm text-slate-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const metrics = getLibraryMetrics(libraryRacks, libraryBooks, archiveBooks);
  const featuredRack = libraryRacks.find((rack) => getRackMetrics(rack, libraryBooks).bookCount > 0) || libraryRacks[0];
  const featuredRackMetrics = featuredRack ? getRackMetrics(featuredRack, libraryBooks) : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-[#d7ddcf] bg-[linear-gradient(135deg,#f8f4df_0%,#eef6ef_48%,#f6efe6_100%)] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-teal-800">JavaScript Focuspace</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Belajar JavaScript seperti membaca perpustakaan digital yang rapi.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
              {libraryRoot.summary} Focuspace menata konten itu menjadi jalur baca yang lebih nyaman:
              mulai dari rak, masuk ke buku, lalu membaca chapter dengan materi, visual, dan example
              yang lebih mudah diikuti.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/racks">Masuk ke V2</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/legacy">Lihat Arsip V1</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-[#d7ddcf] bg-white/90">
              <CardHeader>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Jalur Utama</p>
                <CardTitle className="text-2xl">V2 Library</CardTitle>
                <CardDescription>Rak, buku, chapter, visual, dan example set aktif.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone("Aktif")}`}>
                  Fokus Utama
                </div>
                <span className="text-sm text-slate-600">{metrics.activeRackCount} rak aktif</span>
              </CardContent>
            </Card>

            <Card className="border-[#d7ddcf] bg-white/75">
              <CardHeader>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Referensi Lama</p>
                <CardTitle className="text-2xl">V1 Archive</CardTitle>
                <CardDescription>Versi sebelumnya tetap tersedia untuk referensi dan perbandingan.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone("Dalam Pembangunan")}`}>
                  Arsip
                </div>
                <span className="text-sm text-slate-600">{metrics.archiveBookCount} buku arsip</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Rak Direncanakan" value={metrics.rackCount} detail="Seluruh domain besar JavaScript." />
        <StatCard label="Rak Aktif" value={metrics.activeRackCount} detail="Rak yang sudah punya buku operasional." />
        <StatCard label="Buku V2" value={metrics.bookCount} detail="Buku yang sudah terdeteksi dari Learning Hub." />
        <StatCard label="Chapter" value={metrics.chapterCount} detail="Materi utama yang sudah bisa dibaca." />
        <StatCard label="Example Set" value={metrics.exampleSetCount} detail="Kumpulan runnable example per chapter." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <Card className="border-[#d7ddcf] bg-[#fffdfa]">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mulai dari Sini</p>
              <CardTitle className="text-3xl">Fokus dulu ke V2 yang sudah hidup</CardTitle>
              <CardDescription>
                Rak yang belum punya isi tetap ditampilkan sebagai roadmap, tapi jalur baca utama sekarang ada
                di rak yang sudah berisi buku dan chapter nyata.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/racks">Lihat Semua Rak</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {libraryRacks.map((rack) => {
              const rackMetrics = getRackMetrics(rack, libraryBooks);
              const status = getRackStatus(rack, libraryBooks);

              return (
                <article
                  key={rack.id}
                  className="rounded-[1.5rem] border border-[#dde3d6] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{rack.code}</p>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusTone(status)}`}>
                      {status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{rack.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{rack.summary}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="rounded-xl bg-[#f6f4eb] px-3 py-2">{rackMetrics.bookCount} buku</div>
                    <div className="rounded-xl bg-[#eef5f2] px-3 py-2">{rackMetrics.chapterCount} chapter</div>
                  </div>
                  <div className="mt-5">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/racks/${rack.slug}`}>{status === "Aktif" ? "Buka Rak" : "Lihat Status Rak"}</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </CardContent>
        </Card>

        {featuredRack && featuredRackMetrics ? (
          <Card className="border-[#d7ddcf] bg-[#fdfbf2]">
            <CardHeader>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Rak Aktif Pertama</p>
              <CardTitle className="text-3xl">{featuredRack.code}</CardTitle>
              <CardDescription>{featuredRack.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-slate-700">{featuredRack.summary}</p>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-[#e2e7da] bg-white px-4 py-3 text-sm text-slate-700">
                  {featuredRackMetrics.bookCount} buku aktif
                </div>
                <div className="rounded-2xl border border-[#e2e7da] bg-white px-4 py-3 text-sm text-slate-700">
                  {featuredRackMetrics.chapterCount} chapter sudah tersedia
                </div>
                <div className="rounded-2xl border border-[#e2e7da] bg-white px-4 py-3 text-sm text-slate-700">
                  {featuredRackMetrics.exampleSetCount} example set runnable
                </div>
                <div className="rounded-2xl border border-[#e2e7da] bg-white px-4 py-3 text-sm text-slate-700">
                  {featuredRackMetrics.visualCount} visual map
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href={`/racks/${featuredRack.slug}`}>Masuk ke {featuredRack.code}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
