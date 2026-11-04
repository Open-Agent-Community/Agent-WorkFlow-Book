"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";

/** 首页首屏可视区域：一件作品的三个状态 + 六节点模拟（§4.1），标注模拟演示 */
const STATES = [
  {
    key: "task",
    label: "原始任务",
    title: "把两小时的选题会，变成一页纪要",
    body: "输入：一段会议转写（模拟样例）。目标：结论、行动项、负责人与期限，一目了然。",
  },
  {
    key: "draft",
    label: "流程草图",
    title: "五步流程，先跑起来",
    body: "触发与输入 → 提取要点 → 识别行动项 → 人工核查 → 输出纪要。每一步标明由人还是 AI 完成。",
  },
  {
    key: "result",
    label: "可分享成果",
    title: "经过人工核查的纪要卡片",
    body: "结论 3 条、行动项 4 条（含负责人与期限）、2 处由人工修改。可导出，可复盘。",
  },
];

const NODES = ["看懂任务", "拆成流程", "选择方法", "运行与核查", "人工修改", "提交成果"];

export function DemoFlow() {
  const [state, setState] = useState(0);
  const [node, setNode] = useState(0);

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5 text-left shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">一件作品的三个状态</p>
        <span className="rounded-full border border-blue-300/40 bg-blue-400/10 px-2.5 py-0.5 text-xs font-medium text-blue-200">
          ▣ 模拟演示
        </span>
      </div>

      <div role="tablist" aria-label="作品状态" className="mt-4 flex gap-2">
        {STATES.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={state === i}
            onClick={() => setState(i)}
            className={cx(
              "flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition sm:text-sm",
              state === i
                ? "border-accent bg-accent/10 text-accent"
                : "border-ink-700 text-ink-300 hover:text-white"
            )}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-28 rounded-lg bg-ink-800 p-4">
        <p className="font-semibold text-white">{STATES[state].title}</p>
        <p className="mt-2 text-sm leading-6 text-ink-200">{STATES[state].body}</p>
      </div>

      <p className="mt-5 text-xs font-medium text-ink-300">点击查看完成任务的六个步骤</p>
      <ol className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {NODES.map((n, i) => (
          <li key={n}>
            <button
              onClick={() => setNode(i)}
              aria-pressed={node === i}
              className={cx(
                "w-full rounded-md border px-1 py-2 text-xs transition",
                node === i
                  ? "border-accent bg-accent text-ink-950 font-semibold"
                  : i < node
                    ? "border-accent/50 text-accent"
                    : "border-ink-700 text-ink-300 hover:text-white"
              )}
            >
              {n}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-5 text-ink-300">
        当前步骤「{NODES[node]}」——在完整学习空间中，每一步都有对应的导读、实验与作品记录。
      </p>
    </div>
  );
}
