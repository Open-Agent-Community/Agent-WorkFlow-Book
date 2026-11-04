"use client";

import { useState } from "react";
import { COPY_FEEDBACK } from "@/content/copy-feedback";

/** 复制邮箱地址按钮 */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  return (
    <>
    <button
      type="button"
      onClick={async () => {
        try {
          setCopyFailed(false);
                  await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
          setCopyFailed(true);
        }
      }}
      className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-800 transition hover:bg-ink-50"
    >
      {copied ? "已复制 ✓" : "复制邮箱"}
    </button>
    {copyFailed && <span className="copy-failure" role="status">{COPY_FEEDBACK.failure}<span className="copy-fallback-text">{email}</span></span>}
    </>
  );
}
