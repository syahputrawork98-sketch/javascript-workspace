import fs from "node:fs";
import path from "node:path";
import { libraryCatalogSchema } from "@javascript-workspace/schemas";
import { resolveLearningHubRoot } from "./learning-hub-path";
import {
  extractFirstHeading,
  extractMaterialSummary,
  extractMaterialTitle,
  extractSummary,
  extractVersionAndDateFromChangelog,
  inferMaterialCode,
  inferMaterialOrder,
  parseLeadingNumber,
  readFileIfExists,
  sortByLeadingNumberThenName,
  stripLeadingCode,
  titleFromSlug,
} from "./library-helpers";

const RACK_DIRECTORY_PATTERN = /^R(\d{2})-/;
const BOOK_DIRECTORY_PATTERN = /^B(\d{2})-/;

const SECTION_ORDER = ["docs", "chapters", "topics", "exercises", "examples", "assets"];
const SECTION_TITLES = {
  docs: "Dokumen",
  chapters: "Bab",
  topics: "Topik",
  exercises: "Latihan",
  examples: "Examples",
  assets: "Assets",
};
const MATERIAL_TYPE_BY_SECTION = {
  chapters: "chapter",
  topics: "topic",
  exercises: "exercise",
  docs: "reference",
};
const TEXT_FILE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".css",
  ".html",
  ".txt",
  ".sh",
  ".yml",
  ".yaml",
]);

function hasDirectory(sourcePath) {
  return fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory();
}

function headingOrTitle(markdownText, fallback) {
  const heading = extractFirstHeading(markdownText);
  return stripLeadingCode(heading || fallback);
}

function inferFileLanguage(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  if (extension === ".js" || extension === ".mjs" || extension === ".cjs") return "javascript";
  if (extension === ".jsx") return "jsx";
  if (extension === ".ts") return "typescript";
  if (extension === ".tsx") return "tsx";
  if (extension === ".json") return "json";
  if (extension === ".css") return "css";
  if (extension === ".html") return "html";
  if (extension === ".md") return "markdown";
  if (extension === ".yml" || extension === ".yaml") return "yaml";
  if (extension === ".sh") return "bash";
  if (extension === ".txt") return "text";
  return "text";
}

function sortEntriesByName(entries) {
  return [...entries].sort((a, b) => sortByLeadingNumberThenName(a.name, b.name));
}

function toItemCode(baseName, sectionName) {
  if (sectionName === "assets") {
    const explicit = baseName.match(/^([A-Z]+\d+)/i)?.[1];
    return explicit ? explicit.toUpperCase() : "ASSET";
  }

  if (sectionName === "examples") {
    const explicit = baseName.match(/^([A-Z]+\d+)/i)?.[1];
    if (explicit) return explicit.toUpperCase();
    const numericCode = baseName.match(/^(\d+)/)?.[1];
    return numericCode ? `X${numericCode}` : "EXAMPLE";
  }

  return inferMaterialCode(baseName, MATERIAL_TYPE_BY_SECTION[sectionName] || "reference");
}

function collectMarkdownItem(sectionName, bookSourcePath, entryName) {
  const sourcePath = `${bookSourcePath}/${sectionName}/${entryName}`;
  const absolutePath = path.join(resolveLearningHubRoot(), sourcePath);
  const baseName = path.basename(entryName, ".md");

  return {
    id: `${sectionName}:${baseName}`,
    slug: baseName,
    section: sectionName,
    kind: "markdown",
    code: toItemCode(baseName, sectionName),
    order: inferMaterialOrder(entryName),
    title: extractMaterialTitle(absolutePath, entryName),
    summary: extractMaterialSummary(absolutePath),
    sourcePath,
    readmePath: sourcePath,
    assetExtension: null,
    files: [],
  };
}

function collectAssetItem(sectionName, bookSourcePath, entryName) {
  const baseName = path.basename(entryName, path.extname(entryName));
  const extension = path.extname(entryName).toLowerCase();

  return {
    id: `${sectionName}:${baseName}`,
    slug: baseName,
    section: sectionName,
    kind: "asset",
    code: toItemCode(baseName, sectionName),
    order: parseLeadingNumber(baseName),
    title: titleFromSlug(baseName),
    summary: `Asset ${extension.replace(".", "").toUpperCase()} untuk ${titleFromSlug(baseName)}.`,
    sourcePath: `${bookSourcePath}/${sectionName}/${entryName}`,
    readmePath: null,
    assetExtension: extension,
    files: [],
  };
}

function collectExampleItem(sectionName, bookSourcePath, entryName) {
  const exampleRoot = path.join(resolveLearningHubRoot(), bookSourcePath, sectionName, entryName);
  const readmePath = path.join(exampleRoot, "README.md");
  const readmeText = readFileIfExists(readmePath);
  const childFiles = sortEntriesByName(
    fs.readdirSync(exampleRoot, { withFileTypes: true }).filter((entry) => entry.isFile())
  )
    .map((entry) => entry.name)
    .filter((fileName) => fileName.toLowerCase() !== "readme.md")
    .filter((fileName) => TEXT_FILE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .map((fileName) => ({
      name: fileName,
      sourcePath: `${bookSourcePath}/${sectionName}/${entryName}/${fileName}`,
      language: inferFileLanguage(fileName),
    }));

  return {
    id: `${sectionName}:${entryName}`,
    slug: entryName,
    section: sectionName,
    kind: "example",
    code: toItemCode(entryName, sectionName),
    order: parseLeadingNumber(entryName),
    title: headingOrTitle(readmeText, titleFromSlug(entryName)),
    summary: extractSummary(readmeText) || `Contoh runnable untuk ${titleFromSlug(entryName)}.`,
    sourcePath: `${bookSourcePath}/${sectionName}/${entryName}`,
    readmePath: readmeText ? `${bookSourcePath}/${sectionName}/${entryName}/README.md` : null,
    assetExtension: null,
    files: childFiles,
  };
}

function collectSectionItems(sectionName, bookAbsolutePath, bookSourcePath) {
  const sectionAbsolutePath = path.join(bookAbsolutePath, sectionName);
  if (!hasDirectory(sectionAbsolutePath)) return [];

  const entries = sortEntriesByName(fs.readdirSync(sectionAbsolutePath, { withFileTypes: true }));

  if (sectionName === "examples") {
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => collectExampleItem(sectionName, bookSourcePath, entry.name));
  }

  if (sectionName === "assets") {
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => fileName.toLowerCase() !== "readme.md")
      .map((fileName) => collectAssetItem(sectionName, bookSourcePath, fileName));
  }

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => fileName.toLowerCase() !== "readme.md")
    .map((fileName) => collectMarkdownItem(sectionName, bookSourcePath, fileName));
}

function collectSection(sectionName, bookAbsolutePath, bookSourcePath) {
  const sectionAbsolutePath = path.join(bookAbsolutePath, sectionName);
  if (!hasDirectory(sectionAbsolutePath)) return null;

  const readmeAbsolutePath = path.join(sectionAbsolutePath, "README.md");
  const readmeText = readFileIfExists(readmeAbsolutePath);
  const items = collectSectionItems(sectionName, bookAbsolutePath, bookSourcePath);

  return {
    id: sectionName,
    slug: sectionName,
    title: SECTION_TITLES[sectionName] || titleFromSlug(sectionName),
    summary: extractSummary(readmeText) || `${SECTION_TITLES[sectionName] || sectionName} untuk buku ini.`,
    sourcePath: `${bookSourcePath}/${sectionName}`,
    readmePath: readmeText ? `${bookSourcePath}/${sectionName}/README.md` : null,
    itemCount: items.length,
  };
}

function collectRack(hubRoot, rackDirName) {
  const rackAbsolutePath = path.join(hubRoot, rackDirName);
  const readmePath = path.join(rackAbsolutePath, "README.md");
  const readmeText = readFileIfExists(readmePath);
  const code = rackDirName.match(RACK_DIRECTORY_PATTERN)?.[1] || rackDirName;

  return {
    id: rackDirName,
    slug: rackDirName,
    code: code.startsWith("R") ? code : `R${code}`,
    title: headingOrTitle(readmeText, titleFromSlug(rackDirName)),
    summary: extractSummary(readmeText) || `Rak ${rackDirName} dari JavaScript Learning Hub.`,
    sourcePath: rackDirName,
    readmePath: `${rackDirName}/README.md`,
  };
}

function collectBook(hubRoot, rack, bookDirName) {
  const bookAbsolutePath = path.join(hubRoot, rack.slug, bookDirName);
  const bookSourcePath = `${rack.slug}/${bookDirName}`;
  const readmeText = readFileIfExists(path.join(bookAbsolutePath, "README.md"));
  const changelogText = readFileIfExists(path.join(bookAbsolutePath, "CHANGELOG.md"));
  const code = bookDirName.match(BOOK_DIRECTORY_PATTERN)?.[1] || bookDirName;
  const versionAndDate = extractVersionAndDateFromChangelog(changelogText) || {
    version: "v0.0.0",
    releaseDate: "unknown",
  };
  const sections = SECTION_ORDER.map((sectionName) => collectSection(sectionName, bookAbsolutePath, bookSourcePath)).filter(
    Boolean
  );
  const items = sections.flatMap((section) => collectSectionItems(section.slug, bookAbsolutePath, bookSourcePath));

  return {
    id: `${rack.slug}/${bookDirName}`,
    slug: bookDirName,
    rack,
    code: code.startsWith("B") ? code : `B${code}`,
    title: headingOrTitle(readmeText, titleFromSlug(bookDirName)),
    version: versionAndDate.version,
    releaseDate: versionAndDate.releaseDate,
    summary: extractSummary(readmeText) || `Materi ${titleFromSlug(bookDirName)} dari JavaScript Learning Hub.`,
    sourcePath: bookSourcePath,
    readmePath: `${bookSourcePath}/README.md`,
    changelogPath: changelogText ? `${bookSourcePath}/CHANGELOG.md` : null,
    sections,
    items,
  };
}

function collectLibraryCatalog() {
  const hubRoot = resolveLearningHubRoot();
  const rootReadmeText = readFileIfExists(path.join(hubRoot, "README.md"));

  if (!fs.existsSync(hubRoot)) {
    return {
      root: {
        title: "JavaScript Learning Hub",
        summary: "Learning Hub belum ditemukan.",
        sourcePath: ".",
        readmePath: "README.md",
      },
      racks: [],
      books: [],
    };
  }

  const racks = sortEntriesByName(fs.readdirSync(hubRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((dirName) => RACK_DIRECTORY_PATTERN.test(dirName))
    .map((rackDirName) => collectRack(hubRoot, rackDirName));

  const books = racks.flatMap((rack) => {
    const rackAbsolutePath = path.join(hubRoot, rack.slug);
    return sortEntriesByName(fs.readdirSync(rackAbsolutePath, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((dirName) => BOOK_DIRECTORY_PATTERN.test(dirName))
      .map((bookDirName) => collectBook(hubRoot, rack, bookDirName));
  });

  return {
    root: {
      title: headingOrTitle(rootReadmeText, "JavaScript Learning Hub"),
      summary: extractSummary(rootReadmeText) || "Perpustakaan pembelajaran JavaScript.",
      sourcePath: ".",
      readmePath: "README.md",
    },
    racks,
    books,
  };
}

const parsedCatalog = libraryCatalogSchema.parse(collectLibraryCatalog());

export const libraryCatalog = parsedCatalog;
export const libraryRoot = parsedCatalog.root;
export const libraryRacks = parsedCatalog.racks;
export const libraryBooks = parsedCatalog.books;

export function getRackBySlug(rackSlug) {
  return libraryRacks.find((rack) => rack.slug === rackSlug) || null;
}

export function getBooksByRackSlug(rackSlug) {
  return libraryBooks.filter((book) => book.rack.slug === rackSlug);
}

export function getBookBySlugs(rackSlug, bookSlug) {
  return libraryBooks.find((book) => book.rack.slug === rackSlug && book.slug === bookSlug) || null;
}

export function getLegacyBookId(book) {
  return `${book.rack.code}-${book.slug}`;
}

export function getBookByLegacyId(legacyBookId) {
  return libraryBooks.find((book) => getLegacyBookId(book) === legacyBookId) || null;
}

export function getSectionFromBook(book, sectionSlug) {
  return book.sections.find((section) => section.slug === sectionSlug) || null;
}

export function getItemsBySection(book, sectionSlug) {
  return book.items.filter((item) => item.section === sectionSlug);
}

export function getItemFromBook(book, sectionSlug, itemSlug) {
  return book.items.find((item) => item.section === sectionSlug && item.slug === itemSlug) || null;
}
