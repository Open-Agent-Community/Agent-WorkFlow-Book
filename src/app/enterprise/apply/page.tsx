import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { PageHero, Section, StepFlow } from "@/components/ui/primitives";
import { CopyEmailButton } from "@/components/interactive/CopyEmailButton";

export const metadata: Metadata = pageSeo("/enterprise/apply", {
  title: "企业试点申请｜智能体工作流设计",
  description:
    "申请企业试点：发送邮件至 jiangye@moyingsmart.com，说明企业、部门、急需任务、人数与资料情况，由人工确认任务范围、材料与试点安排。",
});

const EMAIL = "jiangye@moyingsmart.com";

/** 邮件模板：点击按钮唤起邮件客户端并预填 */
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("企业试点申请")}&body=${encodeURIComponent(
  `企业名称：\n试点部门：\n急需任务（最想用 AI 解决的问题）：\n参与人数：\n资料情况（仅公开资料/脱敏后的内部资料/授权范围内的业务资料/暂未确定）：\n联系方式：\n`
)}`;

/** 申请后的处理流程 */
const NEXT_STEPS = [
  { title: "发送申请邮件", desc: "按模板填写企业与试点意向，发送至上方邮箱。" },
  { title: "人工联系", desc: "我们将在收到邮件后与你确认试点目标与资料情况。" },
  { title: "确认范围与责任", desc: "共同确认任务、资料授权、人工审核人、验收口径与合作范围，不自动开通软件空间。" },
  { title: "材料交付与试做", desc: "使用公开客服练习与试点模板，按约定组织试做和反馈；真实业务接入需单独评估。" },
];

const INCLUDE_ITEMS = [
  "企业名称与试点部门",
  "急需任务（最想用 AI 解决的问题）",
  "参与人数",
  "资料情况（仅公开资料／脱敏内部资料／授权业务资料）",
  "你的联系方式",
];

export default function EnterpriseApplyPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="企业版 · 试点申请"
        title="申请企业试点"
        description="无需填写表单，直接发送邮件即可申请。我们将人工确认任务、资料与服务范围。可先完成公开规则诊断和客服练习；本站没有企业空间或管理员后台。"
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
      </Section>

      <div className="bg-ink-50/60">
        <Section
          eyebrow="后续流程"
          title="申请后会发生什么"
          description="从需求沟通到材料交付与试做安排，具体服务由双方确认。"
        >
          <StepFlow steps={NEXT_STEPS} />
        </Section>
      </div>
    </main>
  );
}
