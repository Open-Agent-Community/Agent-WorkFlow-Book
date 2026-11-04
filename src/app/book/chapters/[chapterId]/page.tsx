import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import {DetailNavigation} from '@/components/DetailNavigation';
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
import {
  ArrowCard,
  ButtonLink,
  Card,
  PageHero,
  Section,
  StatusBadge,
  Tag,
} from "@/components/ui/primitives";
import { CHAPTER_GUIDES } from "@/content/chapter-guides";
import { CHAPTERS, PARTS, PART_STYLE, chaptersByPart, getChapter } from "@/content/chapters";
import { LABS } from "@/content/labs";
import { PATHS } from "@/content/paths";
import { AUDIENCES, AUDIENCE_INFO, isAudience, chapterHref, type Audience } from "@/lib/audience";
import { cx } from "@/lib/utils";

interface PageProps {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ audience?: string }>;
}

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapterId: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) return { robots: { index: false, follow: true }, title: "章节不存在" };
  return pageSeo(`/book/chapters/${chapterId}`, {
    title: `${chapter.id} ${chapter.title}｜章节导读`,
    description: `《智能体工作流设计：方法与实践》${chapter.id}「${chapter.title}」章节导读：${chapter.goal}。本页为章节导读，不是完整课程。`,
  });
}

/** §8.4：书籍内容怎样服务企业 */
function enterpriseTip(chapterId: string): string {
  const n = Number(chapterId.slice(1));
  if (n <= 3) return "用于诊断业务流程、定义任务与人工 / AI 分工。";
  if (n <= 6) return "支持工作流专业课的模式选择、编排与评估。";
  if (n <= 10) return "支持工具选型、平台搭建、办公自动化与数字员工任务边界。";
  return "对应教育、营销、制造的试点案例，可作为业务试点参考。";
}

function audienceTip(audience: Audience, chapterId: string): string {
  if (audience === "enterprise") return enterpriseTip(chapterId);
  if (audience === "campus") {
    return "可参考高校 16 周参考教学安排组织本章教学（见 /campus/syllabus）。";
  }
  const related = PATHS.filter((p) => p.audience === "reader" && p.chapters.includes(chapterId));
  if (related.length > 0) {
    return `对应读者路径：${related.map((p) => `「${p.title}」${p.id}`).join("、")}。`;
  }
  return "建议先完成 R-PATH-01「第一个工作流」，再按兴趣选修本章。";
}

export default async function ChapterGuidePage({ params, searchParams }: PageProps) {
  const { chapterId } = await params;
  const { audience: audienceRaw } = await searchParams;
  const chapter = getChapter(chapterId);
  if (!chapter) notFound();

  const guide = CHAPTER_GUIDES[chapter.id];
  const fde = audienceRaw === "fde";
  const part = PARTS.find((p) => p.id === chapter.part)!;
  const style = PART_STYLE[part.id];
  const indexInPart = chaptersByPart(part.id).findIndex((c) => c.id === chapter.id) + 1;

  const audience: Audience | null =
    audienceRaw && isAudience(audienceRaw) ? audienceRaw : null;

  const relatedPaths = PATHS.filter((p) => p.chapters.includes(chapter.id) && (!audience || p.audience === audience));
  const relatedLabs = LABS.filter((l) => l.chapters.includes(chapter.id));

  const chapterIndex = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const prev = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null;
  const next = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null;

  return (
    <main id="main" className="detail-page chapter-guide"><SeoBreadcrumbs items={[{name:'配套资源',href:'/resources'},{name:`${chapter.id} ${chapter.title}`,href:`/book/chapters/${chapter.id}`}]}/>
      {/* 章节头部 */}
      <PageHero
        compact
        eyebrow={part.name}
        title={
          <>
            <span className="mr-3 font-mono text-ink-300">{chapter.id}</span>
            {chapter.title}
          </>
        }
        description={chapter.goal}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-ink-200">
          <span className="flex items-center gap-2">
            <span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", style.dot)} />
            原书位置：{part.name} · 第 {Number(chapter.id.slice(1))} 章
          </span>
          <span className="flex items-center gap-2">
            <StatusBadge status="已发布" />
            <span className="text-xs text-ink-300">章节导读</span>
          </span>
          <span className="flex items-center gap-2">
            <StatusBadge status="筹备中" />
            <span className="text-xs text-ink-300">配套课程</span>
          </span>
        </div>
        <p className="mt-6 inline-block max-w-2xl rounded-xl border border-amber-200/40 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-200">
          本页为章节导读，不是完整课程。B 编号为原书章节编号，完整课程将按发布状态逐步开放。
        </p>
      </PageHero>

      <DetailNavigation links={[{href:"/resources#book",label:"返回完整目录"},{href:"/resources",label:"公开配套材料"},...(audience?[{href:`/${audience}`,label:AUDIENCE_INFO[audience].name}]:[])]}/>
      <Section id="chapter-reading" title="先抓住这一章要解决的问题"><div className="delivery-reading"><p className="delivery-note">以下是本站原创阅读辅助与合成解释性例子，不是原书摘录，也不代表作者逐字审定的正文；原书细节以正式出版物为准。</p><h3>核心概念</h3><p>{guide.concept}</p><h3>用一个例子理解</h3><p>{guide.example}</p><h3>带着问题阅读</h3><ol>{guide.questions.map(q=><li key={q}>{q}</li>)}</ol><p><a className="delivery-primary" href={fde?'/learn/fde-project/':audience==='campus'?'/learn/campus/':audience==='enterprise'?'/learn/enterprise/':'/learn/reader/'}>下一步：用公开实践检验理解 →</a></p>{fde&&<p><a href="/fde">返回FDE版 →</a></p>}</div></Section>
      {/* 主体：双栏布局 */}
      <Section eyebrow="导读" id="chapter-goals" title="学习目标与关联内容">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* 主栏 */}
          <div className="space-y-10">
            {/* 学习目标与建议交付物 */}
            <Card className="rounded-2xl p-6 sm:p-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-ink-900">
                    <span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", style.dot)} />
                    平台学习目标
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-600">{chapter.goal}</p>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-ink-900">
                    <span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", style.dot)} />
                    建议交互／交付物
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-600">{chapter.deliverable}</p>
                </div>
              </div>
            </Card>

            {/* 关联学习路径 */}
            <div>
              <h2 className="text-lg font-bold text-ink-900">{audience ? `${AUDIENCE_INFO[audience].name}的关联路径` : "包含本章的学习路径"}</h2>
              {relatedPaths.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedPaths.map((p) => (
                    <ArrowCard
                      key={p.id}
                      href={`/${p.audience}/paths/${p.id}`}
                      className="h-full rounded-2xl"
                      meta={
                        <>
                          <Tag color="gray">{AUDIENCE_INFO[p.audience].shortName}</Tag>
                          <StatusBadge status={p.status} />
                          <span className="font-mono text-xs text-ink-300">{p.id}</span>
                        </>
                      }
                      title={p.title}
                      desc={p.summary}
                    />
                  ))}
                </div>
              ) : (
                <Card className="mt-4 rounded-2xl">
                  <p className="text-sm leading-7 text-ink-600">
                    本章暂未纳入已发布的学习路径，可先阅读导读或体验公开实验。
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* 侧栏：篇章色信息卡 */}
          <aside className="chapter-sidebar lg:sticky lg:top-20 lg:self-start">
            <nav className="chapter-local-nav" aria-label="本章阅读导航"><p className="label">本章怎么读</p><a href="#chapter-reading">概念、例子与自查</a><a href="#chapter-goals">学习目标与关联路径</a><a href="#chapter-advice">按版本查看建议</a><a href="#chapter-practice">关联交互实验</a></nav>
            <div className={cx("rounded-2xl border border-ink-100 p-6 shadow-sm", style.bg)}>
              <p className={cx("flex items-center gap-2 text-sm font-bold", style.text)}>
                <span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", style.dot)} />
                章节信息
              </p>
              <dl className="mt-4 space-y-4 bg-white/70 p-4 text-sm">
                <div>
                  <dt className="text-xs text-ink-300">原书位置</dt>
                  <dd className="mt-1 font-medium text-ink-900">
                    {part.name} · 第 {Number(chapter.id.slice(1))} 章
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-300">篇章</dt>
                  <dd className="mt-1 font-medium text-ink-900">{part.shortName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-300">关联实验</dt>
                  <dd className="mt-1">
                    {relatedLabs.length > 0 ? (
                      <ul className="space-y-2">
                        {relatedLabs.map((lab) => (
                          <li key={lab.id} className="flex items-center justify-between gap-2">
                            <span className="font-medium text-ink-900">
                              <span className="mr-1 font-mono text-xs text-ink-300">{lab.id}</span>
                              {lab.title}
                            </span>
                            <StatusBadge status={lab.status} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-ink-600">本章暂未关联交互实验。</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      {/* 推荐学习建议（按人群，灰底） */}
      <div className="bg-ink-50">
        <Section
          eyebrow="按人群推荐"
          id="chapter-advice" title="推荐学习建议"
          description="选择人群只改变本区块的建议文案；原书章节名称与编号保持不变。"
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <Link
                key={a}
                href={`/book/chapters/${chapter.id}?audience=${a}`}
                aria-current={audience === a ? "page" : undefined}
                className={cx(
                  "rounded-full border px-4 py-2 text-xs font-medium transition sm:text-sm",
                  audience === a
                    ? "border-accent bg-accent text-ink-950 shadow-sm"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900"
                )}
              >
                {AUDIENCE_INFO[a].shortName}
              </Link>
            ))}
          </div>
          {audience ? (
            <Card className={cx("rounded-2xl border-l-4 p-6", style.bg)}>
              <p className="text-sm font-semibold text-ink-900">
                {AUDIENCE_INFO[audience].name}建议
              </p>
              <p className="mt-2 text-sm leading-7 text-ink-600">
                {audienceTip(audience, chapter.id)}
              </p>
              {audience === "campus" && (
                <p className="mt-3">
                  <Link
                    href="/campus/syllabus"
                    className="text-sm font-medium text-accent-strong underline-offset-4 hover:underline"
                  >
                    查看参考学期安排 →
                  </Link>
                </p>
              )}
            </Card>
          ) : (
            <Card className="rounded-2xl p-6">
              <p className="text-sm leading-7 text-ink-600">
                选择上方的人群，查看本章对普通读者、高校或企业的学习建议。
              </p>
            </Card>
          )}
        </Section>
      </div>

      {/* 关联交互实验（白底） */}
      <Section
        eyebrow="动手练习"
        id="chapter-practice" title="关联交互实验"
        description={
          relatedLabs.length > 0
            ? "已开放体验的可直接进入；筹备中的实验开放前不可进入。"
            : "本章暂未关联交互实验。"
        }
      >
        {relatedLabs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedLabs.map((lab) => {
              const open = lab.status === "已开放体验";
              return open ? (
                <ArrowCard
                  key={lab.id}
                  href={`/${audience ?? "reader"}/experience/${lab.id}`}
                  className="h-full rounded-2xl"
                  meta={
                    <>
                      <span className="font-mono text-xs font-semibold text-ink-300">{lab.id}</span>
                      <StatusBadge status={lab.status} />
                    </>
                  }
                  title={lab.title}
                  desc={lab.scenario}
                />
              ) : (
                <div
                  key={lab.id}
                  aria-disabled="true"
                  className="h-full rounded-2xl border border-ink-100 bg-ink-50 p-5 opacity-90"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-ink-300">{lab.id}</span>
                    <StatusBadge status={lab.status} />
                  </div>
                  <h3 className="mt-3 font-bold text-ink-900">{lab.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">{lab.scenario}</p>
                  <p className="mt-4 text-sm font-medium text-ink-300">筹备中，暂不可进入</p>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* 上一章 / 下一章导航（灰底） */}
      <div className="bg-ink-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={chapterHref(prev.id, audience)}
                className="card-hover group rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
              >
                <p className="text-xs text-ink-300">
                  <span aria-hidden className="mr-1 transition-all group-hover:-translate-x-1">←</span>
                  上一章
                </p>
                <p className="mt-2 font-semibold text-ink-900">
                  <span className="mr-2 font-mono text-sm text-ink-300">{prev.id}</span>
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div aria-hidden className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={chapterHref(next.id, audience)}
                className="card-hover group rounded-2xl border border-ink-100 bg-white p-5 text-right shadow-sm"
              >
                <p className="text-xs text-ink-300">
                  下一章
                  <span aria-hidden className="ml-1 transition-all group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-2 font-semibold text-ink-900">
                  <span className="mr-2 font-mono text-sm text-ink-300">{next.id}</span>
                  {next.title}
                </p>
              </Link>
            ) : (
              <div aria-hidden className="hidden sm:block" />
            )}
          </div>
          <div className="chapter-return-links mt-8 text-center">
            <ButtonLink href="/resources#book" variant="secondary">返回完整目录</ButtonLink>
            {audience && <ButtonLink href={`/${audience}/paths`} variant="secondary">回到{AUDIENCE_INFO[audience].name}学习路径</ButtonLink>}
          </div>
        </div>
      </div>
    </main>
  );
}
