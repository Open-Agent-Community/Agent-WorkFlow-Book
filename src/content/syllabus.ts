/** 高校参考学期安排（§7.2）：16 周，每周 3 学时（2 讲授／讨论＋1 指导实验），共 48 学时。 */
export interface Week {
  week: number;
  topic: string;
  chapters: string;
  outcome: string; // 课堂／实验成果
}

export const SYLLABUS: Week[] = [
  { week: 1, topic: "起点测评与业务流程", chapters: "B01", outcome: "前测、任务说明与流程要素" },
  { week: 2, topic: "工作流四大系统", chapters: "B02", outcome: "流程图与输入输出表" },
  { week: 3, topic: "大模型、智能体与工作流", chapters: "B03", outcome: "任务分类与分工表" },
  { week: 4, topic: "反思与工具增强", chapters: "B04", outcome: "两种模式的效果比较" },
  { week: 5, topic: "规划与多智能体协作", chapters: "B04", outcome: "任务拆解与角色协作方案" },
  { week: 6, topic: "五种编排与 MCP 概念", chapters: "B05", outcome: "编排选择与工具授权示例" },
  { week: 7, topic: "推理框架与系统评估", chapters: "B06", outcome: "可观察执行轨迹与测试方案" },
  { week: 8, topic: "平台选型与提示工程", chapters: "B07", outcome: "选型单与结构化提示词" },
  { week: 9, topic: "知识库、引用与异常", chapters: "B07、B08", outcome: "问答实验与无答案用例" },
  { week: 10, topic: "节点式编排", chapters: "B08", outcome: "字段映射及故障恢复实验" },
  { week: 11, topic: "办公自动化", chapters: "B09", outcome: "模拟多维表格自动化" },
  { week: 12, topic: "工作流与自主行动", chapters: "B10", outcome: "方案边界与评估报告" },
  { week: 13, topic: "教育行业项目", chapters: "B11", outcome: "教育案例原型与人工复核" },
  { week: 14, topic: "营销／制造项目选题", chapters: "B12、B13", outcome: "小组需求、方案与验收计划" },
  { week: 15, topic: "综合项目迭代", chapters: "自选章节", outcome: "运行证据、测试与改进记录" },
  { week: 16, topic: "项目答辩与后测", chapters: "综合", outcome: "作品展示、个人贡献与课程复盘" },
];

/** 三类课程使用方式（§7.1） */
export interface CourseMode {
  id: "general" | "applied" | "cs";
  name: string;
  focus: string; // 教学重点
  evaluation: string; // 主要评价
  depth: string; // 技术深度
}

export const COURSE_MODES: CourseMode[] = [
  { id: "general", name: "AI 通识与跨专业选修", focus: "概念、任务判断、无代码流程、核查与责任", evaluation: "个人实验、流程说明、应用作品", depth: "无代码：使用可视化界面完成流程与核查" },
  { id: "applied", name: "应用型实践课程", focus: "平台选型、场景方案、节点实训与跨专业项目", evaluation: "完整交付物、测试与小组协作", depth: "低代码：配置平台与节点参数，理解字段映射" },
  { id: "cs", name: "计算机相关专业项目课", focus: "数据流、接口、知识库、异常、权限与系统评估", evaluation: "工程设计、可复现实验与综合项目", depth: "代码级：接口调用、知识库构建与系统评估" },
];

/** 参考评价方式（§7.5） */
export const GRADING = {
  total: [
    { item: "知识自测", weight: "20%" },
    { item: "实验作业", weight: "30%" },
    { item: "综合项目", weight: "40%" },
    { item: "学习复盘", weight: "10%" },
  ],
  project: [
    { item: "需求与流程", weight: "20%" },
    { item: "方法与工具选择", weight: "20%" },
    { item: "运行证据与测试", weight: "25%" },
    { item: "核查及人工改进", weight: "20%" },
    { item: "说明与个人贡献", weight: "15%" },
  ],
};
