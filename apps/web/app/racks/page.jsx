import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { getLibraryMetrics, getRackMetrics, getRackStatus, getStatusTone } from "@/lib/focuspace";
import { libraryBooks, libraryRacks } from "@/lib/library";

export const metadata = {
  title: "V2 Library | JavaScript Focuspace",
};

export default function RacksPage() {
  const metrics = getLibraryMetrics(libraryRacks, libraryBooks);
  const activeRacks = libraryRacks.filter((rack) => getRackStatus(rack, libraryBooks) === "Aktif");
  const plannedRacks = libraryRacks.filter((rack) => getRackStatus(rack, libraryBooks) !== "Aktif");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-[#d9dece] bg-[linear-gradient(135deg,#fcf8eb_0%,#edf6f0_100%)] p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-[0.22em] text-teal-800">V2 Library</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Perpustakaan utama JavaScript Learning Hub</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          Mulai dari rak. Setiap rak mewakili domain besar JavaScript, lalu dipecah lagi menjadi buku,
          chapter, visual, dan examples yang lebih mudah dibaca bertahap.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#d9dece] bg-[#fffdf7]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Rak Aktif</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.activeRackCount}</p></CardContent></Card>
        <Card className="border-[#d9dece] bg-[#fffdf7]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Rak Direncanakan</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.rackCount}</p></CardContent></Card>
        <Card className="border-[#d9dece] bg-[#fffdf7]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Buku Aktif</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.bookCount}</p></CardContent></Card>
        <Card className="border-[#d9dece] bg-[#fffdf7]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Chapter Tersedia</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.chapterCount}</p></CardContent></Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Rak yang Sudah Hidup</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Mulai dari rak yang sudah punya buku</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {activeRacks.map((rack) => {
            const rackMetrics = getRackMetrics(rack, libraryBooks);
            const status = getRackStatus(rack, libraryBooks);

            return (
              <Card key={rack.id} className="border-[#d9dece] bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{rack.code}</p>
                      <CardTitle className="mt-2 text-2xl">{rack.title}</CardTitle>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(status)}`}>
                      {status}
                    </span>
                  </div>
                  <CardDescription className="mt-2 text-sm leading-7">{rack.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f7f3e6] px-4 py-3 text-sm text-slate-700">{rackMetrics.bookCount} buku</div>
                    <div className="rounded-2xl bg-[#edf5f1] px-4 py-3 text-sm text-slate-700">{rackMetrics.chapterCount} chapter</div>
                    <div className="rounded-2xl bg-[#f4f6fb] px-4 py-3 text-sm text-slate-700">{rackMetrics.exampleSetCount} example set</div>
                    <div className="rounded-2xl bg-[#fbf3f0] px-4 py-3 text-sm text-slate-700">{rackMetrics.visualCount} visual map</div>
                  </div>
                  <div className="mt-5">
                    <Button asChild>
                      <Link href={`/racks/${rack.slug}`}>Masuk ke {rack.code}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Roadmap Rak</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Rak yang masih dalam pembangunan</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plannedRacks.map((rack) => (
            <Card key={rack.id} className="border-dashed border-[#d9dece] bg-[#fffdf8]">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{rack.code}</p>
                    <CardTitle className="mt-2 text-xl">{rack.title}</CardTitle>
                  </div>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone("Dalam Pembangunan")}`}>
                    Dalam Pembangunan
                  </span>
                </div>
                <CardDescription className="mt-2 text-sm leading-7">{rack.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={`/racks/${rack.slug}`}>Lihat Status Rak</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
