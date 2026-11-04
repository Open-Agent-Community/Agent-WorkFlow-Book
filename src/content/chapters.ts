/** 四篇十三章统一骨架（§5.1）。B 编号表示原书章节，不代表已发布课程。 */

export type PartId = "foundation" | "method" | "tech" | "practice";

export interface Part {
  id: PartId;
  name: string;
  shortName: string;
  description: string;
}

export interface Chapter {
  id: string; // B01—B13
  part: PartId;
  title: string; // 原书章名
  goal: string; // 平台学习目标
  deliverable: string; // 建议交互／交付物
}

export const PARTS: Part[] = [
  {
    id: "foundation",
    name: "第一篇 · 基础知识",
    shortName: "基础知识",
    description: "看懂业务任务与流程，理解工作流与智能体工作流的分工。",
  },
  {
    id: "method",
    name: "第二篇 · 方法论",
    shortName: "方法论",
    description: "掌握 Agent 设计模式与 Anthropic、Google 的构建方法论。",
  },
  {
    id: "tech",
    name: "第三篇 · 技术实现",
    shortName: "技术实现",
    description: "了解平台选型、节点式编排、办公自动化与智能体的任务边界。",
  },
  {
    id: "practice",
    name: "第四篇 · 行业实践",
    shortName: "行业实践",
    description: "走进教育、营销、制造三个行业的十一个主案例。",
  },
];

export const PART_STYLE: Record<PartId, { text: string; bg: string; dot: string }> = {
  foundation: { text: "text-part-foundation", bg: "bg-part-foundation-soft", dot: "bg-part-foundation" },
  method: { text: "text-part-method", bg: "bg-part-method-soft", dot: "bg-part-method" },
  tech: { text: "text-part-tech", bg: "bg-part-tech-soft", dot: "bg-part-tech" },
  practice: { text: "text-part-practice", bg: "bg-part-practice-soft", dot: "bg-part-practice" },
};

export const CHAPTERS: Chapter[] = [
  { id: "B01", part: "foundation", title: "业务流程概述", goal: "找出目标、参与者、输入、输出与业务价值", deliverable: "流程要素归类；业务任务说明卡" },
  { id: "B02", part: "foundation", title: "认识工作流", goal: "理解编排、调度、数据流转与状态追踪", deliverable: "排序与连线；第一张工作流图" },
  { id: "B03", part: "foundation", title: "智能体工作流概述", goal: "区分模型、智能体、传统工作流及智能体工作流", deliverable: "任务归类；人工与 AI 分工表" },
  { id: "B04", part: "method", title: "Agent设计模式", goal: "选择和组合反思、工具增强、规划与多智能体协作", deliverable: "模式对比；设计选择与理由" },
  { id: "B05", part: "method", title: "Anthropic的Agent构建方法论", goal: "理解构建原则、五种编排与 MCP", deliverable: "提示链／路由／并行／协调器／生成评估模拟" },
  { id: "B06", part: "method", title: "Google的Agent构建方法论", goal: "理解推理框架、工具使用与评估优化", deliverable: "可观察的工具调用轨迹与策略比较报告" },
  { id: "B07", part: "tech", title: "企业级智能体平台", goal: "理解 Dify、扣子、FastGPT、提示工程与平台选型", deliverable: "六类提示词结构练习；平台选型决策单" },
  { id: "B08", part: "tech", title: "节点式工作流编排", goal: "理解 RPA、ComfyUI、n8n 与 RAGFlow 的适用任务", deliverable: "节点参数、字段映射与异常排查" },
  { id: "B09", part: "tech", title: "办公自动化工作流", goal: "使用结构化数据、触发条件和执行操作", deliverable: "模拟多维表格；触发与数据流转设计" },
  { id: "B10", part: "tech", title: "智能体爆发期：从工作流到自主行动", goal: "理解通用与垂直智能体的任务边界", deliverable: "工作流与自主行动方案比较" },
  { id: "B11", part: "practice", title: "教育行业：AI驱动的个性化学习", goal: "设计教育场景中的输入、反馈与人工复核", deliverable: "作文批改／教学内容／课堂互动案例" },
  { id: "B12", part: "practice", title: "智能化营销", goal: "将素材、客服、推荐与分析连接到营销任务", deliverable: "营销综合项目与效果复盘" },
  { id: "B13", part: "practice", title: "传统制造业转型", goal: "设计企业问答、文档、看板和管理者助理流程", deliverable: "权限边界、运营项目与审核方案" },
];

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id.toUpperCase());
}

export function chaptersByPart(part: PartId): Chapter[] {
  return CHAPTERS.filter((c) => c.part === part);
}
