import type { z } from "zod";
import type { DiagnosisDimensionSchema } from "./schema";

/** Self-assessment checklist for enterprise teams. Static content, no data is collected. */
export const diagnosis: z.input<typeof DiagnosisDimensionSchema>[] = [
  {
    id: "goal",
    title: "目标是否清晰",
    questions: ["能否用一句话说明这个流程要改善什么？", "是否有可以对比的现状数据？"],
    chapters: ["ch03", "ch04"],
  },
  {
    id: "ownership",
    title: "责任是否明确",
    questions: ["每一步是否都有明确的责任人？", "出错时由谁决定是否回退？"],
    chapters: ["ch05"],
  },
  {
    id: "data",
    title: "数据是否可用",
    questions: ["每一步需要的数据从哪里来？", "数据的使用是否经过授权？"],
    chapters: ["ch06"],
  },
  {
    id: "exceptions",
    title: "异常是否有出口",
    questions: ["模型不确定时流程会怎样？", "是否有人工接管的入口？"],
    chapters: ["ch07"],
  },
];
