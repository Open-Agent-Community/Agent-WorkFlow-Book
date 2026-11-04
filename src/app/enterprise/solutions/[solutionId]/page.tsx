import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import { chapterHref } from "@/lib/audience";
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
import {
  ArrowCard,
  ButtonLink,
  Card,
  DarkBand,
  PageHero,
  StatusBadge,
  Tag,
} from "@/components/ui/primitives";
import { getSolution, SOLUTIONS } from "@/content/solutions";

/** §8.4 原书章节分组（按方案性质选择相关组展示） */
const BOOK_GROUPS: Record<string, { label: string; desc: string; ids: string[] }> = {
  diagnose: { label: "B01—B03 诊断业务流程", desc: "帮助诊断业务流程、定义任务与分工。", ids: ["B01", "B02", "B03"] },
  method: { label: "B04—B06 模式与评估", desc: "支持工作流专业课的模式选择、编排与评估。", ids: ["B04", "B05", "B06"] },
  tech: { label: "B07—B10 工具与自动化", desc: "支持工具选型、平台搭建、办公自动化与数字员工任务边界。", ids: ["B07", "B08", "B09", "B10"] },
  practice: { label: "B11—B13 行业案例", desc: "支持教育、营销、制造试点案例。", ids: ["B11", "B12", "B13"] },
};

/** 各方案关联的原书章节组（按方案性质选择） */
const SOLUTION_BOOK_GROUPS: Record<string, (keyof typeof BOOK_GROUPS)[]> = {
  P01: ["diagnose", "practice"],
  P02: ["diagnose"],
  P03: ["tech"],
  P04: ["diagnose", "practice"],
  P05: ["method"],
  P06: ["tech", "practice"],
  P07: ["method", "tech"],
  P08: ["practice", "diagnose"],
};

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ solutionId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ solutionId: string }>;
}): Promise<Metadata> {
  const { solutionId } = await params;
  const solution = getSolution(solutionId);
  if (!solution) return { title: "方案未找到", robots: { index: false, follow: true } };
  return pageSeo(`/enterprise/solutions/${solutionId}`, {
    title: `${solution.id}｜${solution.scene}`,
    description: `企业方案 ${solution.id}：${solution.scene}。起步动作：${solution.firstStep}。`,
  });
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ solutionId: string }>;
}) {
  const { solutionId } = await params;
  const solution = getSolution(solutionId);
  if (!solution) notFound();

  const groups = SOLUTION_BOOK_GROUPS[solution.id] ?? ["diagnose"];
  const others = SOLUTIONS.filter((s) => s.id !== solution.id);

  return (
    <main id="main" className="support-page"><SeoBreadcrumbs items={[{name:'企业版',href:'/enterprise'},{name:solution.scene,href:`/enterprise/solutions/${solution.id}`}]}/>
      <PageHero
        compact
        eyebrow="企业方案"
        title={
          <>
            <span className="font-mono text-accent">{solution.id}</span> · {solution.scene}
          </>
        }
        description={`适用诊断条件：${solution.condition}`}
        actions={<StatusBadge status={solution.v1 ? "方案参考" : "筹备中"} />}
      />

      <p className="shell delivery-inline"><a href="/learn/enterprise/">先完成已开放的客服实践 →</a></p>
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {!solution.v1 && (
          <p className="mb-8 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
            ◐ 该方案完整内容在后续版本开放；当前可先完成公开客服练习。
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* 主栏 */}
          <div>
            {/* 方案要点大卡 */}
            <Card className="rounded-2xl border-l-4 border-l-accent-strong">
              <p className="font-semibold text-ink-900">方案要点</p>
              <dl className="mt-4 space-y-4 text-sm leading-6">
                <div>
                  <dt className="font-medium text-ink-800">适用诊断条件</dt>
                  <dd className="mt-1 text-ink-600">{solution.condition}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-800">起步动作</dt>
                  <dd className="mt-1 text-ink-600">{solution.firstStep}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-800">建议材料与范围</dt>
                  <dd className="mt-1 text-ink-600">{solution.compose}</dd>
                </div>
              </dl>
            </Card>

            {/* 关联原书章节（§8.4） */}
            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">关联原书章节</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                章节为《智能体工作流设计：方法与实践》的公开导读；具体课程与章节的映射由运营校对后发布，主题相近不自动授予完成记录。
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {groups.map((g) => {
                  const group = BOOK_GROUPS[g];
                  return (
                    <ArrowCard
                      key={g}
                      href={chapterHref(group.ids[0], "enterprise")}
                      title={group.label}
                      desc={group.desc}
                      meta={
                        <>
                          {group.ids.map((id) => (
                            <Tag key={id} color="teal">
                              {id}
                            </Tag>
                          ))}
                        </>
                      }
                    />
                  );
                })}
              </div>
            </section>
          </div>

          {/* 侧栏 */}
          <aside className="space-y-4">
            <Card className="rounded-2xl">
              <p className="font-semibold text-ink-900">方案状态</p>
              <div className="mt-3">
                <StatusBadge status={solution.v1 ? "方案参考" : "筹备中"} />
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                {solution.v1
                  ? "本页是方案参考，不是完整课程。可先用公开客服练习理解审核与复盘，再人工确认实际任务。"
                  : "该方案完整内容将在后续版本开放，当前标注为预告。"}
              </p>
            </Card>
            <Card className="rounded-2xl">
              <p className="font-semibold text-ink-900">其他方案</p>
              <ul className="mt-3 space-y-2">
                {others.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/enterprise/solutions/${s.id}`}
                      className="group flex items-baseline gap-2 text-sm leading-6"
                    >
                      <span className="font-mono font-semibold text-accent-strong">{s.id}</span>
                      <span className="text-ink-600 group-hover:text-accent-strong group-hover:underline underline-offset-4">
                        {s.scene}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </div>

      {/* 底部 CTA */}
      <DarkBand className="text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">用五项诊断确认 {solution.id} 是否适合你</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-ink-200">
            公开诊断按预设规则推荐起步入口；确认方向后提交企业试点申请，由人工运营确认材料与服务范围。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/enterprise/diagnosis">用五项诊断确认起点</ButtonLink>
            <ButtonLink href="/enterprise/apply" variant="darkSecondary">
              申请企业试点
            </ButtonLink>
          </div>
        </div>
      </DarkBand>
    </main>
  );
}
