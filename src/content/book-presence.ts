/** 作者提供的活动、读书会与图书展示资料，2026-10-27更新。 */
const base = '/images/book-events-20261027/';
export const BOOK_PRESENCE = {
  heading: '新书线下曝光',
  intro: '从安全开发、云计算到开源社区，让工作流的方法走进更多技术现场。',
  events: [
    { name: '看雪 · 第十届安全开发者大会', kind: '主会场大屏展示', description: '《智能体工作流设计：方法与实践》在大会主会场大屏亮相。', image: 'kanxue-screen', alt: '看雪第十届安全开发者大会主会场大屏上的图书展示画面' },
    { name: 'AWS Community Day', kind: '开发者社区活动', description: '图书亮相社区活动，与开发者交流智能体工作流的方法与实践。', image: 'aws-community-day', alt: '2026年10月17日深圳站 Community Day Autumn 主论坛现场' },
    { name: '云栖大会', kind: '技术交流现场', description: '在云栖大会的技术交流中，分享 AI 编程与工作流实践。', image: 'apsara-conference', alt: '云栖大会现场，吕昭波分享 AI Coding 自主迭代的理想与现实' },
    { name: 'GOAL 世界开源大赛', kind: '开源活动', description: '图书也走进开源活动，连接关注智能体应用与工程实践的开发者。', image: 'goal-open-source', alt: 'GOAL 世界开源大赛现场展台上的智能体工作流设计图书与宣传资料' },
    { name: '1024 AI 社区日', kind: '极客邦科技主办 · 社区活动', description: '《智能体工作流设计：方法与实践》亮相极客邦科技主办的 1024 AI 社区日，展示图书内容与配套学习平台。', image: 'geekbang-1024-ai-community', alt: '1024 AI 社区日图书推广海报，展示智能体工作流设计方法与实践及配套学习平台' },
  ],
  records: [
    { image: 'kanxue-audience', caption: '看雪大会 · 主会场现场', alt: '看雪安全开发者大会主会场全景' },
  ],
  partners: [
    { name: '机械工业出版社', role: '出版发行', detail: '《智能体工作流设计：方法与实践》出版方。' },
    { name: '刘润读书会', role: '读书分享与图书展示', detail: '围绕 AI 落地与智能体工作流开展新书分享，图书在读书会商品页展示。' },
    { name: '极客邦科技', role: '图书推荐', detail: '与 Datawhale 联袂推荐本书。' },
    { name: 'Datawhale', role: '图书推荐', detail: '与极客邦科技联袂推荐本书。' },
  ],
  readingClub: { title: '把 AI 从“会聊天”，变成真正能干活的工作流', date: '2026-10-23', dateLabel: '2026.10.23 · 刘润读书会新书分享', description: '绛烨、吕昭波与刘润读书会玄子，一起聊 AI 落地的最后一公里。', poster: 'reading-club-poster', store: 'reading-club-store' },
};
export const presenceImage = (name: string, thumbnail = false) => base + name + (thumbnail ? '-thumb' : '') + '.webp';

/** Intrinsic thumbnail dimensions, measured from the checked-in WebP files. */
export const PRESENCE_IMAGE_SIZES: Record<string, {width: number; height: number}> = {
  'kanxue-screen': {width:880,height:495},
  'aws-community-day': {width:880,height:660},
  'apsara-conference': {width:880,height:660},
  'goal-open-source': {width:1000,height:563},
  'geekbang-1024-ai-community': {width:1000,height:625},
  'kanxue-audience': {width:880,height:587},
  'reading-club-poster': {width:562,height:1000},
};
