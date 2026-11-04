import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { QuickstartFlow } from "@/components/interactive/QuickstartFlow";
import { ArrowCard, PageHero, StatusBadge } from "@/components/ui/primitives";

export const metadata: Metadata = pageSeo("/reader/quickstart", {
  title: "五分钟首练｜普通读者版｜智能体工作流设计",
  description:
    "五分钟首练：做出你的第一张流程卡。选一个熟悉的任务，选出两个处理步骤和交付前的人工核查方式，生成可复制的流程卡。匿名可体验、使用模拟情境、不上传资料。",
});

export default function QuickstartPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="普通读者版 · 公开体验"
        title="五分钟首练：做出你的第一张流程卡"
        description="只需三步：选一个你熟悉的任务 → 选出两个处理步骤 → 选择交付前的人工核查方式，即可生成一张可复制的流程卡，对应原书 B01—B03 的流程要素、工作流与人工分工。匿名即可体验；全程使用模拟情境，不上传任何真实资料；生成内容仅为演示。"
      />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        <QuickstartFlow />

        {/* 下一步去哪里 */}
        <div className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-ink-900">下一步去哪里</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ArrowCard
              href="/book/chapters/B01"
              title="B01 章节导读"
              desc="回到原书第一章，看懂业务流程的基本要素。"
            />
            <ArrowCard
              href="/reader/experience/LAB-01"
              meta={<StatusBadge status="已开放体验" />}
              title="LAB-01 公开实验"
              desc="拆解一条内容选题流程，提交你的流程图。"
            />
            <ArrowCard
              href="/reader/paths"
              title="学习路径"
              desc="查看五条读者路径，从零基础主路径 R-PATH-01 开始。"
            />
          </div>
          <p className="mt-6 border-t border-ink-100 pt-6 text-sm">
            <Link href="/reader" className="text-ink-600 hover:underline underline-offset-4">
              返回普通读者版首页
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
