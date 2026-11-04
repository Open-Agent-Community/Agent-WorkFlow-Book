import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "页面不存在",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold tracking-wide text-accent-strong">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">页面不存在或尚未开放</h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-600">
        你要找的页面可能已被移动、更名，或属于尚未发布的内容。平台内容按发布状态逐步开放，请返回首页选择适合你的学习入口。
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          返回首页
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          查看书籍介绍
        </ButtonLink>
      </div>
    </div>
  );
}
