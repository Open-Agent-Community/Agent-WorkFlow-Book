"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";

/** FAQ 折叠（键盘可操作） */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-ink-900">{item.q}</span>
            <span aria-hidden className={cx("text-ink-300 transition-transform", open === i && "rotate-45")}>
              ＋
            </span>
          </button>
          {open === i && <p className="px-5 pb-5 leading-7 text-ink-600">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
