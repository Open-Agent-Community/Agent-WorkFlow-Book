import type { z } from "zod";
import type { PathSchema } from "./schema";

export const paths: z.input<typeof PathSchema>[] = [
  {
    id: "first-workflow",
    audience: "reader",
    title: "第一条工作流",
    summary: "从概念到第一次动手练习，适合刚接触智能体工作流的读者。",
    estimatedHours: 3,
    status: "published",
    steps: [
      { kind: "chapter", ref: "ch01", note: "先建立基本概念。" },
      { kind: "lab", ref: "quickstart", note: "用五分钟走完一次完整流程。" },
      { kind: "chapter", ref: "ch04", note: "学习如何从目标拆出步骤。" },
      { kind: "case", ref: "course-feedback", note: "看一个小规模的完整示例。" },
    ],
  },
  {
    id: "semester-course",
    audience: "campus",
    title: "一学期课程主线",
    summary: "配合教学大纲使用的课程主线，每个阶段都有对应的实验练习。",
    estimatedHours: 32,
    status: "published",
    steps: [
      { kind: "chapter", ref: "ch01", note: "第一周导论。" },
      { kind: "chapter", ref: "ch02", note: "任务与角色划分。" },
      { kind: "lab", ref: "flow-builder", note: "课堂练习：搭建一条带复核的流程。" },
      { kind: "chapter", ref: "ch08", note: "结构化提示（预览章节）。" },
      { kind: "lab", ref: "prompt-structure", note: "课后练习：整理一条提示。" },
    ],
  },
  {
    id: "pilot-readiness",
    audience: "enterprise",
    title: "试点准备",
    summary: "帮助业务与技术负责人判断一个场景是否适合试点，以及试点前需要准备什么。",
    estimatedHours: 6,
    status: "published",
    steps: [
      { kind: "chapter", ref: "ch03", note: "先排除不适合的场景。" },
      { kind: "chapter", ref: "ch05", note: "明确责任人与人工复核点。" },
      { kind: "case", ref: "invoice-triage", note: "参考一个后台流程案例。" },
      { kind: "lab", ref: "flow-builder", note: "把候选场景画成流程并自查。" },
    ],
  },
  {
    id: "delivery-loop",
    audience: "fde",
    title: "交付闭环",
    summary: "面向一线交付工程师：需求、方案、最小闭环、验证与交接。",
    estimatedHours: 10,
    status: "preview",
    steps: [
      { kind: "chapter", ref: "ch04", note: "从需求访谈到流程草图。" },
      { kind: "chapter", ref: "ch07", note: "先设计异常路径。" },
      { kind: "lab", ref: "flow-builder", note: "用规则自查流程完整性。" },
      { kind: "case", ref: "support-handoff", note: "参考一个交接案例。" },
      { kind: "chapter", ref: "ch10", note: "设计验证方法（预览章节）。" },
    ],
  },
  {
    id: "production-operations",
    audience: "fde",
    title: "生产运维（筹备中）",
    summary: "上线后的监控、回滚与持续改进。内容仍在筹备，暂不开放。",
    estimatedHours: 8,
    status: "planned",
    steps: [
      { kind: "chapter", ref: "ch11", note: "试点与上线。" },
      { kind: "chapter", ref: "ch12", note: "运行监控与改进。" },
    ],
  },
];
