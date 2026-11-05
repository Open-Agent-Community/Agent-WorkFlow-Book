import type { z } from "zod";
import type { ResourceSchema } from "./schema";

export const resources: z.input<typeof ResourceSchema>[] = [
  {
    id: "workflow-canvas",
    title: "工作流画布模板",
    description: "一页纸梳理目标、步骤、责任人、数据来源与异常路径。",
    format: "markdown",
    audiences: ["reader", "campus", "enterprise", "fde"],
    status: "published",
    file: "/resources/workflow-canvas.md",
  },
  {
    id: "prompt-template",
    title: "结构化提示模板",
    description: "与提示结构化练习配套的六段式模板。",
    format: "markdown",
    audiences: ["reader", "campus", "fde"],
    status: "published",
    file: "/resources/prompt-template.md",
  },
  {
    id: "review-checklist",
    title: "人工复核清单",
    description: "上线前逐项检查人工复核点是否设计完整。",
    format: "markdown",
    audiences: ["enterprise", "fde"],
    status: "preview",
    file: "/resources/review-checklist.md",
  },
  {
    id: "teaching-slides",
    title: "教学课件（筹备中）",
    description: "配合教学大纲的课件包，仍在筹备，暂无下载。",
    format: "markdown",
    audiences: ["campus"],
    status: "planned",
  },
];
