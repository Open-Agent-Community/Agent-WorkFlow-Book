/** 企业版内容：四板块（§4.4）、P01—P08 八类入口（§8.2）、O/D 任务（§8.3）、入门短路径（§8.3） */

export interface Module {
  name: string;
  teach: string; // 主要教什么
  deliver: string; // 主要交付什么
  boundary: string; // 与其他板块的边界
}

export const MODULES: Module[] = [
  { name: "AI 通识教育", teach: "任务判断、指令、核查与资料使用", deliver: "一项经过人工修改的模拟作品", boundary: "不以熟练使用多个产品作为入门达标条件" },
  { name: "AI 办公实战", teach: "借助现成工具完成会议、内容、数据等岗位任务", deliver: "报告、表格、文案与汇报等交付物", boundary: "聚焦完成单个任务；不要求建立长期运行的数字员工" },
  { name: "企业级数字员工", teach: "角色职责、工具授权、技能配置与运行监控", deliver: "可按权限执行重复任务的角色模板", boundary: "关注持续执行、管理与维护" },
  { name: "企业级智能体工作流", teach: "任务拆解、数据流、节点编排、异常恢复与评估", deliver: "可验证、可复用的多步骤流程与项目", boundary: "关注流程设计与系统协同" },
];

export interface Solution {
  id: string; // P01—P08
  scene: string; // 场景
  firstStep: string; // 起步动作
  condition: string; // 适用诊断条件
  compose: string; // 课程与实训构成
  v1: boolean; // 是否在 V1 起步范围内（§15.1：P01/P02/P03/P04/P06）
}

export const SOLUTIONS: Solution[] = [
  { id: "P01", scene: "管理者推动 AI，缺少明确场景", firstStep: "梳理任务、负责人和试点目标", condition: "管理层有意愿但尚未锁定可落地的任务场景", compose: "任务筛选问题与试点目标参考，不是已开放课程", v1: true },
  { id: "P02", scene: "全员零基础", firstStep: "完成客服回复与人工核查练习", condition: "员工普遍缺少 AI 使用经验，需要统一入门", compose: "公开客服练习＋审核表＋合成示例", v1: true },
  { id: "P03", scene: "已采购工具，使用率低", firstStep: "结合已有工具的岗位任务试点", condition: "已采购 AI 工具但缺少与岗位任务结合的使用方式", compose: "已有工具与岗位任务的匹配参考", v1: true },
  { id: "P04", scene: "部门明确提效需求", firstStep: "确定岗位任务与验收口径", condition: "某个部门有明确的任务与提效目标", compose: "岗位任务框架与部门试点安排参考", v1: true },
  { id: "P05", scene: "员工自发使用，经验分散", firstStep: "收集、审核与复用模板", condition: "员工各自摸索，产出质量不稳、经验无法复用", compose: "模板收集与审核机制＋复用库", v1: false },
  { id: "P06", scene: "担忧资料与输出风险", firstStep: "资料分级、授权、核查与审核责任", condition: "对资料外泄、输出合规存在顾虑", compose: "资料分级与授权规则＋核查流程＋审核责任配置", v1: true },
  { id: "P07", scene: "跨系统重复流程多", firstStep: "工作流诊断与可控试点", condition: "跨系统重复性流程占用大量人力", compose: "跨系统依赖与可控试点规划；完整课程尚未开放", v1: false },
  { id: "P08", scene: "新人培训压力大", firstStep: "知识问答、入职任务与标准化学习", condition: "新人上手慢、培训重复投入大", compose: "入职资料与知识问答的任务设计参考", v1: false },
];

/** 诊断推荐优先级（§8.2）：风险优先 P06；管理者缺场景优先 P01；其余按任务匹配。 */
export function recommendSolution(problem: string): Solution {
  if (problem === "risk") return SOLUTIONS.find((s) => s.id === "P06")!;
  if (problem === "no-scene") return SOLUTIONS.find((s) => s.id === "P01")!;
  const map: Record<string, string> = {
    "tool-unused": "P03",
    "quality-unstable": "P05",
    "repetitive": "P07",
    "zero-base": "P02",
    "onboarding": "P08",
    "efficiency": "P04",
  };
  const id = map[problem] ?? "P02";
  return SOLUTIONS.find((s) => s.id === id)!;
}

export const PROBLEM_OPTIONS: { value: string; label: string }[] = [
  { value: "tool-unused", label: "已有工具用不起来（已采购，使用率低）" },
  { value: "quality-unstable", label: "产出质量不稳（员工各自摸索，经验分散）" },
  { value: "risk", label: "资料和输出有风险（担忧外泄与合规）" },
  { value: "repetitive", label: "重复任务多（跨系统重复流程占用人力）" },
  { value: "zero-base", label: "培训成果难衡量 / 全员零基础" },
  { value: "onboarding", label: "新人培训压力大" },
  { value: "efficiency", label: "部门有明确提效需求" },
  { value: "no-scene", label: "管理者想推动 AI，但缺少明确场景" },
];

export interface TaskSpec {
  id: string;
  name: string;
  acceptance: string; // 验收交付物
}

export const O_TASKS: TaskSpec[] = [
  { id: "O01", name: "会议", acceptance: "纪要、行动项、负责人、期限与人工核查" },
  { id: "O02", name: "市场内容", acceptance: "素材包、事实依据、品牌检查与修改" },
  { id: "O03", name: "销售", acceptance: "模拟客户分析、跟进建议与人工审核" },
  { id: "O04", name: "入职", acceptance: "入职资料、学习任务与资料引用" },
  { id: "O05", name: "数据分析", acceptance: "分析表、指标解释、结论及核验记录" },
  { id: "O06", name: "汇报", acceptance: "汇报结构、数据依据、重点与修改记录" },
];

export const D_TASKS: TaskSpec[] = [
  { id: "D01", name: "授权调用", acceptance: "工具权限配置与限定调用结果" },
  { id: "D02", name: "技能配置", acceptance: "职责、触发、输入输出及技能配置" },
  { id: "D03", name: "排障监控", acceptance: "异常诊断、恢复与运行复盘" },
];

/** 数字员工模板角色名（§8.3）：演示模板，不表示已连接企业真实系统 */
export const DIGITAL_EMPLOYEES = ["小研", "小创", "小销", "小财"];

/** 入门短路径推荐顺序（§8.3） */
export const STARTER_SEQUENCE = ["G01", "G06", "G05", "G04", "G02", "G07"];

/** 企业版核心结构（§8.1） */
export const ENTERPRISE_STRUCTURE = [
  { label: "AI 通识", detail: "G01—G07，7 门 18 小节" },
  { label: "AI 办公实战", detail: "G08—G21，14 门 36 小节（办公提效 18＋岗位场景 18）" },
  { label: "企业级数字员工", detail: "G22—G23，2 门 6 小节；配套 D01—D03" },
  { label: "企业级智能体工作流导论", detail: "G24—G28，5 门 10 小节" },
  { label: "全院核心地图", detail: "课程规划：合计28门70小节，未作为完整课程开放" },
  { label: "工作流专业课程", detail: "W01—W13，独立进阶体系，不合并入 70 小节" },
  { label: "管理者短课", detail: "M01，独立配置" },
];

/** 办公实战工具案例槽位（§4.4）：发布前需内容运营核验，本页不预设产品能力 */
export const TOOL_SLOTS = ["WorkBuddy", "豆包工作", "千问办公"];

export function getSolution(id: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.id === id.toUpperCase());
}
