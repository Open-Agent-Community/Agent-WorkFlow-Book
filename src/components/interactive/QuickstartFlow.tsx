"use client";

import { useState } from "react";
import { COPY_FEEDBACK } from "@/content/copy-feedback";
import { cx, markDirty } from "@/lib/utils";

/** 普通读者五分钟首练（§4.5）：选任务 → 选两个处理步骤 → 必选核查方式 → 生成流程卡（可复制） */

interface TaskOption {
  id: string;
  name: string;
  input: string;
  steps: string[];
  checks: string[];
  deliverable: string;
}

const TASKS: TaskOption[] = [
  {
    id: "meeting",
    name: "会议纪要",
    input: "一份会议转写文本（模拟样例）",
    steps: ["提取讨论要点", "识别行动项与负责人", "整理期限与依赖", "润色为正式纪要"],
    checks: ["对照转写原文逐条核对", "发给参会人确认行动项", "按自查清单检查（结论／负责人／期限）"],
    deliverable: "结构化会议纪要（结论＋行动项表）",
  },
  {
    id: "content",
    name: "内容规划",
    input: "主题、目标读者与发布渠道（模拟设定）",
    steps: ["生成候选选题", "搭建内容大纲", "起草关键段落", "补充事实与出处"],
    checks: ["逐条核对事实与来源", "按品牌与语气清单自查", "请一位目标读者试读反馈"],
    deliverable: "一份带出处的内容大纲与初稿",
  },
  {
    id: "qa",
    name: "资料问答",
    input: "一组参考资料（模拟，已脱敏）",
    steps: ["建立资料清单与范围", "提问并记录引用", "整理答案与出处", "标注无法回答的问题"],
    checks: ["逐条核对引用出处", "确认无答案问题已明确标注", "请熟悉资料的人复核"],
    deliverable: "带引用的问答记录（含失败用例）",
  },
];

export function QuickstartFlow() {
  const [taskId, setTaskId] = useState(TASKS[0].id);
  const [picked, setPicked] = useState<string[]>([]);
  const [check, setCheck] = useState<string>("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const task = TASKS.find((t) => t.id === taskId)!;
  const missingCheck = check === "";

  const toggleStep = (s: string) => {
    markDirty(true);
    setGenerated(false);
    setPicked((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length >= 2 ? [prev[1], s] : [...prev, s]
    );
  };

  const cardText = [
    `【流程卡 · 模拟演示】任务：${task.name}`,
    `任务输入：${task.input}`,
    `处理步骤：${picked.join(" → ") || "（未选择）"}`,
    `交付前人工核查：${check || "（缺项）"}`,
    `核查人：自己（可请同伴复核）`,
    `交付物：${task.deliverable}`,
    `对应原书：B01 业务流程要素 · B02 工作流编排 · B03 人工与 AI 分工`,
  ].join("\n");

  const canGenerate = picked.length === 2 && !missingCheck;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <p className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
        ▣ 匿名体验使用模拟情境，不上传任何真实资料。生成内容仅为演示；本页状态可能在刷新后丢失，请复制结果；需要本地保存与下载可使用普通读者核心练习。
      </p>

      {/* 第一步：选任务 */}
      <fieldset className="mt-6">
        <legend className="text-base font-semibold text-ink-900">第一步：选一个你熟悉的任务</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={taskId === t.id}
              onClick={() => {
                markDirty(true);
                setTaskId(t.id);
                setPicked([]);
                setCheck("");
                setGenerated(false);
              }}
              className={cx(
                "rounded-xl border p-4 text-left transition",
                taskId === t.id ? "border-accent-strong bg-accent-soft" : "border-ink-100 hover:border-ink-300"
              )}
            >
              <p className="font-semibold text-ink-900">{t.name}</p>
              <p className="mt-1 text-xs leading-5 text-ink-600">输入：{t.input}</p>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 第二步：选两个处理步骤 */}
      <fieldset className="mt-8">
        <legend className="text-base font-semibold text-ink-900">
          第二步：选出两个处理步骤 <span className="text-sm font-normal text-ink-600">（已选 {picked.length}/2）</span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {task.steps.map((s) => (
            <label
              key={s}
              className={cx(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                picked.includes(s) ? "border-accent-strong bg-accent-soft" : "border-ink-100 hover:border-ink-300"
              )}
            >
              <input
                type="checkbox"
                checked={picked.includes(s)}
                onChange={() => toggleStep(s)}
                className="h-4 w-4 accent-lime-600"
              />
              <span className="text-sm text-ink-800">{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 第三步：核查方式（必选） */}
      <fieldset className="mt-8">
        <legend className="text-base font-semibold text-ink-900">
          第三步：选择交付前的人工核查方式 <span className="text-sm font-normal text-red-600">（必选）</span>
        </legend>
        <div className="mt-3 space-y-2">
          {task.checks.map((c) => (
            <label
              key={c}
              className={cx(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                check === c ? "border-accent-strong bg-accent-soft" : "border-ink-100 hover:border-ink-300"
              )}
            >
              <input
                type="radio"
                name="quickstart-check"
                checked={check === c}
                onChange={() => {
                  markDirty(true);
                  setCheck(c);
                  setGenerated(false);
                }}
                className="h-4 w-4 accent-lime-600"
              />
              <span className="text-sm text-ink-800">{c}</span>
            </label>
          ))}
        </div>
        {missingCheck && generated === false && (
          <p className="mt-2 text-sm text-ink-600">未选择核查方式时无法生成流程卡（§4.5：交付前必须有人工核查）。</p>
        )}
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canGenerate}
          onClick={() => {
            setGenerated(true);
            markDirty(false);
          }}
          className={cx(
            "rounded-lg px-5 py-2.5 text-sm font-semibold transition",
            canGenerate
              ? "bg-accent text-ink-950 hover:brightness-95"
              : "cursor-not-allowed bg-ink-100 text-ink-300"
          )}
        >
          生成我的流程卡
        </button>
        {!canGenerate && (
          <p className="text-sm text-red-600" role="status">
            缺项：{picked.length < 2 ? "还需要选择两个处理步骤；" : ""}
            {missingCheck ? "尚未选择人工核查方式" : ""}
          </p>
        )}
      </div>

      {generated && canGenerate && (
        <div className="mt-6 rounded-xl border border-accent bg-accent-soft/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-ink-900">你的第一张流程卡</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  setCopyFailed(false);
                  await navigator.clipboard.writeText(cardText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                  setCopyFailed(true);
                }
              }}
              className="rounded-md border border-accent-strong px-3 py-1 text-xs font-medium text-accent-strong hover:bg-white"
            >
              {copied ? "已复制 ✓" : "复制流程卡"}
            </button>
          </div>
          {copyFailed && <p className="copy-failure" role="status">{COPY_FEEDBACK.visibleFailure}</p>}
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-4 text-sm leading-7 whitespace-pre-wrap text-ink-800">
            {cardText}
          </pre>
          <p className="mt-3 text-xs text-ink-600">
            下一步：到 <a className="text-accent-strong underline underline-offset-2" href="/book/chapters/B01">B01 章节导读</a> 看懂流程要素，或体验{" "}
            <a className="text-accent-strong underline underline-offset-2" href="/reader/experience/LAB-01">LAB-01 流程拆解实验</a>。
          </p>
        </div>
      )}
    </div>
  );
}
