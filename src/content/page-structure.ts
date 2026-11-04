/** 页面按读者决策顺序组织；筹备内容保留原状态。 */
export const EDITION_STRUCTURE = {
 reader: [
  {id:'reader-start',title:'先看任务，再做一次',intro:'从熟悉的个人任务开始，先体验流程，再对照教学样例看成果。'},
  {id:'reader-route',title:'沿一条主路径学习',intro:'把练习与原书方法连接起来；不需要一次读完所有概念与进阶目录。'},
  {id:'reader-support',title:'查资料，解决学习中的问题',intro:'区分原书、配套练习与学习权益，按需要查阅资源和常见问题。'},
 ],
 campus: [
  {id:'campus-preview',title:'先看样课与学生成果',intro:'先判断教学材料是否适合你的课堂，再决定如何安排课程。'},
  {id:'campus-plan',title:'确定课程方式与教学安排',intro:'按专业基础选择深度，把讲授、实验与评价放进同一套安排。'},
  {id:'campus-support',title:'准备开课与教学支持',intro:'核对大纲、样课与评分参考；正式开课安排由院校确认。'},
 ],
 enterprise: [
  {id:'enterprise-start',title:'从一个业务问题确定起点',intro:'先看一页建议的形态，再用公开模拟诊断梳理需求，不上传企业资料。'},
  {id:'enterprise-delivery',title:'明确任务与交付标准',intro:'把学习内容落到岗位交付物，再用教学案例理解试点方式。'},
  {id:'enterprise-operations',title:'确认责任，再推进试点',intro:'将权限、运行控制、指标口径与复盘流程一起讨论，不用学习完成率代替业务收益。'},
  {id:'enterprise-support',title:'确认合作与后续支持',intro:'公开材料用于了解方法；实际试点范围与资源安排通过人工沟通确认。'},
 ],
 fde: [
  {id:'fde-start',title:'先选任务，理解交付成果',intro:'从一个小场景开始，用已有样例了解工程任务和交付材料。'},
  {id:'fde-delivery',title:'沿交付路线逐步推进',intro:'按阶段建立可复核的证据，再结合原书补齐方法。'},
  {id:'fde-next',title:'明确能力要求，选择下一步',intro:'了解客户现场的工作方式，再进入路线、实训或工具箱。'},
 ],
} as const;
export const EXTRA_READING = {
 reader:{title:'按需展开：概念、场景与进阶路径',description:'适合完成首练后继续查阅；进阶路径和起点诊断的开放状态保留原标注。'},
 campus:{title:'按需展开：教师组织、评分量规与课程框架',description:'为备课和评价提供更完整的参考，不要求首次访问时读完。'},
 enterprise:{title:'按需展开：课程目录与项目入口',description:'已确定试点方向后再细看课程、项目和书籍关联；开放状态以各条目标注为准。'},
};
export const HOME_STRUCTURE = {
 eyebrow:'图书与配套实践',title:'先读懂方法，再把工作流做出来。',
 intro:'一本书作为共同基础，四种实践方向按目标进入。先了解内容，再选择适合自己的起点。',
 versionsIntro:'四个版本共用本书四篇十三章。选择要完成的事，就能找到对应练习、样例与材料。',
 resources:[
  {title:'书籍目录',description:'按四篇十三章查阅原书目录与章节导读。',href:'/resources#book'},
  {title:'教学案例',description:'按教育、营销与制造场景，理解各版本的建议成果。',href:'/resources#cases'},
  {title:'公开资源与下载',description:'配套练习、工程文档，以及代码与勘误的更新状态。',href:'/resources'},
 ],
} as const;
export const HOME_SUPPORT = {
  questions:[
   {question:'四个版本，需要按顺序学吗？',answer:'不需要。个人自学选普通读者版，组织教学选高校版，团队业务试点选企业版，客户现场开发与交付选 FDE 版。'},
   {question:'书籍、章节导读和平台练习有什么区别？',answer:'书籍目录对应原书四篇十三章；章节导读帮助理解原书，在线练习、教学材料与 FDE 工程任务属于配套扩展。模拟场景不代表真实客户成果。'},
   {question:'公开练习会调用 AI，或上传我的资料吗？',answer:'普通读者公开练习使用预设教学样例，不调用模型；草稿仅保存在本浏览器。请使用模拟资料，并下载成果备份。'},
  ],
  cooperationTitle:'把学习带进课堂与业务',
  cooperationIntro:'先了解公开材料，再沟通教学安排或企业试点。',
};
export const RESOURCE_STRUCTURE = [
 {id:'resources-open',title:'先取用已开放的配套材料',intro:'按实践方向进入练习与模板；每项材料的开放状态以对应页面为准。'},
 {id:'resources-reading',title:'阅读原书导读，体验公开实验',intro:'章节导读帮助理解方法，公开实验使用预设模拟素材，两者分开进入。'},
 {id:'resources-status',title:'查看代码、勘误与更新状态',intro:'来源已登记不等于内容已核验；暂未发布的资源不会作为可用下载推荐。'},
] as const;
