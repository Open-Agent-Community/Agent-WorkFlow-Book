import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { CertLookup } from "@/components/interactive/CertLookup";
import { Card, PageHero, Section, Tag } from "@/components/ui/primitives";

export const metadata: Metadata = pageSeo("/verify", {
  title: "证书查询演示",
  description: "查看证书查询流程演示，通过预置示例了解有效、已撤销与未找到三种状态。",
});

/** 三种核验状态说明 */
const VERIFY_STATES = [
  {
    title: "有效",
    color: "lime" as const,
    desc: "演示编号匹配预设的有效样例，仅用于理解界面状态，不作为学习或资格证明。",
  },
  {
    title: "已撤销",
    color: "amber" as const,
    desc: "预设样例显示撤销状态，用于演示提示方式；本站没有真实撤销或重签操作。",
  },
  {
    title: "未找到",
    color: "gray" as const,
    desc: "编号不在预设演示数据中；不代表任何真实证书的有效性。",
  },
];

export default function VerifyPage() {
  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="功能演示"
        title="证书查询演示"
        description="当前展示证书查询流程，使用预置的脱敏演示记录；尚未接入正式签发与核验服务。"
      />

      <Section title="体验预设查询状态" className="pt-10 sm:pt-14">
        <CertLookup />

        {/* 三种核验状态 */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {VERIFY_STATES.map((s) => (
            <Card key={s.title} className="card-hover rounded-2xl">
              <Tag color={s.color}>{s.title}</Tag>
              <p className="mt-3 text-sm leading-6 text-ink-600">{s.desc}</p>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-sm leading-6 text-ink-600">
          本页没有正式证书签发、撤销、重签或身份核验服务。演示结果不能用于证明学习完成或资质；不要提交真实身份信息。对页面使用有疑问，可通过底部联系方式反馈。
        </p>
      </Section>
    </main>
  );
}
