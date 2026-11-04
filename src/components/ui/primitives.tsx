import Link from "@/components/layout/SiteLink";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/** 按钮样式（用于 Link 与 button） */
export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-95 active:brightness-90",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 transition hover:border-ink-300 hover:bg-ink-50",
  darkSecondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-semibold text-ink-100 transition hover:border-ink-300 hover:text-white",
  ghost:
    "inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:underline underline-offset-4",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof btn;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} data-variant={variant} className={cx(btn[variant], className)}>
      {children}
    </Link>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  dark,
  center,
  className,
  children,
  headingLevel = 2,
}: {
  id?: string;
  headingLevel?: 2 | 3;
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  center?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <section id={id} className={cx("ui-section mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20", className)}>
      <div className={cx("section-intro", center && "mx-auto max-w-2xl text-center")}>
        {eyebrow && (
          <p className={cx("flex items-center gap-2 text-sm font-semibold tracking-widest", dark ? "text-accent" : "text-accent-strong", center && "justify-center")}>
            <span className={cx("inline-block h-px w-6", dark ? "bg-accent" : "bg-accent-strong")} aria-hidden />
            {eyebrow}
            {center && <span className={cx("inline-block h-px w-6", dark ? "bg-accent" : "bg-accent-strong")} aria-hidden />}
          </p>
        )}
        <Heading className={cx("section-heading mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl", dark ? "text-white" : "text-ink-900")}>
          {title}
        </Heading>
        {description && (
          <p className={cx("mt-4 leading-7", dark ? "text-ink-200" : "text-ink-600", !center && "max-w-3xl")}>{description}</p>
        )}
      </div>
      {children && <div className="section-body mt-10">{children}</div>}
    </section>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("ui-card rounded-xl border border-ink-100 bg-white p-5 shadow-sm", className)}>{children}</div>
  );
}

export function Tag({
  color = "gray",
  children,
}: {
  color?: "gray" | "lime" | "amber" | "blue" | "teal" | "purple" | "orange";
  children: ReactNode;
}) {
  const styles: Record<string, string> = {
    gray: "bg-ink-50 text-ink-600 border-ink-100",
    lime: "bg-accent-soft text-accent-strong border-accent",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    teal: "bg-part-foundation-soft text-part-foundation border-part-foundation/30",
    purple: "bg-part-tech-soft text-part-tech border-part-tech/30",
    orange: "bg-part-practice-soft text-part-practice border-part-practice/30",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[color]
      )}
    >
      {children}
    </span>
  );
}

/** 开放状态徽标：不只靠颜色区分（§13.1） */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: "lime" | "amber" | "gray" | "blue"; icon: string }> = {
    已发布: { color: "lime", icon: "●" },
    已开放体验: { color: "lime", icon: "●" },
    预告: { color: "amber", icon: "◐" },
    筹备中: { color: "amber", icon: "◐" },
    模拟演示: { color: "blue", icon: "▣" },
    确定性模拟: { color: "blue", icon: "▣" },
  };
  const s = map[status] ?? { color: "gray" as const, icon: "○" };
  return (
    <Tag color={s.color}>
      <span aria-hidden>{s.icon}</span>
      {status}
    </Tag>
  );
}

/** 深色横幅区块 */
export function DarkBand({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("bg-ink-950", className)}>{children}</div>;
}

/** 统一深色首屏：网格纹理 + 光晕 + 标题层级 */
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  children,
  compact,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div data-compact={compact ? "true" : "false"} className="native-hero relative overflow-hidden bg-ink-950 text-white">
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="glow-accent absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full" aria-hidden />
      <div className="glow-blue absolute bottom-[-40%] left-[-10%] h-[24rem] w-[24rem] rounded-full" aria-hidden />
      <div
        className={cx(
          "relative mx-auto w-full max-w-6xl px-4 sm:px-6",
          compact ? "py-14 sm:py-18" : "py-20 sm:py-28"
        )}
      >
        {eyebrow && (
          <p className="hero-eyebrow flex items-center gap-2 text-sm font-semibold tracking-widest text-accent">
            <span className="inline-block h-px w-8 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="hero-description mt-5 max-w-2xl text-base leading-8 text-ink-200">{description}</p>}
        {actions && <div className="hero-actions mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        {children}
      </div>
    </div>
  );
}

/** 结构性数字带（仅展示内容体系中的真实数量） */
export function StatRow({
  items,
  dark,
  className,
}: {
  items: { value: string; label: string }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <dl className={cx("grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4", dark ? "border-ink-700 bg-ink-700" : "border-ink-100 bg-ink-100", className)}>
      {items.map((s) => (
        <div key={s.label} className={cx("px-6 py-5 text-center", dark ? "bg-ink-900" : "bg-white")}>
          <dd className={cx("text-2xl font-bold tracking-tight sm:text-3xl", dark ? "text-accent" : "text-ink-900")}>{s.value}</dd>
          <dt className={cx("mt-1 text-xs sm:text-sm", dark ? "text-ink-300" : "text-ink-600")}>{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** 步骤流：编号圆圈 + 连接线（如六步闭环） */
export function StepFlow({
  steps,
  dark,
  className,
}: {
  steps: { title: string; desc?: string }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <ol className={cx("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                dark ? "border-accent bg-ink-900 text-accent" : "border-accent-strong bg-white text-accent-strong"
              )}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && <span className={cx("mt-1 w-px flex-1", dark ? "bg-ink-700" : "bg-ink-100")} aria-hidden />}
          </div>
          <div className="pb-2">
            <p className={cx("font-semibold", dark ? "text-white" : "text-ink-900")}>{s.title}</p>
            {s.desc && <p className={cx("mt-1 text-sm leading-6", dark ? "text-ink-300" : "text-ink-600")}>{s.desc}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 竖向时间线（路径任务地图、流程说明） */
export function Timeline({ items, className }: { items: { title: string; desc?: string }[]; className?: string }) {
  return (
    <ol className={cx("relative space-y-6 border-l-2 border-ink-100 pl-6", className)}>
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent-strong bg-white" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-strong" />
          </span>
          <p className="font-semibold text-ink-900">
            <span className="mr-2 text-sm font-bold text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
            {item.title}
          </p>
          {item.desc && <p className="mt-1 text-sm leading-6 text-ink-600">{item.desc}</p>}
        </li>
      ))}
    </ol>
  );
}

/** 带箭头的可点击卡片链接 */
export function ArrowCard({
  href,
  title,
  desc,
  meta,
  className,
}: {
  href: string;
  title: ReactNode;
  desc?: string;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cx("ui-arrow-card card-hover group block rounded-xl border border-ink-100 bg-white p-5 shadow-sm", className)}>
      {meta && <div className="mb-3 flex flex-wrap items-center gap-2">{meta}</div>}
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-ink-900">{title}</p>
        <span aria-hidden className="mt-0.5 shrink-0 text-ink-300 transition-all group-hover:translate-x-1 group-hover:text-accent-strong">
          →
        </span>
      </div>
      {desc && <p className="mt-2 text-sm leading-6 text-ink-600">{desc}</p>}
    </Link>
  );
}
