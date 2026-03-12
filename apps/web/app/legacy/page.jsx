import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { archiveBooks } from "@/lib/archive";

export const metadata = {
  title: "Arsip v1 | JavaScript Focuspace",
};

export default function LegacyBooksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-[#d7dcd0] bg-[linear-gradient(135deg,#f5f3ea_0%,#f0f0ee_100%)] p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Legacy Archive</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">JavaScript Learning Hub v1</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          Ini adalah jalur arsip. Struktur dan pengalaman bacanya tetap dirapikan agar nyaman, tetapi sengaja
          dipertahankan lebih sederhana daripada `V2` untuk menunjukkan evolusi produk.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Home</Link>
          </Button>
          <Button asChild>
            <Link href="/racks">Masuk ke V2</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#d8ddd2] bg-[#fcfbf6]">
          <CardContent>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Buku Arsip</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{archiveBooks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-[#d8ddd2] bg-[#fcfbf6]">
          <CardContent>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Karakter</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Legacy But Clean</p>
          </CardContent>
        </Card>
        <Card className="border-[#d8ddd2] bg-[#fcfbf6]">
          <CardContent>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Peran</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Referensi Evolusi</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Katalog Arsip</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Buku v1 yang masih bisa dibaca</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archiveBooks.length === 0 ? (
            <Card className="border-dashed border-[#d8ddd2] bg-[#fffdf8] md:col-span-2 xl:col-span-3">
              <CardContent>
                <p className="text-sm text-slate-700">Arsip v1 belum tersedia atau path Learning Hub belum valid.</p>
              </CardContent>
            </Card>
          ) : (
            archiveBooks.map((book) => (
              <Card key={book.id} className="border-[#d8ddd2] bg-white">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">v1 / {book.code}</p>
                  <CardTitle className="mt-2 text-2xl">{book.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {book.version} - {book.releaseDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-700">{book.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">{book.materials.length} materi</p>
                    <Button asChild variant="outline">
                      <Link href={`/legacy/${book.id}`}>Buka Arsip</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
