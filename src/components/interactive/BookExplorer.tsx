"use client";

import Link from "@/components/layout/SiteLink";
import { useState } from "react";
import { PARTS, PART_STYLE, chaptersByPart, type Chapter } from "@/content/chapters";
import { PATHS } from "@/content/paths";
import { AUDIENCES, AUDIENCE_INFO, chapterHref, type Audience } from "@/lib/audience";
import { cx } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/primitives";

/** §8.4：书籍内容怎样服务企业 */
function enterpriseTip(chapterId: string): string {
  const n = Number(chapterId.slice(1));
  if (n <= 3) return "用于诊断业务流程、定义任务与人工 / AI 分工。";
  if (n <= 6) return "支持工作流专业课的模式选择、编排与评估。";
  if (n <= 10) return "支持工具选型、平台搭建、办公自动化与数字员工任务边界。";
  return "对应教育、营销、制造的试点案例，可作为业务试点参考。";
}

/** 按人群生成每章下方的学习建议（只改变建议文案，不改变原书章名与编号） */
function audienceTip(audience: Audience, chapter: Chapter): string {
  if (audience === "enterprise") return enterpriseTip(chapter.id);
  if (audience === "campus") {
    return "可参考高校 16 周参考教学安排组织本章教学（见 /campus/syllabus）。";
  }
  const related = PATHS.filter((p) => p.audience === "reader" && p.chapters.includes(chapter.id));
  if (related.length > 0) {
    return `对应读者路径：${related.map((p) => `「${p.title}」${p.id}`).join("、")}。`;
  }
  return "建议先完成 R-PATH-01「第一个工作流」，再按兴趣选修本章。";
}

export function BookExplorer() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<Audience>("reader");
  const [openParts, setOpenParts] = useState<Set<string>>(() => new Set(PARTS.map((p) => p.id)));

  const q = query.trim();
  const togglePart = (id: string) => {
    setOpenParts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* 检索 + 人群切换 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="按章节主题检索，如：提示词、营销、工作流"
          aria-label="检索章节主题"
          className="w-full max-w-sm rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300"
        />
        <div role="group" aria-label="按人群推荐阅读" className="flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1">
          {AUDIENCES.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={audience === a}
              onClick={() => setAudience(a)}
              className={cx(
                "rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm",
                audience === a ? "bg-accent text-ink-950" : "text-ink-600 hover:text-ink-900"
              )}
            >
              {AUDIENCE_INFO[a].shortName}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-300">
        切换人群只更新每章下方的学习建议；原书章节名称与编号保持不变。
      </p>

      {/* 四篇目录 */}
      <div className="mt-6 space-y-4">
        {PARTS.map((part) => {
          const style = PART_STYLE[part.id];
          const all = chaptersByPart(part.id);
          const shown = q ? all.filter((c) => c.title.includes(q) || c.goal.includes(q)) : all;
          if (q && shown.length === 0) return null;
          const expanded = q ? true : openParts.has(part.id);
          return (
            <div key={part.id} className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => togglePart(part.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className={cx("flex items-center gap-2 font-bold", style.text)}>
                  <span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", style.dot)} />
                  {part.name}
                  <span className="text-xs font-normal text-ink-300">{all.length} 章</span>
                </span>
                <span aria-hidden className={cx("text-ink-300 transition-transform", expanded && "rotate-45")}>
                  ＋
                </span>
              </button>
              {expanded && (
                <ul className="divide-y divide-ink-100 border-t border-ink-100">
                  {shown.map((ch) => (
                    <li key={ch.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <Link
                          href={chapterHref(ch.id, audience)}
                          className="font-semibold text-ink-900 hover:text-accent-strong hover:underline underline-offset-4"
                        >
                          <span className="mr-2 font-mono text-xs text-ink-300">{ch.id}</span>
                          {ch.title}
                        </Link>
                        <span className="flex items-center gap-1.5 text-xs text-ink-600">
                          章节导读 <StatusBadge status="已发布" />
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-ink-600">
                          配套课程 <StatusBadge status="筹备中" />
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-ink-600">学习目标：{ch.goal}</p>
                      <p className="mt-1 text-xs leading-5 text-ink-300">
                        {AUDIENCE_INFO[audience].shortName}建议：{audienceTip(audience, ch)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {q && PARTS.every((p) => !chaptersByPart(p.id).some((c) => c.title.includes(q) || c.goal.includes(q))) && (
          <p className="rounded-xl border border-ink-100 bg-white px-5 py-8 text-center text-sm text-ink-600">
            没有匹配「{q}」的章节，换个关键词试试。
          </p>
        )}
      </div>
    </div>
  );
}
