import type { Audience } from "@/lib/audience";

/** 学习路径（§6.2 等）。数量与投入不硬写宣传数字，开放状态来自发布配置。 */
export type PathStatus = "已发布" | "参考大纲" | "预告";

export interface LearningPath {
  id: string;
  audience: Audience;
  title: string;
  audienceLabel: string; // 适合对象
  summary: string; // 主要内容
  chapters: string[]; // 原书重点 B 编号
  outcome: string; // 必交成果
  prerequisite: string; // 先修要求
  status: PathStatus;
  nodes: string[]; // 任务地图节点（公开详情页展示）
}

export const PATHS: LearningPath[] = [
  {
    id: "R-PATH-01",
    audience: "reader",
    title: "第一个工作流",
    audienceLabel: "零基础读者",
    summary: "流程要素、分工、提示词、核查和人工修改。",
    chapters: ["B01", "B02", "B03", "B07"],
    outcome: "任务说明＋流程图＋修改后的结果",
    prerequisite: "无，可从五分钟首练开始",
    status: "已发布",
    nodes: ["阅读合成会议素材", "查看预设草稿", "修订日期与责任", "对照素材核查", "下载流程卡与成果"],
  },
  {
    id: "R-PATH-02",
    audience: "reader",
    title: "内容与办公提效",
    audienceLabel: "职场人、创作者",
    summary: "内容生成、资料整理与数据流转。",
    chapters: ["B07", "B09", "B10", "B12"],
    outcome: "一套可复用的内容或办公模板",
    prerequisite: "建议先完成 R-PATH-01",
    status: "预告",
    nodes: ["内容生成基础", "资料整理与流转", "办公自动化", "模板沉淀与复用"],
  },
  {
    id: "R-PATH-03",
    audience: "reader",
    title: "个人知识助手",
    audienceLabel: "需要整理与检索资料的读者",
    summary: "资料整理、检索、引用与无答案处理。",
    chapters: ["B04", "B07", "B08", "B13"],
    outcome: "带引用的问答示例及失败用例",
    prerequisite: "建议先完成 R-PATH-01",
    status: "预告",
    nodes: ["资料清单与整理", "检索与引用", "无答案处理", "问答示例与失败用例"],
  },
  {
    id: "R-PATH-04",
    audience: "reader",
    title: "自动化与节点编排",
    audienceLabel: "自动化爱好者",
    summary: "触发、节点、参数、状态与异常。",
    chapters: ["B02", "B05", "B08", "B09"],
    outcome: "一条流程与运行、恢复记录",
    prerequisite: "建议先完成 R-PATH-01",
    status: "预告",
    nodes: ["触发与节点", "参数与字段映射", "运行与状态", "异常与恢复记录"],
  },
  {
    id: "R-PATH-05",
    audience: "reader",
    title: "智能体设计进阶",
    audienceLabel: "开发者、产品经理",
    summary: "模式选择、工具、协作与评估。",
    chapters: ["B04", "B05", "B06", "B07", "B08", "B11", "B12", "B13"],
    outcome: "一份方案设计与可验证项目",
    prerequisite: "建议先完成 R-PATH-01；B11—B13 为选修",
    status: "预告",
    nodes: ["设计模式选择", "编排与工具", "评估与优化", "行业案例选修", "方案设计项目"],
  },
  {
    id: "C-PATH-01",
    audience: "campus",
    title: "智能体工作流参考教学路径（16 周）",
    audienceLabel: "高校教师与学生",
    summary: "16周课程设计参考，不是已开放的完整课程；先使用90分钟公开样课。",
    chapters: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13"],
    outcome: "实验成果与综合课程项目（前测、作业、项目答辩与后测）",
    prerequisite: "由教师按三类开课方式选择技术深度",
    status: "参考大纲",
    nodes: ["阅读90分钟公开样课", "基础三讲（B01—B03）", "方法论三讲（B04—B06）", "技术实现四讲（B07—B10）", "行业项目（B11—B13）", "综合项目与答辩"],
  },
  {
    id: "E-PATH-01",
    audience: "enterprise",
    title: "企业 AI 入门短路径",
    audienceLabel: "企业员工（零基础起步）",
    summary: "围绕合成客服退款场景，完成诊断、回复、审核和复盘。",
    chapters: ["B01", "B02", "B03"],
    outcome: "一项经过人工修改的模拟作品",
    prerequisite: "无；使用公开合成资料，不需要企业管理员账号",
    status: "已发布",
    nodes: ["确认试点范围", "阅读政策与典型问题", "形成回复并审核", "记录基线与异常", "下载成果并复盘"],
  },
];

export function pathsByAudience(audience: Audience): LearningPath[] {
  return PATHS.filter((p) => p.audience === audience);
}

export function getPath(audience: Audience, pathId: string): LearningPath | undefined {
  return PATHS.find((p) => p.audience === audience && p.id === pathId.toUpperCase());
}
