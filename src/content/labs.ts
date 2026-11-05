import type { Audience } from "@/lib/audience";

/** 实验注册表（§9.3）。首版公开体验开放 LAB-01 与 LAB-03，其余筹备中。 */
export type LabStatus = "已开放体验" | "筹备中";

export interface Lab {
  id: string;
  title: string;
  chapters: string[]; // 章节关联
  scenario: string; // 情境、操作与交付
  mode: string; // 首版执行方式
  status: LabStatus;
  audiences: Audience[]; // 适用人群
  interactive?: "flow-builder" | "prompt-lab"; // 已实现的交互组件
}

export const LABS: Lab[] = [
  {
    id: "LAB-01",
    title: "拆解一条内容选题流程",
    chapters: ["B01", "B02", "B03"],
    scenario: "将一条内容选题流程拆成输入、判断、生产、核查与发布；提交流程图。",
    mode: "确定性模拟",
    status: "已开放体验",
    audiences: ["reader", "campus", "enterprise"],
    interactive: "flow-builder",
  },
  {
    id: "LAB-02",
    title: "为资料问答选择模式与编排",
    chapters: ["B04", "B05", "B06"],
    scenario: "针对资料问答选择模式与编排方式，观察不同约束下的输出差异。",
    mode: "确定性模拟",
    status: "筹备中",
    audiences: ["reader", "campus", "enterprise"],
  },
  {
    id: "LAB-03",
    title: "拼出结构化提示词",
    chapters: ["B07"],
    scenario: "以任务、资料、输出格式、审核规则拼出结构化提示词；检查缺项。",
    mode: "表单与规则反馈",
    status: "已开放体验",
    audiences: ["reader", "campus", "enterprise"],
    interactive: "prompt-lab",
  },
  {
    id: "LAB-04",
    title: "表格事件的节点编排",
    chapters: ["B08", "B09"],
    scenario: "使用模拟表格事件连接提取、条件、人工审核、写回与通知。",
    mode: "节点模拟与运行日志",
    status: "筹备中",
    audiences: ["reader", "campus", "enterprise"],
  },
  {
    id: "LAB-05",
    title: "作文反馈与教师复核",
    chapters: ["B11"],
    scenario: "以虚构作文做反馈、指出依据与教师复核；输出教学反馈。",
    mode: "模拟样例与人工编辑",
    status: "筹备中",
    audiences: ["reader", "campus", "enterprise"],
  },
  {
    id: "LAB-06",
    title: "三种异常的设置与恢复",
    chapters: ["B12", "B13"],
    scenario: "对模拟资料问答与内容生成流程设置无依据、无权限、超时三种异常。",
    mode: "可重复运行的异常实验",
    status: "筹备中",
    audiences: ["reader", "campus", "enterprise"],
  },
];

export function getLab(labId: string): Lab | undefined {
  return LABS.find((l) => l.id === labId.toUpperCase());
}
