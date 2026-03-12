import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { ensureInsideRoot, resolveLearningHubRoot } from "./learning-hub-path";

export const loadLibraryText = cache(async (sourcePath, fallbackMessage = "# Konten belum tersedia") => {
  if (!sourcePath || typeof sourcePath !== "string") {
    return `${fallbackMessage}\n\nPath konten belum valid.`;
  }

  const hubRoot = resolveLearningHubRoot();
  const absoluteTarget = path.resolve(hubRoot, sourcePath);

  if (!ensureInsideRoot(hubRoot, absoluteTarget)) {
    return "# Konten tidak valid\n\nPath konten berada di luar direktori Learning Hub.";
  }

  try {
    return await fs.readFile(absoluteTarget, "utf8");
  } catch {
    return `${fallbackMessage}\n\nFile konten belum ditemukan pada source Learning Hub.`;
  }
});

export const loadMaterialMarkdown = cache(async (sourcePath) =>
  loadLibraryText(sourcePath, "# Materi belum tersedia")
);
