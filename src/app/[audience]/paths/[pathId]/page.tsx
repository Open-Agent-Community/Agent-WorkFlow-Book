import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import {DetailNavigation,DetailBrief} from '@/components/DetailNavigation';
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
import { AUDIENCE_INFO, isAudience, chapterHref } from "@/lib/audience";
import { CORE_ROUTES } from "@/content/delivery";
import { PATHS, getPath } from "@/content/paths";
import { getChapter } from "@/content/chapters";
import {
  ArrowCard,
  ButtonLink,
  Card,
  PageHero,
  StatusBadge,
  Timeline,
} from "@/components/ui/primitives";

interface PageProps {
  params: Promise<{ audience: string; pathId: string }>;
}

export function generateStaticParams() {
  return PATHS.map((p) => ({ audience: p.audience, pathId: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience, pathId } = await params;
  if (!isAudience(audience)) return { robots: { index: false, follow: true }, title: "学习路径" };
  const path = getPath(audience, pathId);
  if (!path) return { robots: { index: false, follow: true }, title: "学习路径" };
  return pageSeo(`/${audience}/paths/${pathId}`, {
    title: `${path.title} · ${AUDIENCE_INFO[audience].name}学习路径`,
    description: path.summary,
    robots: { index: path.status !== "预告", follow: true },
  });
}

export default async function PathDetailPage({ params }: PageProps) {
  const { audience, pathId } = await params;
  if (!isAudience(audience)) notFound();

  const path = getPath(audience, pathId);
  if (!path) notFound();

  const info = AUDIENCE_INFO[audience];
  const firstChapter = path.chapters[0];

  return (
    <main id="main" className="detail-page path-detail">{path.status!=='预告'&&<SeoBreadcrumbs items={[{name:info.name,href:`/${audience}`},{name:'学习路径',href:`/${audience}/paths`},{name:path.title,href:`/${audience}/paths/${path.id}`}]}/>}
      <PageHero
        compact
        eyebrow={path.id}
        title={path.title}
        description={`${info.name}学习路径 · ${path.summary}`}
        actions={<StatusBadge status={path.status} />}
      />

      <DetailNavigation links={[{href:`/${audience}/paths`,label:'返回学习路径'},{href:`/${audience}`,label:info.name},{href:'/resources',label:'公开配套材料'}]}/>
      <DetailBrief title="开始前先确认" items={[{label:'适合对象',value:path.audienceLabel},{label:'先修要求',value:path.prerequisite},{label:'交付成果',value:path.outcome}]} note={path.status==='已发布'?'先了解任务地图，再按关联章节阅读。章节导读不等于完整课程。':'本路径正在筹备，以下为内容介绍；关联章节可独立阅读。'}/>

      <div className="path-content mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* 主栏 */}
          <div>
            {/* 任务地图 */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-ink-900">任务地图</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                按顺序完成以下步骤，每一步对应明确的动作或交付。
              </p>
              <Card className="mt-5 rounded-2xl">
                {path.status === '已发布' ? <ol className="delivery-route">{CORE_ROUTES[audience].steps.map(([title,description,href])=><li key={title}><div><h3>{title}</h3><p>{description}</p><a href={href}>执行这一步 →</a></div></li>)}</ol> : <><p>以下为参考安排，当前不要求完成筹备内容。</p>{path.nodes.map((node,i)=><p key={node}>{i+1}. {node}</p>)}<a href={audience==='campus'?'/campus/syllabus':chapterHref(path.chapters[0],audience)}>查看参考资料 →</a><p><a href={CORE_ROUTES[audience].learn}>先完成已开放的核心实践 →</a></p></>}
              </Card>
            </section>

            {/* 原书重点章节 */}
            <section className="mt-12">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">原书重点章节</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                以下章节提供公开导读，可先阅读再进入路径任务；章节展示关系不等于完成关系。
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {path.chapters.map((cid) => {
                  const ch = getChapter(cid);
                  return (
                    <ArrowCard
                      key={cid}
                      href={chapterHref(cid, audience)}
                      title={
                        <>
                          <span className="mr-2 font-mono text-sm font-bold text-accent-strong">{cid}</span>
                          {ch?.title ?? cid}
                        </>
                      }
                      desc={ch ? `学习目标：${ch.goal}` : undefined}
                    />
                  );
                })}
              </div>
            </section>

            {/* 开始入口 */}
            <div className="mt-12">
              {path.status === "已发布" && firstChapter ? (
                <ButtonLink href={CORE_ROUTES[audience].learn} variant="primary">
                  开始已开放实践 →
                </ButtonLink>
              ) : (
                <Card className="rounded-2xl border-amber-200 bg-amber-50">
                  <p className="text-sm leading-6 text-amber-800">
                    ◐ 完整路径将在后续版本开放，可先体验已开放的章节导读与实验。
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* 侧栏信息卡 */}
          <aside className="space-y-4">

            <Card className="rounded-2xl">
              <p className="font-semibold text-ink-900">所属版本</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">{info.name} · {info.tagline}</p>
              <div className="mt-3">
                <Link
                  href={`/${audience}/paths`}
                  className="text-sm font-medium text-accent-strong hover:underline underline-offset-4"
                >
                  查看全部{info.shortName}路径 →
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
