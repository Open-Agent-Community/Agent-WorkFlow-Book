import type { Metadata } from "next";
import { CertLookup } from "@/components/interactive/CertLookup";
import { Card, PageHero, Section, Tag } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "证书分享演示",
  robots: { index: false, follow: true },
  description: "分享预设演示记录，仅用于了解状态，不作为真实证书证明。",
};

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

interface PageProps {
  params: Promise<{ publicToken: string }>;
}

export default async function VerifyTokenPage({ params }: PageProps) {
  const { publicToken } = await params;

  return (
    <main id="main" className="support-page">
      <PageHero
        compact
        eyebrow="查询演示"
        title="证书分享演示"
        description="本页通过分享编号展示预置演示记录，仅供了解查询流程；尚未接入正式证书核验服务。"
      />

      <Section title="核验结果" className="pt-10 sm:pt-14">
        <CertLookup initialToken={decodeURIComponent(publicToken)} />

        {/* 三种核验状态 */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {VERIFY_STATES.map((s) => (
            <Card key={s.title} className="card-hover rounded-2xl">
              <Tag color={s.color}>{s.title}</Tag>
              <p className="mt-3 text-sm leading-6 text-ink-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
