"use client";

import { useState } from "react";
import { COPY_FEEDBACK } from "@/content/copy-feedback";
import { cx, markDirty } from "@/lib/utils";

/** LAB-03 结构化提示词（§9.3，B07）：以任务、资料、输出格式、审核规则拼出结构化提示词，
 *  系统按规则检查缺项并生成可复制的提示词文本。 */

const ROLES = ["内容助手", "资料研究员", "会议纪要员"];
const FORMATS = ["要点列表", "表格", "结构化 JSON", "正式文档"];
const DATA_SCOPES = ["仅使用我提供的资料", "可使用公开常识补充", "关键结论必须标注出处"];
const REVIEW_RULES = ["交付前由我人工核查", "逐条标注来源", "无法回答时明确说明「不知道」"];

export function PromptLab() {
  const [task, setTask] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [format, setFormat] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ missing: string[]; warnings: string[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, item: string) => {
    markDirty(true);
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
    setFeedback(null);
  };

  const check = () => {
    const missing: string[] = [];
    const warnings: string[] = [];
    if (!task.trim()) missing.push("任务描述为空");
    if (!format) missing.push("未选择输出格式");
    if (scopes.length === 0) warnings.push("未限定资料范围：模型可能使用来源不明的信息");
    if (rules.length === 0) warnings.push("未设置审核规则：交付物缺少质量底线");
    setFeedback({ missing, warnings });
    if (missing.length === 0) markDirty(false);
  };

  const prompt = [
    `# 角色\n你是一名${role}。`,
    `# 任务\n${task.trim() || "（待填写任务描述）"}`,
    `# 资料\n${scopes.length ? scopes.map((s) => `- ${s}`).join("\n") : "- （未限定资料范围）"}`,
    `# 输出格式\n${format || "（未选择）"}`,
    `# 核查与审核\n${rules.length ? rules.map((r) => `- ${r}`).join("\n") : "- （未设置审核规则）"}`,
  ].join("\n\n");

  const ready = feedback !== null && feedback.missing.length === 0;
  const inputCls =
    "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-strong";

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <p className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
        ▣ 本实验为表单与规则反馈：系统检查结构缺项，不调用真实 AI 模型。
      </p>

      <div className="mt-6 grid gap-5">
        <label className="block text-sm font-medium text-ink-900">
          任务描述（必填）
          <textarea
            value={task}
            onChange={(e) => {
              markDirty(true);
              setTask(e.target.value);
              setFeedback(null);
            }}
            rows={3}
            placeholder="例如：把这份产品更新记录整理成面向客户的更新公告草稿"
            className={inputCls + " mt-2"}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink-900">
            角色
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls + " mt-2"}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-ink-900">
            输出格式（必选）
            <select
              value={format}
              onChange={(e) => {
                markDirty(true);
                setFormat(e.target.value);
                setFeedback(null);
              }}
              className={inputCls + " mt-2"}
            >
              <option value="">未选择</option>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink-900">资料范围（可多选）</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {DATA_SCOPES.map((s) => (
              <label
                key={s}
                className={cx(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition",
                  scopes.includes(s) ? "border-accent-strong bg-accent-soft" : "border-ink-100 hover:border-ink-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={scopes.includes(s)}
                  onChange={() => toggle(scopes, setScopes, s)}
                  className="h-4 w-4 accent-lime-600"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink-900">审核规则（可多选）</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {REVIEW_RULES.map((r) => (
              <label
                key={r}
                className={cx(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition",
                  rules.includes(r) ? "border-accent-strong bg-accent-soft" : "border-ink-100 hover:border-ink-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={rules.includes(r)}
                  onChange={() => toggle(rules, setRules, r)}
                  className="h-4 w-4 accent-lime-600"
                />
                {r}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={check}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-95"
        >
          检查并生成提示词
        </button>
      </div>

      {feedback && feedback.missing.length > 0 && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
          <p className="text-sm font-semibold text-red-700">缺项（必须补齐）：</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-red-700">
            {feedback.missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback && feedback.warnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4" role="alert">
          <p className="text-sm font-semibold text-amber-800">提醒（建议补齐）：</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-amber-800">
            {feedback.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {ready && (
        <div className="mt-5 rounded-xl border border-accent bg-accent-soft/60 p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink-900">✓ 结构完整 —— 你的结构化提示词</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  setCopyFailed(false);
                  await navigator.clipboard.writeText(prompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                  setCopyFailed(true);
                }
              }}
              className="rounded-md border border-accent-strong px-3 py-1 text-xs font-medium text-accent-strong hover:bg-white"
            >
              {copied ? "已复制 ✓" : "复制提示词"}
            </button>
          </div>
          {copyFailed && <p className="copy-failure" role="status">{COPY_FEEDBACK.visibleFailure}</p>}
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-4 text-sm leading-7 whitespace-pre-wrap text-ink-800">
            {prompt}
          </pre>
          <p className="mt-3 text-xs text-ink-600">
            对应原书 B07 的六类提示词结构练习。请复制提示词与检查记录，在本地保存；本站没有云端学习空间。
          </p>
        </div>
      )}
    </div>
  );
}
