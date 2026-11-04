"use client";

import { useState } from "react";
import { cx, markDirty } from "@/lib/utils";

/** LAB-01 流程拆解（§9.2/§9.3，B01—B03）：为内容选题流程的每个环节指定执行者，
 *  补齐数据来源与异常路径，系统按确定性规则检查，通过后生成流程卡。 */

const STEPS = [
  { key: "trigger", name: "触发与输入", hint: "选题会结束，收到素材与要求" },
  { key: "judge", name: "判断", hint: "判断素材是否充分、选题是否成立" },
  { key: "produce", name: "生产", hint: "生成内容大纲与初稿" },
  { key: "review", name: "核查", hint: "核对事实、来源与语气" },
  { key: "publish", name: "输出与发布", hint: "整理为可交付的终稿" },
];

const ACTORS = ["人工", "AI", "人机协作"];
const SOURCES = ["选题素材库（模拟）", "用户手动输入", "会议纪要（模拟样例）"];
const EXCEPTIONS = ["转人工处理", "自动重试一次后转人工", "终止并提示原因"];

export function FlowBuilderLab() {
  const [actors, setActors] = useState<Record<string, string>>({});
  const [source, setSource] = useState("");
  const [exception, setException] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [passed, setPassed] = useState(false);

  const runCheck = () => {
    const found: string[] = [];
    for (const s of STEPS) {
      if (!actors[s.key]) found.push(`「${s.name}」尚未指定负责人（执行者）`);
    }
    if (actors.review === "AI") {
      found.push("「核查」环节完全交给 AI：交付前需要保留人工核查（B03 人工与 AI 分工）");
    }
    if (!source) found.push("缺少输入的数据来源");
    if (!exception) found.push("缺少异常路径：流程失败时怎么办？");
    setIssues(found);
    setPassed(found.length === 0);
    if (found.length === 0) markDirty(false);
  };

  const inputCls =
    "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-strong";

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <p className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
        ▣ 本实验为确定性模拟：系统按预设规则检查你的流程结构，不调用真实 AI 模型。
      </p>

      <div className="mt-6 space-y-3">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className="flex flex-col gap-3 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <p className="font-semibold text-ink-900">
                {i + 1}. {s.name}
              </p>
              <p className="mt-0.5 text-xs text-ink-600">{s.hint}</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              执行者
              <select
                aria-label={`${s.name}的执行者`}
                value={actors[s.key] ?? ""}
                onChange={(e) => {
                  markDirty(true);
                  setActors((prev) => ({ ...prev, [s.key]: e.target.value }));
                  setPassed(false);
                }}
                className={inputCls + " sm:w-36"}
              >
                <option value="">未指定</option>
                {ACTORS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink-900">
          输入数据来源
          <select
            value={source}
            onChange={(e) => {
              markDirty(true);
              setSource(e.target.value);
              setPassed(false);
            }}
            className={inputCls + " mt-2"}
          >
            <option value="">未设置</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink-900">
          异常路径（失败时）
          <select
            value={exception}
            onChange={(e) => {
              markDirty(true);
              setException(e.target.value);
              setPassed(false);
            }}
            className={inputCls + " mt-2"}
          >
            <option value="">未设置</option>
            {EXCEPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={runCheck}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-95"
        >
          运行结构检查
        </button>
      </div>

      {issues.length > 0 && !passed && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4" role="alert">
          <p className="text-sm font-semibold text-amber-800">发现 {issues.length} 个问题：</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
            {issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {passed && (
        <div className="mt-5 rounded-xl border border-accent bg-accent-soft/60 p-5" role="status">
          <p className="font-semibold text-ink-900">✓ 结构检查通过 —— 流程卡（模拟证据）</p>
          <ol className="mt-3 space-y-1 text-sm text-ink-800">
            {STEPS.map((s, i) => (
              <li key={s.key}>
                {i + 1}. {s.name}（{actors[s.key]}）
              </li>
            ))}
          </ol>
          <p className="mt-2 text-sm text-ink-800">数据来源：{source}；异常路径：{exception}。</p>
          <p className="mt-3 text-xs text-ink-600">
            这是 LAB-01 的模拟完成证据示例。请复制或下载流程卡，自行保留版本与检查记录；本站没有云端学习空间。
          </p>
        </div>
      )}
    </div>
  );
}
