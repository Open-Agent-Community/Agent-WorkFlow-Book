import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
import { AUDIENCES, AUDIENCE_INFO, isAudience, chapterHref } from "@/lib/audience";
import { LABS, getLab } from "@/content/labs";
import { getChapter } from "@/content/chapters";
import { FlowBuilderLab } from "@/components/interactive/FlowBuilderLab";
import { PromptLab } from "@/components/interactive/PromptLab";
import { Card, PageHero, StatusBadge, Tag } from "@/components/ui/primitives";

interface PageProps {
  params: Promise<{ audience: string; labId: string }>;
}

export function generateStaticParams() {
  return LABS.flatMap((lab) => AUDIENCES.map((audience) => ({ audience, labId: lab.id })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience, labId } = await params;
  const lab = getLab(labId);
  if (!isAudience(audience) || !lab) return { robots: { index: false, follow: true }, title: "公开模拟体验" };
  return pageSeo(`/${audience}/experience/${labId}`, {
    title: `${lab.title} · ${AUDIENCE_INFO[audience].name}公开模拟体验`,
    robots: { index: lab.status === "已开放体验", follow: true },
    description: `${AUDIENCE_INFO[audience].name}公开模拟体验：${lab.scenario} 使用预设教学素材，不调用真实模型，不保存学习进度。`,
  });
}

export default async function LabExperiencePage({ params }: PageProps) {
  const { audience, labId } = await params;
  if (!isAudience(audience)) notFound();

  const lab = getLab(labId);
  if (!lab) notFound();

  const chapters = lab.chapters.map((cid) => ({ id: cid, chapter: getChapter(cid) }));

  return (
    <main id="main" className="support-page">{lab.status==='已开放体验'&&<SeoBreadcrumbs items={[{name:AUDIENCE_INFO[audience].name,href:`/${audience}`},{name:lab.title,href:`/${audience}/experience/${lab.id}`}]}/>}
      <PageHero
        compact
        eyebrow={lab.id}
        title={lab.title}
        description={`${AUDIENCE_INFO[audience].name} · 公开模拟体验。公开体验为模拟演示，不保存进度；完整的学习记录与作品保存将在正式版提供。`}
        actions={
          <>
            <StatusBadge status={lab.status} />
            <StatusBadge status={lab.mode} />
          </>
        }
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* 主栏：交互区 */}
          <div>
            {lab.interactive === "flow-builder" ? (
              <FlowBuilderLab />
            ) : lab.interactive === "prompt-lab" ? (
              <PromptLab />
            ) : (
              /* 筹备中占位卡 */
              <Card className="rounded-2xl border-amber-200 bg-amber-50">
                <StatusBadge status="筹备中" />
                <p className="mt-4 font-semibold text-amber-900">该实验将在后续版本开放</p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  已完成规划的情境与交付：
                </p>
                <p className="mt-2 rounded-xl bg-white/70 px-4 py-3 text-sm leading-6 text-amber-900">
                  {lab.scenario}
                </p>
                <p className="mt-4 text-sm font-medium text-amber-900">关联章节导读：</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {chapters.map(({ id, chapter }) => (
                    <Link
                      key={id}
                      href={chapterHref(id, audience)}
                      className="rounded-full border border-amber-200 bg-white px-2.5 py-0.5 text-xs font-medium text-amber-800 transition hover:border-accent hover:text-accent-strong"
                    >
                      {id} {chapter?.title ?? ""}
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 侧栏：实验信息 */}
          <aside className="space-y-4">
            <Card className="rounded-2xl">
              <p className="font-semibold text-ink-900">实验信息</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag color="gray">{lab.id}</Tag>
                <StatusBadge status={lab.status} />
                <StatusBadge status={lab.mode} />
              </div>
              <dl className="mt-4 space-y-4 text-sm leading-6">
                <div>
                  <dt className="font-medium text-ink-800">情境与交付</dt>
                  <dd className="mt-1 text-ink-600">{lab.scenario}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-800">适用人群</dt>
                  <dd className="mt-1 text-ink-600">
                    {lab.audiences.map((a) => AUDIENCE_INFO[a].name).join("、")}
                  </dd>
                </div>
              </dl>
            </Card>
            <Card className="rounded-2xl">
              <p className="font-semibold text-ink-900">关联章节</p>
              <ul className="mt-3 space-y-2">
                {chapters.map(({ id, chapter }) => (
                  <li key={id}>
                    <Link
                      href={chapterHref(id, audience)}
                      className="group flex items-baseline gap-2 text-sm leading-6"
                    >
                      <span className="font-mono font-semibold text-accent-strong">{id}</span>
                      <span className="text-ink-600 group-hover:text-accent-strong group-hover:underline underline-offset-4">
                        {chapter?.title ?? ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="rounded-2xl border-blue-200 bg-blue-50">
              <p className="text-sm leading-6 text-blue-900">
                公开体验为模拟，不保存进度；模拟日志不以真实模型运行结果的形式呈现。
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
