import type { z } from "zod";
import type { SyllabusWeekSchema } from "./schema";

/** Sample campus syllabus outline (placeholder). */
export const syllabus: z.input<typeof SyllabusWeekSchema>[] = [
  {
    week: 1,
    topic: "导论",
    chapters: ["ch01"],
    lab: "quickstart",
    activity: "课堂完成五分钟首练。",
  },
  { week: 2, topic: "任务与角色", chapters: ["ch02"], activity: "分组讨论一个校园场景。" },
  { week: 3, topic: "适用边界", chapters: ["ch03"], activity: "辩论：这个场景该不该用智能体？" },
  {
    week: 4,
    topic: "流程拆解",
    chapters: ["ch04", "ch05"],
    lab: "flow-builder",
    activity: "用流程搭建器完成作业一。",
  },
  { week: 5, topic: "数据与异常", chapters: ["ch06", "ch07"], activity: "为作业一补充异常路径。" },
  {
    week: 6,
    topic: "结构化提示",
    chapters: ["ch08"],
    lab: "prompt-structure",
    activity: "完成提示结构化练习。",
  },
];
