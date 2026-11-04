import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DiagnosisWizard } from "@/components/interactive/DiagnosisWizard";
import { Card, PageHero } from "@/components/ui/primitives";

export const metadata: Metadata = pageSeo("/enterprise/diagnosis", {
  title: "企业公开轻量诊断",
  description:
    "依次选择最急问题、试点部门、已有工具、可用资料范围与审核责任，按预设规则生成一页试点建议示例。",
});

/** §4.5 五项轻量选择说明 */
const DIAGNOSIS_ITEMS = [
  { title: "最急问题", desc: "从八类常见困境中选择最贴近现状的一条，决定推荐规则的匹配方向。" },
  { title: "试点部门", desc: "选择计划先试点的部门，建议从一个边界清晰的团队开始。" },
  { title: "已有工具", desc: "说明是否已采购 AI 工具及其使用情况，影响起步动作的组合方式。" },
  { title: "资料范围", desc: "选择可用于试点的资料范围；首练仅使用 S01—S04 模拟材料。" },
  { title: "审核责任", desc: "明确由谁审核需要审核的任务；尚未确定时会给出指定提示。" },
];

export default function DiagnosisPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="企业版 · 公开轻量诊断"
        title="五次选择，得到一页试点建议"
        description="不需要注册，也不上传任何企业资料。完成五项选择后，将按「风险优先 P06；管理者缺场景优先 P01；其余按任务匹配」的预设规则生成一份试点建议示例，你可以随时返回修改条件。"
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        {/* 五项选择说明 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DIAGNOSIS_ITEMS.map((item, i) => (
            <Card key={item.title} className="card-hover rounded-2xl p-4">
              <p className="text-sm font-semibold text-ink-900">
                <span className="mr-1.5 font-mono font-bold text-accent-strong">{i + 1}</span>
                {item.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-ink-600">{item.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-ink-900">开始诊断</h2>
          <div className="mt-5">
            <Suspense fallback={<p className="rounded-xl border border-ink-100 bg-white p-6 text-sm text-ink-600">诊断表单加载中…</p>}>
              <DiagnosisWizard />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
