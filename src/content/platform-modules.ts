export const INDUSTRY_MODULE={
 title:'行业案例',description:'按行业理解工作流的任务与成果。当前先整理原书关联的教学案例，更多行业持续补充。',
 notice:'以下为原书关联的教学扩展场景，不作为真实客户交付或商业成果展示。',
 industries:[
  {id:'marketing',name:'智能营销',industry:'营销',description:'围绕素材生产、客户服务、商品推荐与营销数据复盘，梳理工作流的输入、审核与交付。',focus:'素材与事实审核、转人工规则、数据复盘口径',anchor:'case-marketing'},
  {id:'manufacturing',name:'工业／制造业',industry:'制造',description:'从企业资料问答、文档生成到指标看板与运营摘要，理解业务资料进入工作流后的处理方式。',focus:'资料授权、引用依据、版本记录与人工确认',anchor:'case-manufacturing'},
  {id:'education',name:'教育',industry:'教育',description:'从写作反馈、教学内容生成到课堂互动，探索教师与 AI 协作的任务边界。',focus:'教学目标、评价量规、教师复核与过程记录',anchor:'case-education'},
 ],
 more:'更多行业正在补充',
} as const;
export const PARTNER_MODULE={title:'合作伙伴',status:'出版与推广协作',description:'了解本书出版、图书推荐与读书分享中的协作伙伴及具体合作范围。',note:'以下信息仅说明与本书相关的出版、推荐及读书分享，不延伸为其他业务的客户或合作背书。'} as const;

/** Classification adapted for this book; no upstream industry coverage is implied. */
export const INDUSTRY_ATLAS={
 title:'先看产业链位置，再找应用场景',
 intro:'本书聚焦模型调用、智能体编排与行业任务实践。先认识产业链，再用应用标签查找现有教学案例。',
 source:{name:'AI产业链地图 · 产业链图谱',url:'https://aichainmap.com/atlas',applications:'https://aichainmap.com/层级/第五层-应用',checkedAt:'2026-10-29'},
 layers:[
  {id:'energy',name:'能源与电力',description:'供电与能源保障',scope:'产业背景'},
  {id:'chips',name:'芯片系统',description:'计算芯片与硬件系统',scope:'产业背景'},
  {id:'infrastructure',name:'AI基础设施',description:'云、数据中心与算力服务',scope:'产业背景'},
  {id:'models',name:'AI基础模型',description:'本书侧重模型调用与工具连接',scope:'方法衔接'},
  {id:'applications',name:'AI应用',description:'把能力组织成可检查的业务任务',scope:'案例重点'},
 ],
 note:'分类参考外部产业链图谱，并按本书内容重新整理；标签关联由本站编辑判断，不代表原图谱的书籍推荐。',
 coverage:'现有制造案例围绕企业知识、文档与运营管理，不延伸为工业视觉、机器人控制或产线自动化案例。',
 filtersLabel:'按应用方向筛选',
 upcomingTitle:'后续拓展方向',
 upcomingNote:'以下方向暂未收录教学案例，补充具体任务与可核查内容后再开放入口。',
 upcoming:['AI金融','智慧医疗','AI法律','具身智能与机器人','智能驾驶','AI游戏','AI安全','AI交通与物流'],
 tags:[
  {id:'creative',name:'AIGC与创意内容',cases:['CASE-MKT-01']},
  {id:'service',name:'AI客服',cases:['CASE-MKT-02']},
  {id:'commerce',name:'AI电商与零售',cases:['CASE-MKT-03','CASE-MKT-04']},
  {id:'office',name:'AI办公与企业服务',cases:['CASE-MFG-01','CASE-MFG-02','CASE-MFG-03','CASE-MFG-04']},
  {id:'manufacturing',name:'AI制造 · 运营管理',cases:['CASE-MFG-01','CASE-MFG-02','CASE-MFG-03','CASE-MFG-04']},
  {id:'education',name:'AI教育',cases:['CASE-EDU-01','CASE-EDU-02','CASE-EDU-03']},
 ],
} as const;
