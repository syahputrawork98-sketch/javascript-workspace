import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { archiveBooks } from "@/lib/archive";
import { libraryBooks, libraryRacks, libraryRoot } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

export default async function Home() {
  const rootMarkdown = await loadLibraryText(libraryRoot.readmePath, "# Library belum tersedia");
  const totalItems = libraryBooks.reduce((acc, book) => acc + book.items.length, 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Halaman Root v2</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">{libraryRoot.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{libraryRoot.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/racks">Masuk ke Rak v2</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/legacy">Lihat Arsip v1</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Rak</p>
          <p className="mt-2 text-3xl font-medium text-slate-900">{libraryRacks.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Buku v2</p>
          <p className="mt-2 text-3xl font-medium text-slate-900">{libraryBooks.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Item v2</p>
          <p className="mt-2 text-3xl font-medium text-slate-900">{totalItems}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Penjelasan Perpustakaan</p>
            <h2 className="mt-1 text-2xl font-medium text-slate-900">Isi `README.md` root v2</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{libraryRoot.readmePath}</p>
        </div>
        <article className="reader-prose">{renderMarkdownToElements(rootMarkdown)}</article>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Rak Aktif</p>
            <h2 className="mt-1 text-2xl font-medium text-slate-900">Masuk lewat struktur v2 yang asli</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/racks">Lihat Semua Rak</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {libraryRacks.map((rack) => {
            const rackBooks = libraryBooks.filter((book) => book.rack.slug === rack.slug);
            return (
              <article key={rack.id} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{rack.code}</p>
                <h3 className="mt-2 text-xl font-medium text-slate-900">{rack.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{rack.summary}</p>
                <p className="mt-4 text-sm text-slate-500">{rackBooks.length} buku</p>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href={`/racks/${rack.slug}`}>Buka Rak</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Arsip Lama</p>
            <h2 className="mt-1 text-2xl font-medium text-slate-900">Struktur v1 tetap terpisah</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/legacy">Buka Arsip v1</Link>
          </Button>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-slate-700">
          Workspace sekarang tetap menyimpan jalur arsip v1, tetapi jalur utama v2 sudah diarahkan
          untuk mengikuti struktur perpustakaan yang sebenarnya: root, rak, buku, section, lalu item.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Buku Arsip</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">{archiveBooks.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Versi</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">v1</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Status</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">Arsip Aktif</p>
          </div>
        </div>
      </section>
    </main>
  );
}
