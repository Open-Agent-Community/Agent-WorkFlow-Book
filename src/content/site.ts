/** 站点级信息 */
export const SITE = {
  name: "智能体工作流设计",
  slogan: "从理解 AI，到完成一个可用的智能体工作流",
  description:
    "「智能体工作流设计」是面向普通读者、高校师生、企业团队与 FDE（前置部署工程师）的交互式 AI 学习及实践平台。以同名图书《智能体工作流设计：方法与实践》的四篇十三章为共享知识主线，通过交互实验、项目模板与成果评审，帮助不同人群将书中的知识转化为可验证的作品或业务成果。",
};

/** FDE 人才培训定位说明 */
export const FDE = {
  name: "FDE（Forward Deployed Engineer，前置部署工程师）",
  shortName: "FDE 人才培训",
  description:
    "FDE 是深入客户现场、把 AI 能力落到具体业务场景的工程角色。本书覆盖的任务拆解、平台选型、工作流编排与行业案例，可作为 FDE 人才培训与项目落地的参考教材。",
};

/** 已确认的商务联系方式 */
export const CONTACT = {
  title: "商务合作",
  description: "洽谈高校教学试点、企业培训与 FDE 培训合作。",
  email: "jiangye@moyingsmart.com",
  qr: "/images/wecom-qr.png",
};

/** 团购咨询由站点联系入口对接出版社，不承诺折扣或库存。 */
export const GROUP_BUY = {
  title: "图书团购咨询",
  description: "高校、企业及团队批量购书，可扫码咨询，对接机械工业出版社。",
  qr: "/images/group-buy-qr.webp",
  caption: "扫码咨询图书团购",
  remark: "智能体工作流设计 团购咨询",
  subject: "智能体工作流设计｜图书团购咨询（对接机械工业出版社）",
};

/** 页脚导航统一数据，桌面与手机保持一致。 */
export const FOOTER_LINK_GROUPS = [
  { title: "学习入口", links: [
    { href: "/reader", label: "普通读者版" }, { href: "/campus", label: "高校版" },
    { href: "/enterprise", label: "企业版" }, { href: "/fde", label: "FDE版" }, { href: "/", label: "书籍介绍" },
  ] },
  { title: "配套资源", links: [
    { href: "/resources", label: "全部配套资源" }, { href: "/resources#book", label: "书籍目录与导读" },
    { href: "/resources#cases", label: "教学案例" }, { href: "/industries", label: "行业案例" }, { href: "/policies", label: "AI政策" },
  ] },
  { title: "平台说明", links: [
    { href: "/partners", label: "合作伙伴" }, { href: "/verify", label: "证书查询演示" },
    { href: "/privacy", label: "隐私说明" }, { href: "/terms", label: "使用条款" },
    { href: "https://moyingsmart.cn/#top", label: "公司介绍 ↗" },
  ] },
] as const;
