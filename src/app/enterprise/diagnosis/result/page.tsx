import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { ArrowCard, ButtonLink, Card, PageHero, StatusBadge, Tag } from "@/components/ui/primitives";
import { PROBLEM_OPTIONS, recommendSolution } from "@/content/solutions";

export const metadata: Metadata = pageSeo("/enterprise/diagnosis/result", {
  title: "诊断结果预览",
  robots: { index: false, follow: true },
  description: "按预设规则生成的企业试点建议示例：推荐起点、首项任务、交付物、资料边界、审核人与业务基线。",
});

/** §8.5 需建立的业务基线 */
const BASELINE_METRICS = ["同类任务耗时", "返工", "错误", "复用", "人工审核成本", "运行费用"];

const ANSWER_KEYS = ["problem", "dept", "tools", "data", "reviewer"] as const;

/** §8.2 推荐规则的可解释说明 */
function explainRule(problem: string): string {
  if (problem === "risk") return "风险优先 P06：对资料与输出风险的担忧需要先建立资料分级、授权、核查与审核责任，再扩大使用范围。";
  if (problem === "no-scene") return "管理者缺场景优先 P01：先明确使用者、输入输出、负责人和验收口径，再选择公开客服练习或人工沟通。";
  return "按任务匹配：依据你选择的最急问题，匹配对应的 P 系列入口作为起步方案。";
}

export default async function DiagnosisResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return typeof v === "string" && v.trim() ? v : undefined;
  };
  const answers = Object.fromEntries(ANSWER_KEYS.map((k) => [k, get(k)]));
  const missing = ANSWER_KEYS.filter((k) => !answers[k]);

  // 缺任意一项：提示并返回诊断页
  if (missing.length > 0) {
    return (
      <main id="main" className="support-page">
        <PageHero
          compact
          eyebrow="企业版 · 试点建议预览"
          title="诊断条件不完整"
          description={`本页由公开轻量诊断的五项选择生成，当前缺少 ${missing.length} 项条件（${missing.join("、")}），无法生成试点建议示例。`}
        />
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <ButtonLink href="/enterprise/diagnosis">返回完成五项选择</ButtonLink>
        </div>
      </main>
    );
  }

  const { problem, dept, tools, data, reviewer } = answers as Record<(typeof ANSWER_KEYS)[number], string>;
  const solution = recommendSolution(problem);
  const problemLabel = PROBLEM_OPTIONS.find((o) => o.value === problem)?.label ?? problem;
  const reviewerPending = reviewer === "尚未确定";

  // 「返回修改条件」携带同样查询参数
  const backQuery = new URLSearchParams({ problem, dept, tools, data, reviewer }).toString();

  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="企业版 · 诊断结果"
        title="试点建议预览"
        description="本页为预设规则生成的示例：不存储企业真实材料，不自动创建正式方案。结果仅供选择公开练习和人工咨询方向，不是正式评估。"
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        {/* 你的选择 */}
        <Card className="rounded-2xl">
          <p className="font-semibold text-ink-900">你的选择</p>
          <dl className="mt-3 grid gap-2 text-sm leading-6 sm:grid-cols-2">
            <div><dt className="inline font-medium text-ink-800">最急问题：</dt><dd className="inline text-ink-600">{problemLabel}</dd></div>
            <div><dt className="inline font-medium text-ink-800">试点部门：</dt><dd className="inline text-ink-600">{dept}</dd></div>
            <div><dt className="inline font-medium text-ink-800">已有工具：</dt><dd className="inline text-ink-600">{tools}</dd></div>
            <div><dt className="inline font-medium text-ink-800">资料范围：</dt><dd className="inline text-ink-600">{data}</dd></div>
            <div><dt className="inline font-medium text-ink-800">审核责任：</dt><dd className="inline text-ink-600">{reviewer}</dd></div>
          </dl>
        </Card>

        {/* 推荐起点：深色大卡 */}
        <div className="card-hover mt-6 rounded-2xl bg-ink-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-bold">
              推荐起点：<span className="font-mono text-accent">{solution.id}</span>（{solution.scene}）
            </p>
            <StatusBadge status={solution.v1 ? "方案参考" : "筹备中"} />
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-200">推荐规则：{explainRule(problem)}</p>
          {!solution.v1 && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm leading-6 text-amber-700">
              ◐ 该方案的完整内容将在后续版本开放；当前可先完成公开客服练习与审核记录。
            </p>
          )}
        </div>

        {/* 首项任务 / 构成 / 交付物 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="card-hover rounded-2xl">
            <p className="font-semibold text-ink-900">首项任务</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">{solution.firstStep}</p>
          </Card>
          <Card className="card-hover rounded-2xl">
            <p className="font-semibold text-ink-900">课程与实训构成</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">{solution.compose}</p>
          </Card>
          <Card className="card-hover rounded-2xl">
            <p className="font-semibold text-ink-900">建议交付物</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              依据构成「{solution.compose}」，整理任务参考，并在本地文档保留人工审核记录；本页不提供企业空间。
            </p>
          </Card>
        </div>

        {/* 资料边界 / 审核人 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">资料边界</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-600">
              <li>首练仅使用 S01—S04 模拟材料，不上传真实企业资料。</li>
              <li>当前选择的资料范围：{data}；本站不接收企业生产资料。正式任务的资料分级、授权与使用范围需另行确认。</li>
            </ul>
          </Card>
          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">审核人</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">当前选择：{reviewer}。</p>
            {reviewerPending && (
              <p className="mt-2 rounded-xl bg-red-50 px-4 py-2 text-sm leading-6 text-red-700">
                尚未确定审核责任人：需要审核的任务须经审核员批准后才算达成，试点启动前请先指定审核责任人。
              </p>
            )}
          </Card>
        </div>

        {/* 业务基线 */}
        <Card className="mt-6 rounded-2xl">
          <p className="font-semibold text-ink-900">需建立的业务基线</p>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            业务改善只在同类任务、相近难度、可比样本下计算；公开诊断不采集业务数据，以下各项当前均为「待采集」：
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BASELINE_METRICS.map((m) => (
              <Tag key={m} color="gray">
                {m} · 待采集
              </Tag>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            学习指标（前后测、必修完成、提交、审核通过、证书）与业务指标分开计算，不把学习完成率换算成业务收益。
          </p>
        </Card>

        {/* 下一步 */}
        <div className="mt-10">
          <p className="text-sm font-semibold tracking-widest text-accent-strong">下一步</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ArrowCard
              href={`/enterprise/diagnosis?${backQuery}`}
              title="返回修改条件"
              desc="保留当前五项选择，回到诊断页调整后重新生成。"
            />
            <ArrowCard
              href="/enterprise/apply"
              title="申请企业试点"
              desc="提交企业与试点信息，由人工确认任务与服务范围。"
            />
            <ArrowCard
              href={`/enterprise/solutions/${solution.id}`}
              title={`查看 ${solution.id} 方案详情`}
              desc="了解该入口的适用条件、起步动作与关联原书章节。"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
