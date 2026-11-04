"use client";

import { useState } from "react";
import { COPY_FEEDBACK } from "@/content/copy-feedback";
import { BOOK } from "@/content/book";
import { btn } from "@/components/ui/primitives";
import { cx } from "@/lib/utils";

/** 购书渠道：京东／淘宝为外部链接；微信小店为口令复制（浏览器无法直接跳转微信）。
 *  dark=true 用于深色首屏。 */
export function PurchaseChannels({ dark = false, showNote = false }: { dark?: boolean; showNote?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const { jd, taobao, wechatShop } = BOOK.purchase;

  const copyWechat = async () => {
    try {
      setCopyFailed(false);
                  await navigator.clipboard.writeText(wechatShop.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  return (
    <>
      <a href={jd} target="_blank" rel="noopener noreferrer" data-variant="primary" className={btn.primary}>
        京东购买 ↗
      </a>
      <a href={taobao} target="_blank" rel="noopener noreferrer" data-variant="secondary" className={dark ? btn.darkSecondary : btn.secondary}>
        淘宝购买 ↗
      </a>
      <button
        type="button"
        data-variant="secondary"
        onClick={copyWechat}
        title={wechatShop.note}
        className={cx(dark ? btn.darkSecondary : btn.secondary, "border-dashed")}
      >
        {copied ? "口令已复制 ✓" : "微信小店：复制口令"}
      </button>
      {copyFailed && <p className="copy-failure w-full" role="status">{COPY_FEEDBACK.failure}<code className="copy-fallback-text">{wechatShop.code}</code></p>}
      {showNote && <p className="w-full text-xs text-ink-600">{wechatShop.note}</p>}
    </>
  );
}
