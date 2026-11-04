import { CASE_GUIDES } from "@/content/case-guides";
import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import {DetailNavigation,DetailBrief} from '@/components/DetailNavigation';
import {ExtraReading} from '@/components/PageStructure';
import {DETAIL_COPY} from '@/content/detail-pages';
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
import { AUDIENCES, AUDIENCE_INFO, isAudience, chapterHref } from "@/lib/audience";
import { CASES, getCase } from "@/content/cases";
import { LABS } from "@/content/labs";
import { getChapter } from "@/content/chapters";
import { cx } from "@/lib/utils";
import {
  ArrowCard,
  Card,
  PageHero,
  Section,
  StatusBadge,
  Tag,
} from "@/components/ui/primitives";

const INDUSTRY_COLOR: Record<string, "teal" | "purple" | "orange"> = {
  教育: "teal",
  营销: "purple",
  制造: "orange",
};

/** 各人群的验收方式（§1.3 审核机制） */
const ACCEPTANCE = DETAIL_COPY.acceptance;

interface PageProps {
  params: Promise<{ audience: string; caseId: string }>;
}

export function generateStaticParams() {
  return CASES.flatMap((c) => AUDIENCES.map((audience) => ({ audience, caseId: c.id })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience, caseId } = await params;
  const item = getCase(caseId);
  if (!isAudience(audience) || !item) return { robots: { index: false, follow: true }, title: "案例" };
  return pageSeo(`/${audience}/cases/${caseId}`, {
    title: `${item.theme} · ${AUDIENCE_INFO[audience].name}教学案例`,
    description: `书中来源 ${item.source}；${AUDIENCE_INFO[audience].shortName}改造成果：${item.outcomes[audience]}。平台扩展案例。`,
  });
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { audience, caseId } = await params;
  if (!isAudience(audience)) notFound();

  const item = getCase(caseId);
  if (!item) notFound();

  const guide = CASE_GUIDES[item.id];
  const info = AUDIENCE_INFO[audience];
  const firstChapter = item.chapters[0];
  const relatedLabs = LABS.filter((lab) => lab.chapters.some((cid) => item.chapters.includes(cid)));

  return (
    <main id="main" className="detail-page case-detail"><SeoBreadcrumbs items={[{name:'配套资源',href:'/resources'},{name:`${info.name} · ${item.theme}`,href:`/${audience}/cases/${item.id}`}]}/><PageHero
        compact
        eyebrow={item.id}
        title={item.theme}
        description={`${info.name} · 案例｜书中来源：${item.source}。案例来源保留原小节；改造后的实现为平台扩展内容，不表示原书已有实现。`}
        actions={
          <>
            <Tag color={INDUSTRY_COLOR[item.industry] ?? "gray"}>{item.industry}</Tag>
            <Tag color="gray">平台扩展案例</Tag>
          </>
        }
      /><DetailNavigation links={[{href:`/resources?audience=${audience}#cases`,label:"返回配套资源案例"},{href:`/${audience}`,label:info.name},{href:`/${audience}/paths`,label:"学习路径"}]}/><DetailBrief title={DETAIL_COPY.case.brief} items={[{label:DETAIL_COPY.case.outcome,value:item.outcomes[audience]},{label:DETAIL_COPY.case.acceptance,value:DETAIL_COPY.acceptance[audience]}]} note={DETAIL_COPY.case.note}/><Section title="任务背景、输入与操作框架"><div className="delivery-reading"><p><strong>状态：</strong>{guide.practice?'参考框架；另有完整合成实践材料':'案例参考；尚未提供完整专用素材或可运行实现'}</p><p>{guide.context}</p><h3>建议输入</h3><p>{guide.inputs}</p><h3>预期输出</h3><p>{guide.outputs}</p><h3>步骤框架</h3><ol>{guide.steps.map(s=><li key={s}>{s}</li>)}</ol><h3>核对与责任</h3><p>{guide.boundary}</p><p>{audience==='reader'?'个人练习：记录修改理由，自己核查后保存。':audience==='campus'?'课堂改造：教师先准备量规，再收取步骤记录与个人贡献说明。':'组织试点：业务负责人先确认资料权限、审核人和验收口径。'}</p>{guide.practice?<a className="delivery-primary" href={guide.practice}>进入对应完整合成实践 →</a>:<p>下一步：按此框架自行准备合成素材，或先完成<a href={'/learn/'+audience+'/'}>本版本已开放的核心实践</a>。本页不作为完整项目启动入口。</p>}</div></Section><Section title="学习入口" className="pt-0 sm:pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {firstChapter && (
            <ArrowCard
              href={chapterHref(firstChapter, audience)}
              title={`阅读 ${firstChapter} 导读`}
              desc="从关联章节的第一章导读开始，了解本案例的知识背景。"
              meta={<Tag color="teal">章节导读</Tag>}
            />
          )}
          <Card className="rounded-2xl">
            <div className="mb-3">
              <Tag color="blue">相关实验</Tag>
            </div>
            {relatedLabs.length === 0 ? (
              <p className="text-sm leading-6 text-ink-600">暂无关联实验。</p>
            ) : (
              <ul className="space-y-3">
                {relatedLabs.map((lab) => (
                  <li key={lab.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-ink-800">
                        {lab.id} {lab.title}
                      </p>
                      <p className="mt-0.5 leading-6 text-ink-600">{lab.scenario}</p>
                    </div>
                    <div className="shrink-0">
                      {lab.status === "已开放体验" ? (
                        <Link
                          href={`/${audience}/experience/${lab.id}`}
                          className="text-sm font-medium text-accent-strong hover:underline underline-offset-4"
                        >
                          去体验 →
                        </Link>
                      ) : (
                        <StatusBadge status={lab.status} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </Section><Section title="关联章节" className="pb-0 sm:pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {item.chapters.map((cid) => {
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
      </Section><ExtraReading title={DETAIL_COPY.case.comparison} description={DETAIL_COPY.case.comparisonNote}><Section headingLevel={3}
        title="三个人群的改造成果"
        description="同一书中案例面向不同人群的改造方向；当前浏览人群已高亮。"
      >
        <div className="case-comparison-table overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="bg-ink-950 text-white">
                <th scope="col" className="px-4 py-3 font-medium">改造方向</th>
                {AUDIENCES.map((a) => {
                  const current = a === audience;
                  return (
                    <th scope="col" key={a} className={cx("px-4 py-3 font-medium", current && "bg-ink-800")}>
                      {AUDIENCE_INFO[a].name}
                      {current && (
                        <span className="ml-2">
                          <Tag color="lime">当前人群</Tag>
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 align-top font-medium text-ink-800">改造成果</td>
                {AUDIENCES.map((a) => {
                  const current = a === audience;
                  return (
                    <td
                      key={a}
                      className={cx("px-4 py-4 align-top leading-6", current ? "bg-accent-soft text-ink-900" : "text-ink-600")}
                    >
                      {item.outcomes[a]}
                    </td>
                  );
                })}
              </tr>
              <tr className="border-t border-ink-100">
                <td className="px-4 py-4 align-top font-medium text-ink-800">验收方式</td>
                {AUDIENCES.map((a) => {
                  const current = a === audience;
                  return (
                    <td
                      key={a}
                      className={cx("px-4 py-4 align-top leading-6", current ? "bg-accent-soft text-ink-900" : "text-ink-600")}
                    >
                      {ACCEPTANCE[a]}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="case-comparison-cards">{AUDIENCES.map(a => <article key={a} data-current={a === audience}>
          <div className="case-comparison-heading"><h4>{AUDIENCE_INFO[a].name}</h4>{a === audience && <span>当前版本</span>}</div>
          <dl><div><dt>改造成果</dt><dd>{item.outcomes[a]}</dd></div><div><dt>验收方式</dt><dd>{ACCEPTANCE[a]}</dd></div></dl>
          {a !== audience && <a href={`/${a}/cases/${item.id}`}>查看此版本案例 →</a>}
        </article>)}</div>
      </Section></ExtraReading></main>
  );
}
