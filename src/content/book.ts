import type { z } from "zod";
import type { PartSchema } from "./schema";

/** Book parts. Placeholder titles until the manuscript is final. */
export const parts: z.input<typeof PartSchema>[] = [
  {
    id: "part-1",
    number: 1,
    title: "认识工作流",
    summary: "建立共同语言：什么是智能体工作流，它适合解决什么问题，又不适合解决什么问题。",
  },
  {
    id: "part-2",
    number: 2,
    title: "拆解与编排",
    summary: "把业务目标拆成可执行、可追责的步骤，并为每一步明确数据、责任人和异常处理。",
  },
  {
    id: "part-3",
    number: 3,
    title: "提示、工具与评估",
    summary: "让每一步的输入输出结构化，控制工具权限，并用可重复的方法验证效果。",
  },
  {
    id: "part-4",
    number: 4,
    title: "上线与交付",
    summary: "从试点到稳定运行：监控、改进以及团队之间的交接。",
  },
];
