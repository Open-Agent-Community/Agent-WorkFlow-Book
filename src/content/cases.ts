import type { Audience } from "@/lib/audience";

/** 十一个书籍主案例（§5.3）。均为平台扩展案例，书中来源保留原小节。 */
export interface CaseItem {
  id: string;
  source: string; // 书中来源小节
  theme: string; // 案例主题
  industry: "教育" | "营销" | "制造";
  chapters: string[]; // 关联章节
  outcomes: Record<Audience, string>; // 三人群改造成果
}

export const CASES: CaseItem[] = [
  { id: "CASE-EDU-01", source: "11.2 英语作文批改", theme: "英语作文批改", industry: "教育", chapters: ["B11"], outcomes: { reader: "自用写作反馈工具", campus: "有量规和教师复核的反馈流程", enterprise: "培训写作反馈试点" } },
  { id: "CASE-EDU-02", source: "11.3 个性化教学内容生成", theme: "个性化教学内容生成", industry: "教育", chapters: ["B11"], outcomes: { reader: "个人学习资料包", campus: "教案、学习材料与教学检查", enterprise: "内训资料生成与审核" } },
  { id: "CASE-EDU-03", source: "11.4 个性化 AI 课堂互动", theme: "个性化 AI 课堂互动", industry: "教育", chapters: ["B11"], outcomes: { reader: "主题讨论助手", campus: "课堂互动活动与过程记录", enterprise: "团队研讨模拟助手" } },
  { id: "CASE-MKT-01", source: "12.2 批量营销素材生成", theme: "批量营销素材生成", industry: "营销", chapters: ["B12"], outcomes: { reader: "一组内容创作素材", campus: "品牌传播课程项目", enterprise: "有品牌与事实审核的素材批次" } },
  { id: "CASE-MKT-02", source: "12.3 智能客服对接", theme: "智能客服对接", industry: "营销", chapters: ["B12"], outcomes: { reader: "示例常见问题助手", campus: "校园服务问答实验", enterprise: "授权知识客服试点与转人工规则" } },
  { id: "CASE-MKT-03", source: "12.4 个性化商品推荐", theme: "个性化商品推荐", industry: "营销", chapters: ["B12"], outcomes: { reader: "模拟选择建议工具", campus: "推荐逻辑与偏差分析报告", enterprise: "模拟客户数据上的推荐方案" } },
  { id: "CASE-MKT-04", source: "12.5 数据分析", theme: "营销数据分析", industry: "营销", chapters: ["B12"], outcomes: { reader: "个人内容数据复盘", campus: "数据处理与 A/B 实验报告", enterprise: "营销指标与对照复盘" } },
  { id: "CASE-MFG-01", source: "13.2 企业个性化数据问答", theme: "企业个性化数据问答", industry: "制造", chapters: ["B13"], outcomes: { reader: "个人资料问答", campus: "校园知识库与引用实验", enterprise: "按权限检索的企业知识问答" } },
  { id: "CASE-MFG-02", source: "13.3 企业文档批量生成", theme: "企业文档批量生成", industry: "制造", chapters: ["B13"], outcomes: { reader: "个人文档模板", campus: "规范文档生成与版本管理", enterprise: "业务文档批量生成及审核" } },
  { id: "CASE-MFG-03", source: "13.4 数据分析与定制看板搭建", theme: "数据分析与定制看板", industry: "制造", chapters: ["B13"], outcomes: { reader: "个人任务看板", campus: "模拟运营指标看板", enterprise: "部门运营看板试点" } },
  { id: "CASE-MFG-04", source: "13.5 AI 扫描企业运营状况", theme: "AI 扫描企业运营状况", industry: "制造", chapters: ["B13"], outcomes: { reader: "项目复盘助理", campus: "管理决策辅助项目", enterprise: "管理者助理与异常摘要" } },
];

export function getCase(caseId: string): CaseItem | undefined {
  return CASES.find((c) => c.id === caseId.toUpperCase());
}
