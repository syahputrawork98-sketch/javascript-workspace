import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@javascript-workspace/ui";
import { books } from "@/lib/books";

const learningReasons = [
  "Bagaimana kode JavaScript dieksekusi.",
  "Bagaimana Execution Context bekerja.",
  "Bagaimana Lexical Environment terbentuk.",
  "Bagaimana Event Loop menjalankan asynchronous code.",
  "Bagaimana Prototype Chain membentuk object system.",
  "Bagaimana nilai dan reference disimpan di memory.",
  "Bagaimana JavaScript engine mengeksekusi program.",
];

export default function Home() {
  const totalMaterials = books.reduce((acc, book) => acc + book.materials.length, 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-14">
      <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-[#fffdf8] via-white to-[#f3f7f9] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">JavaScript Workspace</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-slate-900">
          Platform pembaca untuk JavaScript Learning Hub
        </h1>
        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          JavaScript Learning Hub adalah perpustakaan kecil berisi buku teknis JavaScript. JavaScript
          Workspace adalah gedung belajarnya: tempat kamu membaca buku, menavigasi materi, dan
          membangun pemahaman JavaScript secara terstruktur.
        </p>
        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          Tujuan belajarnya adalah membangun pemahaman yang kuat tentang bagaimana JavaScript
          bekerja, bukan hanya cara memakai API atau framework.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {learningReasons.map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle className="text-base">{item}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-slate-900">Pilih Buku</h2>
          <p className="text-slate-600">Masuk ke buku, lalu pilih materi dari sidebar.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="h-full">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{book.code}</p>
                <CardTitle className="text-lg">{book.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">{book.summary}</p>
                <Button asChild className="w-full">
                  <Link href={`/books/${book.id}`}>Buka Buku</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Buku</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">{books.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Materi</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">{totalMaterials}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <p className="text-xs uppercase tracking-widest text-slate-500">Status</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">Reading Platform</p>
        </div>
      </section>
    </main>
  );
}
