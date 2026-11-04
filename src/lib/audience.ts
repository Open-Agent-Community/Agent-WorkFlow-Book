/** 三版人群 slug 与基本信息（§3.1/§3.2） */
export const AUDIENCES = ["reader", "campus", "enterprise"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCE_INFO: Record<
  Audience,
  { slug: Audience; name: string; shortName: string; home: string; tagline: string }
> = {
  reader: {
    slug: "reader",
    name: "普通读者版",
    shortName: "普通读者",
    home: "/reader",
    tagline: "读完一章，做成一件事",
  },
  campus: {
    slug: "campus",
    name: "高校版",
    shortName: "高校",
    home: "/campus",
    tagline: "把智能体工作流带进课堂",
  },
  enterprise: {
    slug: "enterprise",
    name: "企业版",
    shortName: "企业",
    home: "/enterprise",
    tagline: "让企业 AI 能力，完成跃迁",
  },
};

export function isAudience(value: string): value is Audience {
  return (AUDIENCES as readonly string[]).includes(value);
}

/** 版本切换目标（§3.7）：公开页直接前往目标版首页；
 *  案例在三版均有对应改造内容（§5.3），保留 caseId；
 *  章节导读保留 chapterId，人群仅作为查询参数。 */
export function switchTarget(pathname: string, target: Audience): string {
  const parts = pathname.split("/").filter(Boolean);
  const current = parts[0];
  if (current === "book" && parts[1] === "chapters" && parts[2]) {
    return `/book/chapters/${parts[2]}?audience=${target}`;
  }
  if (current && isAudience(current) && current !== target) {
    if (parts[1] === "cases" && parts[2]) {
      return `/${target}/cases/${parts[2]}`;
    }
    return AUDIENCE_INFO[target].home;
  }
  return AUDIENCE_INFO[target].home;
}

/** Keep the reading context while navigating shared chapter guides. */
export function chapterHref(chapterId: string, audience?: Audience | null): string {
  return `/book/chapters/${chapterId}${audience ? `?audience=${audience}` : ""}`;
}
