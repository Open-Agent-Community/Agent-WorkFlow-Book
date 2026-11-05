import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { PageHero, Section, StepFlow } from "@/components/ui/primitives";
import { CopyEmailButton } from "@/components/interactive/CopyEmailButton";

export const metadata: Metadata = pageSeo("/campus/apply", {
  title: "高校教学试点申请｜智能体工作流设计",
  description:
    "申请高校教学试点：发送邮件至 jiangye@moyingsmart.com，说明学校、专业与开课意向，沟通教学安排、公开样课使用与材料交付范围。",
});

const EMAIL = "jiangye@moyingsmart.com";

/** 邮件模板：点击按钮唤起邮件客户端并预填 */
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("高校教学试点申请")}&body=${encodeURIComponent(
  `学校：\n专业/院系：\n角色（院校负责人/授课教师/助教/其他）：\n教学目标：\n预计人数：\n计划开课时间：\n联系方式：\n`
)}`;

/** 申请后的处理流程 */
const APPLY_STEPS = [
  { title: "发送申请邮件", desc: "按模板填写学校、专业与开课意向，发送至上方邮箱。" },
  { title: "人工联系", desc: "我们将在收到邮件后与你确认开课条件、课时安排与师资支持需求。" },
  { title: "确认教学范围", desc: "确认目标、课时、公开样课与需另行准备的材料；服务范围与时间以双方约定为准。" },
  { title: "材料交付与试讲", desc: "教师下载公开样课，使用学校已有教学工具收作业与评分；如需支持，另行约定试讲与反馈。" },
];

const INCLUDE_ITEMS = [
  "学校与专业/院系",
  "你的角色（院校负责人／授课教师／助教）",
  "教学目标与开课形式（通识选修／实践课程／项目课）",
  "预计人数与计划开课时间",
  "你的联系方式",
];

export default function CampusApplyPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="高校版 · 试点申请"
        title="高校教学试点申请"
        description="无需填写表单，直接发送邮件即可申请。先使用公开的90分钟样课，再通过人工沟通确认课时、材料、试讲与反馈安排。本站不提供班级管理或学生名单导入。学分、课程名称和最终成绩由学校自行确定。"
      />

      <Section eyebrow="联系方式" title="发送邮件申请" className="max-w-4xl">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-ink-600">申请邮箱</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="font-mono text-xl font-bold break-all text-accent-strong sm:text-2xl"
            >
              {EMAIL}
            </a>
            <CopyEmailButton email={EMAIL} />
          </div>

          <div className="mt-6">
            <a
              href={MAILTO}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-95"
            >
              一键唤起邮件客户端 ✉
            </a>
            <p className="mt-2 text-xs text-ink-300">
              已为你预填主题与内容模板；如未唤起邮件客户端，请复制邮箱地址手动发送。
            </p>
          </div>

          <div className="mt-6 border-t border-ink-100 pt-5">
            <p className="text-sm font-semibold text-ink-900">建议在邮件中包含</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink-600">
              {INCLUDE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 申请后会发生什么 */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">申请后会发生什么</h2>
          <StepFlow steps={APPLY_STEPS} className="mt-8" />
        </section>
      </Section>
    </main>
  );
}
