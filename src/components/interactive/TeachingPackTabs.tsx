"use client";

import { useState } from "react";
import { COURSE_MODES } from "@/content/syllabus";
import { cx } from "@/lib/utils";

/** 高校教学包预览（§4.5）：三类课程切换，实时替换同一周样课的目标、实验提交物与技术深度。
 *  固定呈现本周 2 学时讲授＋1 学时实验、作业与评分量规。预览不产生真实班级成绩。 */

const WEEK_SAMPLE: Record<
  string,
  { goal: string; labDeliverable: string }
> = {
  general: {
    goal: "识别一个业务流程的目标、参与者、输入、输出与业务价值；能用自然语言清楚说明任务。",
    labDeliverable: "业务任务说明卡（无代码表单填写），附一段口头说明。",
  },
  applied: {
    goal: "在平台上画出流程要素图，并讨论该任务适合哪些平台与场景。",
    labDeliverable: "流程要素图＋场景适配说明（小组协作完成）。",
  },
  cs: {
    goal: "用结构化方式建模流程要素，讨论将其接口化、系统化的可能性。",
    labDeliverable: "流程要素的结构化描述（表格或 JSON）＋建模思路说明。",
  },
};

export function TeachingPackTabs() {
  const [mode, setMode] = useState(COURSE_MODES[0].id);
  const current = COURSE_MODES.find((m) => m.id === mode)!;
  const sample = WEEK_SAMPLE[mode];

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <div role="tablist" aria-label="课程使用方式" className="flex flex-wrap gap-2">
        {COURSE_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cx(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              mode === m.id
                ? "border-accent-strong bg-accent-soft text-accent-strong"
                : "border-ink-100 text-ink-600 hover:border-ink-300"
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-ink-600">一周样课 · 第 1 周「起点测评与业务流程」（对应原书 B01）</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-ink-50 p-5">
            <p className="text-sm font-semibold text-ink-900">本周教学目标（{current.name}）</p>
            <p className="mt-2 text-sm leading-6 text-ink-800">{sample.goal}</p>
            <p className="mt-4 text-sm font-semibold text-ink-900">技术深度</p>
            <p className="mt-2 text-sm leading-6 text-ink-800">{current.depth}</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-5">
            <p className="text-sm font-semibold text-ink-900">实验与提交物</p>
            <p className="mt-2 text-sm leading-6 text-ink-800">{sample.labDeliverable}</p>
            <p className="mt-4 text-sm font-semibold text-ink-900">本周作业</p>
            <p className="mt-2 text-sm leading-6 text-ink-800">
              选择一个自己熟悉的任务，完成任务说明卡：目标、参与者、输入、输出与业务价值。
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-ink-100 p-5">
          <p className="text-sm font-semibold text-ink-900">固定安排</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-800">
            <li>本周 2 学时讲授／讨论 ＋ 1 学时指导实验</li>
            <li>教学评价重点：{current.evaluation}</li>
            <li>
              参考量规（§7.5）：总成绩 = 知识自测 20% ＋ 实验作业 30% ＋ 综合项目 40% ＋ 学习复盘
              10%；教师可在开课前调整并锁定量规
            </li>
          </ul>
        </div>

        <p className="mt-4 text-xs text-ink-600">
          ▣ 本页为教学包预览，不产生真实班级成绩。90分钟公开样课可直接下载；16周安排是参考大纲。题库、完整课程和教学支持需另行确认，不表示已交付。
        </p>
      </div>
    </div>
  );
}
