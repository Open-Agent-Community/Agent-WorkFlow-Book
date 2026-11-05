import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import { pageSeo } from "@/lib/seo";
import {DetailNavigation} from '@/components/DetailNavigation';
import {ExtraReading} from '@/components/PageStructure';
import {DETAIL_COPY} from '@/content/detail-pages';
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUDIENCES, AUDIENCE_INFO, isAudience } from "@/lib/audience";
import { LABS } from "@/content/labs";
import { pathsByAudience } from "@/content/paths";
import {
  ArrowCard,
  Card,
  PageHero,
  Section,
  StatusBadge,
  Tag,
} from "@/components/ui/primitives";

interface PageProps {
  params: Promise<{ audience: string }>;
}

export function generateStaticParams() {
  return AUDIENCES.map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience } = await params;
  if (!isAudience(audience)) return { robots: { index: false, follow: true }, title: "学习路径" };
  const info = AUDIENCE_INFO[audience];
  return pageSeo(`/${audience}/paths`, {
    title: `${info.name} · 学习路径`,
    description: `${info.name}的推荐学习路径：先修要求、原书重点章节与必交成果。`,
  });
}

/** §5.2 路径编号前缀说明 */
const ID_RULES = [
  { prefix: "R-PATH", desc: "普通读者版学习路径，从五分钟首练与个人作品出发。" },
  { prefix: "C-PATH", desc: "高校版学习路径，对应课程与学期教学安排。" },
  { prefix: "E-PATH", desc: "企业版学习路径，由企业管理员按诊断结果分配。" },
];

export default async function AudiencePathsPage({ params }: PageProps) {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();

  const info = AUDIENCE_INFO[audience];
  const paths = pathsByAudience(audience);

  const published=paths.filter(path=>path.status==='已发布');
  const pending=paths.filter(path=>path.status!=='已发布');
  const cards=(items:typeof paths)=><div className="path-catalog">{items.map(path=><article key={path.id} className="path-catalog-item"><div className="path-catalog-meta"><Tag color="gray">{path.id}</Tag><StatusBadge status={path.status}/></div><h3><a href={`/${audience}/paths/${path.id}`}>{path.title}</a></h3><p>{path.summary}</p><dl><div><dt>适合对象</dt><dd>{path.audienceLabel}</dd></div><div><dt>先修要求</dt><dd>{path.prerequisite}</dd></div><div><dt>交付成果</dt><dd>{path.outcome}</dd></div></dl><a className="textlink" href={`/${audience}/paths/${path.id}`}>查看路径说明 →</a></article>)}</div>;
  return <main id="main" className="detail-page path-list"><SeoBreadcrumbs items={[{name:info.name,href:`/${audience}`},{name:'学习路径',href:`/${audience}/paths`}]}/>
    <PageHero compact eyebrow={info.name} title={`${info.name} · 学习路径`} description="先按成果与先修要求选择路径，再查看任务步骤和关联章节。已发布与筹备内容分别列出。"/>
    <DetailNavigation links={[{href:`/${audience}`,label:`返回${info.name}`},{href:`/resources?audience=${audience}#cases`,label:'按案例找方向'},{href:'/resources',label:'公开配套材料'},...LABS.filter(lab=>lab.status==='已开放体验').map(lab=>({href:`/${audience}/experience/${lab.id}`,label:lab.title})),...(audience==='reader'?[{href:'/reader/quickstart',label:'五分钟起点指引'}]:[])]}/>
    <Section title={published.length?DETAIL_COPY.paths.open:'当前路径与开放状态'}>{published.length?cards(published):<p>本版完整路径仍在筹备，可先使用公开配套材料；下方保留路径介绍。</p>}</Section>
    {pending.length>0&&<ExtraReading title={DETAIL_COPY.paths.pending} description={DETAIL_COPY.paths.pendingNote}>{cards(pending)}</ExtraReading>}
    <div className="shell catalog-note"><p>{DETAIL_COPY.paths.idNote}</p></div>
  </main>;
}
