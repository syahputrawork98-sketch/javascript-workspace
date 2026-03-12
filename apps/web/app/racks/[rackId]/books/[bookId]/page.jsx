import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { getBookChapterEntries, getBookMetrics, getBookStatus, getStatusTone } from "@/lib/focuspace";
import { getBookBySlugs, libraryBooks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

function kindLabel(type) {
  if (type === "chapter") return "Chapter";
  if (type === "topic") return "Topik";
  if (type === "exercise") return "Latihan";
  return "Materi";
}

function firstReadableHref(book, chapterEntries) {
  const firstEntry = chapterEntries[0];
  if (!firstEntry) return null;
  return `/racks/${book.rack.slug}/books/${book.slug}/sections/${firstEntry.section}/${firstEntry.slug}`;
}

export async function generateStaticParams() {
  return libraryBooks.map((book) => ({ rackId: book.rack.slug, bookId: book.slug }));
}

export async function generateMetadata({ params }) {
  const { rackId, bookId } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) return { title: "Buku Tidak Ditemukan | JavaScript Focuspace" };

  return { title: `${book.rack.code} / ${book.code} - ${book.title} | JavaScript Focuspace` };
}

export default async function BookDetailPage({ params }) {
  const { rackId, bookId } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) notFound();

  const readmeMarkdown = await loadLibraryText(book.readmePath, "# Buku belum tersedia");
  const changelogMarkdown = book.changelogPath
    ? await loadLibraryText(book.changelogPath, "# Changelog belum tersedia")
    : "";
  const metrics = getBookMetrics(book);
  const status = getBookStatus(book);
  const chapterEntries = getBookChapterEntries(book);
  const startHref = firstReadableHref(book, chapterEntries);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-[#d8dece] bg-[linear-gradient(135deg,#f8f2df_0%,#eef5f1_60%,#f7efe9_100%)] p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-teal-800">
              {book.rack.code} / {book.code}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{book.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{book.summary}</p>
            <p className="mt-3 text-sm text-slate-500">
              {book.version} - {book.releaseDate}
            </p>
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusTone(status)}`}>
            {status}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {startHref ? (
            <Button asChild>
              <Link href={startHref}>Mulai dari Materi Pertama</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href={`/racks/${book.rack.slug}`}>Kembali ke Rak</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Chapter</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.chapterCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Example Set</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.exampleSetCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Visual</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.visualCount}</p></CardContent></Card>
        <Card className="border-[#d8dece] bg-[#fffdf8]"><CardContent><p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Section</p><p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.sectionCount}</p></CardContent></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <Card className="border-[#d8dece] bg-white">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Tentang Buku</p>
            <CardTitle className="text-2xl">Pengantar belajar</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="reader-prose">{renderMarkdownToElements(readmeMarkdown)}</article>
          </CardContent>
        </Card>

        <Card className="border-[#d8dece] bg-[#fffdf7]">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Status Buku</p>
            <CardTitle className="text-2xl">Ringkasan cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{status} untuk pengalaman baca v2</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{metrics.chapterCount} materi utama terdeteksi</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{metrics.exampleSetCount} example set tersedia</div>
            <div className="rounded-2xl border border-[#e0e6d8] bg-white px-4 py-3">{metrics.visualCount} visual map tersedia</div>
          </CardContent>
        </Card>
      </section>

      {changelogMarkdown ? (
        <Card className="border-[#d8dece] bg-white">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Changelog</p>
            <CardTitle className="text-2xl">Perubahan buku</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="reader-prose">{renderMarkdownToElements(changelogMarkdown)}</article>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Daftar Materi</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Pilih chapter yang ingin dipelajari</h2>
          </div>
        </div>

        {chapterEntries.length ? (
          <Card className="border-[#d8dece] bg-white">
            <CardContent className="space-y-3">
              {chapterEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-[#e3e7da] bg-[#fffdfa] px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{entry.code}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        {kindLabel(entry.type)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{entry.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">{entry.summary}</p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`rounded-full border px-2.5 py-1 ${entry.visualCount ? "border-amber-200 bg-amber-50 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        {entry.visualCount ? `${entry.visualCount} visual` : "visual belum ada"}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 ${entry.exampleSetCount ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        {entry.exampleSetCount ? `${entry.exampleSetCount} example set` : "example belum ada"}
                      </span>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${entry.section}/${entry.slug}`}>
                        Buka Materi
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-[#d8dece] bg-[#fffdf8]">
            <CardContent className="space-y-3">
              <p className="text-lg font-medium text-slate-900">Materi utama belum tersedia.</p>
              <p className="text-sm leading-7 text-slate-700">
                Buku ini sudah terdeteksi, tetapi chapter utama belum ditemukan di `chapters/`, `topics/`, atau `exercises/`.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
