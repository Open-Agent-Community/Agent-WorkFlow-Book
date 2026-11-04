/** 图书信息（§1.2、§4.6） */
export const BOOK = {
  title: "智能体工作流设计：方法与实践",
  cover: { src: "/images/book-3d-20261027.webp", width: 1200, height: 1200 },
  authors: ["绛烨", "吕昭波"],
  publisher: "机械工业出版社",
  pages: 366,
  isbn: "978-7-111-81535-8",
  publishedAt: "2026-09-16",
  price: "99 元",
  /** 纸质书购买渠道。图书购买与平台课程是分别管理的不同权益（§10.7）。
   *  微信小店为微信内口令，浏览器无法直接跳转，页面以“复制口令”方式提供。 */
  purchase: {
    jd: "https://item.jd.com/10235539623107.html",
    taobao: "https://e.tb.cn/h.8z8vtt1kHjPO7Xg?tk=n4ANTLWfEHl",
    wechatShop: {
      name: "机械工业出版社官方旗舰店",
      code: "#微信小店://机械工业出版社官方旗舰店/bKatviUpmKNqENE",
      note: "微信小店仅支持微信内打开：复制口令后，在微信中粘贴即可进入店铺。",
    },
  },
  /** 已核对公开仓库及目录；不以目录核验代替逐项运行验收。 */
  repoUrl: "https://github.com/jiangye1314/Agentic_Workflow",
  repoCheckedAt: "2026-10-29",
  repoNote: "已核对公开仓库、章节目录、示例说明和勘误文档；示例运行环境及各平台适配尚未逐项验证，请按仓库说明使用。",
  repoResources: [
    {title:"章节与资源说明",description:"查看仓库目录、阅读路线与使用说明。",href:"https://github.com/jiangye1314/Agentic_Workflow#readme"},
    {title:"示例代码",description:"按目录查找示例；运行前确认依赖与输入范围。",href:"https://github.com/jiangye1314/Agentic_Workflow/tree/main/examples"},
    {title:"工作流与智能体模板",description:"查看平台无关的结构模板，按实际项目调整。",href:"https://github.com/jiangye1314/Agentic_Workflow/tree/main/templates"},
    {title:"书籍勘误与反馈",description:"勘误文档已开放；核对时尚无已确认条目。",href:"https://github.com/jiangye1314/Agentic_Workflow/blob/main/docs/errata.md"},
  ],
};
