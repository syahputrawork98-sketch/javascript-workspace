import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { getBookMetrics, getBookStatus, getRackMetrics, getRackStatus, getStatusTone } from "@/lib/focuspace";
import { getBooksByRackSlug, getRackBySlug, libraryBooks, libraryRacks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

export async function generateStaticParams() {
  return libraryRacks.map((rack) => ({ rackId: rack.slug }));
}

export async function generateMetadata({ params }) {
  const { rackId } = await params;
  const rack = getRackBySlug(rackId);

  if (!rack) return { title: "Rak Tidak Ditemukan | JavaScript Focuspace" };

  return { title: `${rack.code} - ${rack.title} | JavaScript Focuspace` };
}

export default async function RackDetailPage({ params }) {
  const { rackId } = await params;
  const rack = getRackBySlug(rackId);

  if (!rack) notFound();

  const books = getBooksByRackSlug(rack.slug);
  const rackMarkdown = await loadLibraryText(rack.readmePath, "# Rak belum tersedia");
  const rackMetrics = getRackMetrics(rack, libraryBooks);
  const rackStatus = getRackStatus(rack, libraryBooks);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-[#d8dece] bg-[linear-gradient(135deg,#faf6e8_0%,#eef5ef_100%)] p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-teal-800">{rack.code}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{rack.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{rack.summary}</p>
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusTone(rackStatus)}`}>
            {rackStatus}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/racks">Kembali ke V2 Library</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Buku</p><p className="mt-2 text-3xl font-semibold text-slate-900">{rackMetrics.bookCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Chapter</p><p className="mt-2 text-3xl font-semibold text-slate-900">{rackMetrics.chapterCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Example Set</p><p className="mt-2 text-3xl font-semibold text-slate-900">{rackMetrics.exampleSetCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Visual</p><p className="mt-2 text-3xl font-semibold text-slate-900">{rackMetrics.visualCount}</p></CardContent></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <Card className="border-[#d8dece] bg-white">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Penjelasan Rak</p>
            <CardTitle className="text-2xl">Apa yang dipelajari di rak ini</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="reader-prose">{renderMarkdownToElements(rackMarkdown)}</article>
          </CardContent>
        </Card>

        <Card className="border-[#d8dece] bg-[#fffdf7]">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Status Rak</p>
            <CardTitle className="text-2xl">Ringkasan cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{books.length} buku ada di rak ini</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{rackMetrics.chapterCount} chapter siap dibaca</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{rackMetrics.exampleSetCount} example set runnable</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">
              {rackStatus === "Aktif" ? "Rak ini bisa langsung dijelajahi." : "Rak ini masih menunggu buku operasional."}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Buku di Dalam Rak</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {books.length ? `${books.length} buku tersedia` : "Buku belum tersedia"}
            </h2>
          </div>
        </div>

        {books.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => {
              const metrics = getBookMetrics(book);
              const status = getBookStatus(book);

              return (
                <Card key={book.id} className="border-[#d8dece] bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {book.rack.code} / {book.code}
                        </p>
                        <CardTitle className="mt-2 text-2xl">{book.title}</CardTitle>
                      </div>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(status)}`}>
                        {status}
                      </span>
                    </div>
                    <CardDescription className="mt-2 text-sm leading-7">{book.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#f8f3e7] px-4 py-3 text-sm text-slate-700">{metrics.chapterCount} chapter</div>
                      <div className="rounded-2xl bg-[#eef5f0] px-4 py-3 text-sm text-slate-700">{metrics.exampleSetCount} example set</div>
                      <div className="rounded-2xl bg-[#f4f7fb] px-4 py-3 text-sm text-slate-700">{metrics.visualCount} visual</div>
                      <div className="rounded-2xl bg-[#fbf6ef] px-4 py-3 text-sm text-slate-700">{book.version}</div>
                    </div>
                    <div className="mt-5">
                      <Button asChild className="w-full">
                        <Link href={`/racks/${rack.slug}/books/${book.slug}`}>Buka Buku</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-[#d8dece] bg-[#fffdf8]">
            <CardContent className="space-y-3">
              <p className="text-lg font-medium text-slate-900">Rak ini masih dalam pembangunan.</p>
              <p className="text-sm leading-7 text-slate-700">
                Fokus domainnya sudah ditentukan, tetapi buku-bukunya belum tersedia di Learning Hub v2.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
