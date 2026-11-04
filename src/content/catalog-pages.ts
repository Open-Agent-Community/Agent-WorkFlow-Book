export const CASE_GROUPS = [
 {id:'education',industry:'教育',title:'教育与学习',description:'从写作反馈、内容生成到课堂互动，原书第 11 章的教学改造场景。'},
 {id:'marketing',industry:'营销',title:'营销与客户服务',description:'从素材生产、客服与推荐到数据复盘，原书第 12 章的应用场景。'},
 {id:'manufacturing',industry:'制造',title:'制造与企业运营',description:'从资料问答、文档生成到指标看板，原书第 13 章的行业场景。'},
] as const;
export const CATALOG_COPY={
 book:{title:'四篇十三章，按目录阅读',description:'先找到要读的章节，再进入公开导读。目录对应原书，平台练习与课程的开放状态另行标注。',notice:'这里是原书目录与章节导读入口，不是完整课程。配套实践为平台扩展内容，使用模拟材料时会单独说明。'},
 cases:{title:'按行业，找到一个实践场景',description:'先看场景和当前版本的建议成果，再进入案例说明。所有改造内容均为平台扩展教学案例，不代表真实客户项目成果。'},
 resources:{title:'公开材料，按用途查找',description:'阅读导读、动手练习与工程文档分开整理。先使用已开放内容，待核验和筹备中的资源单独列出。'},
 downloads:[
 {title:'高校90分钟样课',description:'讲解、素材、学生任务、参考成果、评分表及使用说明；高校版，已开放。',href:'/fde-assets/campus-sample.zip?v=20261031',format:'ZIP · 教学材料'},
 {title:'企业客服实践包',description:'合成政策、五问、审核、基线、复盘与填写示例；企业版，已开放。',href:'/fde-assets/enterprise-practice.zip?v=20261031',format:'ZIP · 实践材料'},
 {title:'FDE本地工程包',description:'Python标准库工程、6项测试、证据示例与使用说明；FDE版，已开放。',href:'/fde-assets/fde-engineering-project.zip?v=20261031',format:'ZIP · 本地工程'},

 {title:'FDE 项目任务书',description:'含起步问题、模拟案例与分阶段交接提示，可下载后编辑。',href:'/fde-assets/project-brief.md?v=25',format:'Markdown'},
 {title:'现场复盘参考',description:'用于整理反馈、待确认问题与下一轮行动。',href:'/fde-assets/field-review.md',format:'Markdown'},
 {title:'交付文档包',description:'包含任务书、现场复盘、评测记录与运行手册四份文档。',href:'/fde-assets/delivery-pack.zip?v=20261031',format:'ZIP'},
 ],
} as const;
