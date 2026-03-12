function countItemsBySection(items, section) {
  return items.filter((item) => item.section === section).length;
}

function primaryMaterialItems(book) {
  return book.items.filter((item) => ["chapters", "topics", "exercises"].includes(item.section));
}

function findRelatedItemCount(book, code, section) {
  return book.items.filter((item) => item.section === section && item.code === code).length;
}

export function getBookMetrics(book) {
  const chapterLikeItems = primaryMaterialItems(book);
  const chapterCount = chapterLikeItems.length;
  const exampleSetCount = countItemsBySection(book.items, "examples");
  const visualCount = countItemsBySection(book.items, "assets");
  const docCount = countItemsBySection(book.items, "docs");

  return {
    chapterCount,
    exampleSetCount,
    visualCount,
    docCount,
    itemCount: book.items.length,
    sectionCount: book.sections.length,
  };
}

export function getBookStatus(book) {
  const metrics = getBookMetrics(book);
  const isMapBook = book.code === "B00" || /map/i.test(book.slug) || /map/i.test(book.title);

  if (isMapBook) return "Map";
  if (metrics.chapterCount === 0 && metrics.exampleSetCount === 0 && metrics.visualCount === 0) {
    return "Dalam Pembangunan";
  }
  if (metrics.chapterCount > 0 && metrics.exampleSetCount >= metrics.chapterCount && metrics.visualCount >= metrics.chapterCount) {
    return "Lengkap";
  }
  return "Sebagian";
}

export function getRackMetrics(rack, books) {
  const rackBooks = books.filter((book) => book.rack.slug === rack.slug);

  return rackBooks.reduce(
    (acc, book) => {
      const metrics = getBookMetrics(book);
      acc.bookCount += 1;
      acc.chapterCount += metrics.chapterCount;
      acc.exampleSetCount += metrics.exampleSetCount;
      acc.visualCount += metrics.visualCount;
      acc.itemCount += metrics.itemCount;
      return acc;
    },
    {
      bookCount: 0,
      chapterCount: 0,
      exampleSetCount: 0,
      visualCount: 0,
      itemCount: 0,
    }
  );
}

export function getRackStatus(rack, books) {
  const metrics = getRackMetrics(rack, books);
  return metrics.bookCount > 0 ? "Aktif" : "Dalam Pembangunan";
}

export function getLibraryMetrics(racks, books, archiveBooks = []) {
  const rackMetrics = racks.map((rack) => getRackMetrics(rack, books));
  const activeRackCount = rackMetrics.filter((metrics) => metrics.bookCount > 0).length;

  return {
    rackCount: racks.length,
    activeRackCount,
    bookCount: books.length,
    chapterCount: books.reduce((acc, book) => acc + getBookMetrics(book).chapterCount, 0),
    exampleSetCount: books.reduce((acc, book) => acc + getBookMetrics(book).exampleSetCount, 0),
    visualCount: books.reduce((acc, book) => acc + getBookMetrics(book).visualCount, 0),
    archiveBookCount: archiveBooks.length,
  };
}

export function getBookChapterEntries(book) {
  return primaryMaterialItems(book).map((item, index, items) => ({
    ...item,
    visualCount: findRelatedItemCount(book, item.code, "assets"),
    exampleSetCount: findRelatedItemCount(book, item.code, "examples"),
    previousSlug: index > 0 ? items[index - 1].slug : null,
    nextSlug: index < items.length - 1 ? items[index + 1].slug : null,
  }));
}

export function isPrimaryReadingItem(item) {
  return ["chapters", "topics", "exercises"].includes(item.section);
}

export function getChapterBundle(book, item) {
  if (!item || !isPrimaryReadingItem(item)) return null;

  const chapterEntries = getBookChapterEntries(book);
  const activeIndex = chapterEntries.findIndex(
    (entry) => entry.section === item.section && entry.slug === item.slug
  );
  const current = activeIndex >= 0 ? chapterEntries[activeIndex] : null;

  if (!current) return null;

  const visualItems = book.items.filter((entry) => entry.section === "assets" && entry.code === current.code);
  const exampleItems = book.items.filter((entry) => entry.section === "examples" && entry.code === current.code);

  return {
    current,
    chapterEntries,
    visualItems,
    exampleItems,
    previousEntry: activeIndex > 0 ? chapterEntries[activeIndex - 1] : null,
    nextEntry: activeIndex < chapterEntries.length - 1 ? chapterEntries[activeIndex + 1] : null,
  };
}

export function getStatusTone(status) {
  if (status === "Lengkap") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (status === "Aktif") return "bg-teal-100 text-teal-800 border-teal-200";
  if (status === "Map") return "bg-amber-100 text-amber-900 border-amber-200";
  if (status === "Sebagian") return "bg-sky-100 text-sky-800 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}
