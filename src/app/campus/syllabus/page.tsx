import { pageSeo } from "@/lib/seo";
import { chapterHref } from "@/lib/audience";
import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { ButtonLink, Card, PageHero, StatRow } from "@/components/ui/primitives";
import { COURSE_MODES, GRADING, SYLLABUS } from "@/content/syllabus";

export const metadata: Metadata = pageSeo("/campus/syllabus", {
  title: "高校参考教学大纲｜智能体工作流设计",
  description:
    "16 周参考学期安排：每周 3 学时（2 学时讲授／讨论＋1 学时指导实验），共 48 学时；含完整周次表与参考评价方式。",
});

/** 单个 B 编号章节可链接到章节导读；合并写法（如「B07、B08」）与其他文字直接显示 */
function ChapterCell({ chapters }: { chapters: string }) {
  if (/^B\d{2}$/.test(chapters)) {
    return (
      <Link
        href={chapterHref(chapters, "campus")}
        className="font-mono text-xs text-accent-strong hover:underline underline-offset-4"
      >
        {chapters}
      </Link>
    );
  }
  return <span className="font-mono text-xs">{chapters}</span>;
}

/** 占比条：名称 + 横向条形 + 百分比 */
function WeightBar({ item, weight, barClass }: { item: string; weight: string; barClass: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-ink-800">{item}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: weight }} />
      </div>
      <span className="w-11 shrink-0 text-right font-mono text-sm text-ink-900">{weight}</span>
    </div>
  );
}

export default function CampusSyllabusPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="高校版 · 参考教学大纲"
        title="16 周参考学期安排"
        description="参考方案为 16 周，每周 3 学时（2 学时讲授／讨论＋1 学时指导实验），共 48 学时（32＋16）。课外项目投入另计，不混入课内学时。"
      >
        <StatRow
          dark
          className="mt-10"
          items={[
            { value: `${SYLLABUS.length} 周`, label: "参考学期" },
            { value: `${SYLLABUS.length * 3} 学时`, label: "课内总学时" },
            { value: `${SYLLABUS.length * 2} 学时`, label: "讲授／讨论" },
            { value: `${SYLLABUS.length} 学时`, label: "指导实验" },
          ]}
        />
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="max-w-3xl text-sm leading-6 text-ink-600">
          说明：本平台提供参考教学设计，学分、课程名称和最终成绩由学校自行确定。B 编号表示原书章节，不代表已发布课程。
        </p>

        {/* 三种使用方式提示条 */}
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
          ▣ 本大纲适配三种使用方式：{COURSE_MODES.map((m) => m.name).join("、")}
          。三种方式共享基础知识，由教师决定技术深度；学校也可改为短课、集中实训或其他学期长度。
        </p>

        {/* 完整 16 周表格 */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink-950 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">周次</th>
                <th className="px-4 py-3 font-semibold">主题</th>
                <th className="px-4 py-3 font-semibold">章节</th>
                <th className="px-4 py-3 font-semibold">课堂／实验成果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 text-ink-800">
              {SYLLABUS.map((w, i) => (
                <tr key={w.week} className={i % 2 === 1 ? "bg-ink-50/70" : undefined}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    第 <span className="font-mono">{String(w.week).padStart(2, "0")}</span> 周
                  </td>
                  <td className="px-4 py-3">{w.topic}</td>
                  <td className="px-4 py-3">
                    <ChapterCell chapters={w.chapters} />
                  </td>
                  <td className="px-4 py-3">{w.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 参考评价方式（§7.5） */}
        <h2 className="mt-14 text-2xl font-bold tracking-tight text-ink-900">参考评价方式</h2>
        <p className="mt-3 max-w-3xl leading-7 text-ink-600">
          教师可在开课前调整并锁定量规，调整后注明版本与适用范围。系统计算数值，教师确认最终成绩。
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">建议总成绩权重</p>
            <div className="mt-4 space-y-3">
              {GRADING.total.map((g) => (
                <WeightBar key={g.item} item={g.item} weight={g.weight} barClass="bg-accent" />
              ))}
            </div>
          </Card>
          <Card className="rounded-2xl">
            <p className="font-semibold text-ink-900">综合项目建议量规</p>
            <div className="mt-4 space-y-3">
              {GRADING.project.map((g) => (
                <WeightBar key={g.item} item={g.item} weight={g.weight} barClass="bg-part-tech" />
              ))}
            </div>
          </Card>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink-600">
          未提交、未评分、待修改、缺测与零分分别表示；未测不显示为零分或能力下降。课程完成证明不自动等同于学分、学历或外部职业资格。
        </p>

        {/* 申请试点 CTA */}
        <div className="mt-14 rounded-2xl bg-ink-950 px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight">把这份大纲带进你的课堂</h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-ink-200">
            先使用公开90分钟样课，再通过人工沟通确认教学安排、材料与支持范围。
          </p>
          <ButtonLink href="/campus/apply" className="mt-6">
            申请试点
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
