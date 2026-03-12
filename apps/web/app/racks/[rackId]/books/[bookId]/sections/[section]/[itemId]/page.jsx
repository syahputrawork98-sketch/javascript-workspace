import { notFound } from "next/navigation";
import ChapterReaderShell from "@/components/chapter-reader-shell";
import LibraryItemViewer from "@/components/library-item-viewer";
import { getChapterBundle, isPrimaryReadingItem } from "@/lib/focuspace";
import { getBookBySlugs, getItemFromBook, getSectionFromBook, libraryBooks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";

function rawUrlFor(sourcePath) {
  return `/api/library-file?path=${encodeURIComponent(sourcePath)}`;
}

async function loadExampleItem(example) {
  const readme = example.readmePath
    ? await loadLibraryText(example.readmePath, "# Example belum tersedia")
    : "# Example belum tersedia";

  const files = await Promise.all(
    example.files.map(async (file) => ({
      ...file,
      content: await loadLibraryText(file.sourcePath, "# File belum tersedia"),
      rawUrl: rawUrlFor(file.sourcePath),
    }))
  );

  return {
    ...example,
    readme,
    readmeRawUrl: example.readmePath ? rawUrlFor(example.readmePath) : "#",
    files,
  };
}

export async function generateStaticParams() {
  return libraryBooks.flatMap((book) =>
    book.items.map((item) => ({
      rackId: book.rack.slug,
      bookId: book.slug,
      section: item.section,
      itemId: item.slug,
    }))
  );
}

export async function generateMetadata({ params }) {
  const { rackId, bookId, section, itemId } = await params;
  const book = getBookBySlugs(rackId, bookId);
  const item = book ? getItemFromBook(book, section, itemId) : null;

  if (!book || !item) return { title: "Item Tidak Ditemukan | JavaScript Focuspace" };

  return { title: `${item.code} - ${item.title} | ${book.title} | JavaScript Focuspace` };
}

export default async function LibraryItemPage({ params }) {
  const { rackId, bookId, section, itemId } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) notFound();

  const currentSection = getSectionFromBook(book, section);
  const item = getItemFromBook(book, section, itemId);

  if (!currentSection || !item) notFound();

  if (item.kind === "markdown" && isPrimaryReadingItem(item)) {
    const markdown = await loadLibraryText(item.sourcePath, "# Materi belum tersedia");
    const bundle = getChapterBundle(book, item);

    if (!bundle) notFound();

    const visuals = bundle.visualItems.map((visual) => ({
      ...visual,
      rawUrl: rawUrlFor(visual.sourcePath),
    }));
    const examples = await Promise.all(bundle.exampleItems.map((example) => loadExampleItem(example)));

    return <ChapterReaderShell book={book} bundle={bundle} markdown={markdown} visuals={visuals} examples={examples} />;
  }

  const markdown = item.kind === "markdown" ? await loadLibraryText(item.sourcePath, "# Item belum tersedia") : "";
  const readme =
    item.kind === "example" && item.readmePath
      ? await loadLibraryText(item.readmePath, "# Example belum tersedia")
      : "# Example belum tersedia";
  const files =
    item.kind === "example"
      ? await Promise.all(
          item.files.map(async (file) => ({
            ...file,
            content: await loadLibraryText(file.sourcePath, "# File belum tersedia"),
            rawUrl: rawUrlFor(file.sourcePath),
          }))
        )
      : [];

  return (
    <LibraryItemViewer
      item={item}
      section={currentSection}
      backHref={`/racks/${book.rack.slug}/books/${book.slug}/sections/${currentSection.slug}`}
      backLabel={`Kembali ke ${currentSection.title}`}
      markdown={markdown}
      readme={readme}
      files={files}
      assetUrl={rawUrlFor(item.sourcePath)}
    />
  );
}
