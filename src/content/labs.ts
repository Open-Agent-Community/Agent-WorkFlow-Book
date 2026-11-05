import type { z } from "zod";
import type { LabSchema } from "./schema";

export const labs: z.input<typeof LabSchema>[] = [
  {
    id: "flow-builder",
    kind: "flow-builder",
    title: "流程搭建器",
    summary: "为每个步骤指定责任人、数据来源和异常路径，规则会实时检查流程是否完整。",
    audiences: ["reader", "campus", "enterprise", "fde"],
    chapters: ["ch04", "ch05", "ch07"],
    status: "published",
  },
  {
    id: "prompt-structure",
    kind: "prompt-structure",
    title: "提示结构化练习",
    summary: "把一段零散的需求整理成角色、目标、上下文、约束、输出格式和示例六个部分。",
    audiences: ["reader", "campus", "fde"],
    chapters: ["ch08"],
    status: "published",
  },
  {
    id: "quickstart",
    kind: "quickstart",
    title: "五分钟首练",
    summary: "按五个步骤走完一次从任务到复核的完整流程设计。",
    audiences: ["reader", "campus"],
    chapters: ["ch01"],
    status: "published",
  },
];
