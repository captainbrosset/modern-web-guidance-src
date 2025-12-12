import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "preload-prerender",
    title: "Speculatively preload and prerender intrasite links",
    description: "Improve navigation speed by preloading key resources or prerendering pages before the user clicks.",
    category: "webperf",
  },
  {
    id: "lazy-load-images",
    title: "Lazy load images",
    description: "Defer loading of off-screen images to minimize network contention and improve LCP.",
    category: "webperf",
  },
  {
    id: "break-long-tasks",
    title: "Break up long tasks",
    description: "Improve interaction responsiveness (INP) by yielding to the main thread.",
    category: "webperf",
  },
  {
    id: "carousel",
    title: "Modern Carousel",
    category: "ui",
    description: "Build responsive, accessible carousels with CSS Scroll Snap",
  },
  {
    id: "tooltip",
    title: "Modern Tooltip",
    category: "ui",
    description: "Create tooltips with Popover API and Interest Invokers",
  },
];

export function getUseCasesByCategory(category?: string): UseCase[] {
  if (!category) return USE_CASES;
  return USE_CASES.filter((u) => u.category === category);
}

export async function getGuide(useCaseId: string): Promise<string | null> {
  const useCase = USE_CASES.find((u) => u.id === useCaseId);
  if (!useCase) return null;

  const guidesDir = path.resolve(__dirname, "../guides");
  const filePath = path.join(guidesDir, useCase.category, `${useCaseId}.md`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    // Re-throw real errors
    throw error;
  }
}
