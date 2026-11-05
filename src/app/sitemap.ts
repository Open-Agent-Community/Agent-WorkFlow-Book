import type { MetadataRoute } from "next";
import { CHAPTERS } from "@/content/chapters";
import { PATHS } from "@/content/paths";
import { CASES } from "@/content/cases";
import { LABS } from "@/content/labs";
import { SOLUTIONS } from "@/content/solutions";
import { AUDIENCES } from "@/lib/audience";

const BASE = "https://agentflow.moyingsmart.cn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    ...["/fde", "/fde/paths", "/fde/cases", "/fde/kit", "/learn/reader/", "/learn/campus/", "/learn/enterprise/", "/learn/fde-project/", "/learn/fde-brief/"].map(path=>({path,priority:0.8})),
    { path: "/reader", priority: 0.9 },
    { path: "/campus", priority: 0.9 },
    { path: "/enterprise", priority: 0.9 },
    { path: "/reader/quickstart", priority: 0.8 },
    { path: "/campus/teaching-pack", priority: 0.8 },
    { path: "/campus/syllabus", priority: 0.8 },
    { path: "/campus/apply", priority: 0.7 },
    { path: "/enterprise/diagnosis", priority: 0.8 },
    { path: "/enterprise/apply", priority: 0.7 },
    { path: "/resources", priority: 0.6 },
    { path: "/industries", priority: 0.7 },
    { path: "/policies", priority: 0.7 },
    { path: "/partners", priority: 0.6 },
    { path: "/verify", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  const urls: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority,
  }));

  for (const ch of CHAPTERS) {
    urls.push({ url: `${BASE}/book/chapters/${ch.id}`, changeFrequency: "monthly", priority: 0.7 });
  }
  for (const audience of AUDIENCES) {
    urls.push({ url: `${BASE}/${audience}/paths`, changeFrequency: "monthly", priority: 0.6 });
    for (const p of PATHS.filter((x) => x.audience === audience && x.status !== "预告")) {
      urls.push({ url: `${BASE}/${audience}/paths/${p.id}`, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const c of CASES) {
      urls.push({ url: `${BASE}/${audience}/cases/${c.id}`, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const l of LABS.filter(l => l.status === "已开放体验")) {
      urls.push({ url: `${BASE}/${audience}/experience/${l.id}`, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  for (const s of SOLUTIONS) {
    urls.push({ url: `${BASE}/enterprise/solutions/${s.id}`, changeFrequency: "monthly", priority: 0.6 });
  }

  return urls;
}
