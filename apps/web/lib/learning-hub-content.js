import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { ensureInsideRoot, resolveLearningHubRoot } from "./learning-hub-path";

export const loadMaterialMarkdown = cache(async (sourcePath) => {
  const hubRoot = resolveLearningHubRoot();
  const absoluteTarget = path.resolve(hubRoot, sourcePath);

  if (!ensureInsideRoot(hubRoot, absoluteTarget)) {
    return "# Konten tidak valid\n\nPath materi berada di luar direktori Learning Hub.";
  }

  try {
    const markdown = await fs.readFile(absoluteTarget, "utf8");
    return markdown;
  } catch {
    return "# Materi belum tersedia\n\nFile materi belum ditemukan pada source Learning Hub.";
  }
});
