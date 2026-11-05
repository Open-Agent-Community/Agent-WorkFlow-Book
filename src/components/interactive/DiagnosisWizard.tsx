"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PROBLEM_OPTIONS } from "@/content/solutions";
import { cx, markDirty } from "@/lib/utils";

/** 企业公开轻量诊断（§4.5）：五项选择 → 跳转结果页（查询参数携带，便于返回修改） */

const QUESTIONS: { key: string; title: string; options: { value: string; label: string }[] }[] = [
  { key: "problem", title: "① 当前最急的问题", options: PROBLEM_OPTIONS },
  {
    key: "dept",
    title: "② 计划先试点的部门",
    options: [
      { value: "市场", label: "市场部" },
      { value: "销售", label: "销售部" },
      { value: "客服", label: "客服部" },
      { value: "人力", label: "人力资源部" },
      { value: "生产运营", label: "生产运营" },
      { value: "综合办公", label: "综合办公" },
      { value: "待定", label: "暂未确定" },
    ],
  },
  {
    key: "tools",
    title: "③ 已有工具情况",
    options: [
      { value: "已采购 AI 工具", label: "已采购 AI 工具" },
      { value: "员工自发使用", label: "员工自发使用个人工具" },
      { value: "尚未引入", label: "尚未引入" },
      { value: "不确定", label: "不确定" },
    ],
  },
  {
    key: "data",
    title: "④ 可用于试点的资料范围",
    options: [
      { value: "仅公开资料", label: "仅公开资料" },
      { value: "脱敏后的内部资料", label: "脱敏后的内部资料" },
      { value: "授权业务资料", label: "授权范围内的业务资料" },
      { value: "暂未确定", label: "暂未确定" },
    ],
  },
  {
    key: "reviewer",
    title: "⑤ 审核责任",
    options: [
      { value: "已有明确审核人", label: "已有明确审核人" },
      { value: "部门负责人兼任", label: "部门负责人兼任" },
      { value: "尚未确定", label: "尚未确定" },
    ],
  },
];

export function DiagnosisWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const q of QUESTIONS) {
      const v = params.get(q.key);
      if (v) init[q.key] = v;
    }
    return init;
  });

  const missing = QUESTIONS.filter((q) => !answers[q.key]);

  const submit = () => {
    const sp = new URLSearchParams(answers);
    markDirty(false);
    router.push(`/enterprise/diagnosis/result?${sp.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <p className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
        ▣ 公开诊断由预设规则生成示例结果，不存储企业真实材料，也不会自动创建正式方案。
      </p>
      {QUESTIONS.map((q) => (
        <fieldset key={q.key} className="mt-7">
          <legend className="text-base font-semibold text-ink-900">{q.title}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((o) => (
              <label
                key={o.value}
                className={cx(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                  answers[q.key] === o.value
                    ? "border-accent-strong bg-accent-soft"
                    : "border-ink-100 hover:border-ink-300"
                )}
              >
                <input
                  type="radio"
                  name={`diag-${q.key}`}
                  checked={answers[q.key] === o.value}
                  onChange={() => {
                    markDirty(true);
                    setAnswers((prev) => ({ ...prev, [q.key]: o.value }));
                  }}
                  className="h-4 w-4 accent-lime-600"
                />
                <span className="text-sm text-ink-800">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={missing.length > 0}
          onClick={submit}
          className={cx(
            "rounded-lg px-5 py-2.5 text-sm font-semibold transition",
            missing.length === 0
              ? "bg-accent text-ink-950 hover:brightness-95"
              : "cursor-not-allowed bg-ink-100 text-ink-300"
          )}
        >
          生成试点建议
        </button>
        {missing.length > 0 && (
          <p className="text-sm text-red-600" role="status">
            还差 {missing.length} 项：{missing.map((m) => m.title.replace(/^[①②③④⑤] /, "")).join("、")}
          </p>
        )}
      </div>
    </div>
  );
}
