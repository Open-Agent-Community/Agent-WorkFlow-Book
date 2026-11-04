import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { TeachingPackTabs } from "@/components/interactive/TeachingPackTabs";
import { ArrowCard, Card, PageHero, StatusBadge, Tag } from "@/components/ui/primitives";
import { getLab } from "@/content/labs";

export const metadata: Metadata = pageSeo("/campus/teaching-pack", {
  title: "教学包预览｜高校版｜智能体工作流设计",
  description:
    "高校教学包预览：切换三类课程使用方式，查看同一周样课的教学目标、实验提交物与技术深度。预览不产生真实班级成绩。",
});

/** 实验样例（任课教师入口） */
const SAMPLE_LAB_IDS = ["LAB-01", "LAB-05"];

/** 可编辑教学资源清单（§4.3），随院校试点开通提供 */
const EDITABLE_RESOURCES = [
  "可编辑教学大纲",
  "课件与讲义",
  "实验指导书",
  "模拟数据",
  "题库",
  "评分量规",
  "项目答辩模板",
];

export default function TeachingPackPage() {
  const sampleLabs = SAMPLE_LAB_IDS.map((id) => getLab(id)).filter((l) => l !== undefined);

  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="高校版 · 教学包预览"
        title="一周教学包，三种开课方式"
        description="以第 1 周「起点测评与业务流程」（对应原书 B01）为样例：切换 AI 通识选修、应用型实践、计算机项目课，查看同一周样课的教学目标、实验提交物与技术深度。每周固定呈现 2 学时讲授／讨论＋1 学时指导实验、作业与评分量规。"
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="mb-6"><a className="delivery-primary" href="/learn/campus/">进入90分钟公开样课与下载 →</a></p><TeachingPackTabs />

        {/* 两个入口 */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <ArrowCard
            href="/campus/syllabus"
            meta={<Tag color="gray">院校负责人入口</Tag>}
            title="参考学期安排"
            desc="查看 16 周参考教学大纲：每周主题、对应章节、课堂／实验成果与参考评价方式，可用于制定本校开课方案。"
          />
          <ArrowCard
            href="#resources"
            meta={<Tag color="gray">任课教师入口</Tag>}
            title="实验样例与可编辑教学资源"
            desc="LAB-01可体验；LAB-05为计划说明。完整的90分钟样课与可编辑材料可公开下载。"
          />
        </div>

        {/* 实验样例与资源清单 */}
        <div id="resources" className="mt-10 grid scroll-mt-24 gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">实验样例</p>
            <ul className="mt-3 space-y-3">
              {sampleLabs.map((lab) => (
                <li key={lab.id} className="card-hover rounded-xl border border-ink-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900">
                      {lab.id} · {lab.title}
                    </p>
                    <StatusBadge status={lab.status} />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-ink-600">{lab.scenario}</p>
                  <Link
                    href={`/campus/experience/${lab.id}`}
                    className="mt-1 inline-flex text-sm font-medium text-accent-strong hover:underline underline-offset-4"
                  >
                    {lab.status === "已开放体验" ? "进入实验 →" : "查看计划 →"}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">可编辑教学资源清单</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {EDITABLE_RESOURCES.map((r) => (
                <Tag key={r} color="gray">
                  {r}
                </Tag>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-ink-50 px-3 py-2 text-xs leading-5 text-ink-600">
              公开样课包含讲解、素材、任务、参考成果与评分表。上列资源是完整课程的规划清单，不代表均已提供；教学管理使用院校已有工具。
            </p>
          </Card>
        </div>

        <p className="mt-8 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          ▣ 本页为教学包预览，不产生真实班级成绩。先使用公开样课；其他材料与教学支持通过人工沟通确认。
        </p>
      </div>
    </main>
  );
}
