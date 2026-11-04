import { pageSeo, SITE_URL } from "@/lib/seo";
import {IndustryModule,PolicyModule,PartnerModule} from '@/components/PlatformModules';
import {BookPresence} from '@/components/BookPresence';
import {AuthorAccounts} from '@/components/AuthorAccounts';
import './book-presence.css';
import {BOOK} from '@/content/book';
import {VERSIONS} from '@/content/versions';
import {PARTS,CHAPTERS} from '@/content/chapters';
import {HOME_STRUCTURE,HOME_SUPPORT} from '@/content/page-structure';
import {PurchaseChannels} from '@/components/interactive/PurchaseChannels';
export const metadata = pageSeo("/", {
  title: "《智能体工作流设计：方法与实践》官方配套学习平台",
  description: "绛烨、吕昭波著，机械工业出版社出版。《智能体工作流设计：方法与实践》官方配套平台，提供章节导读、教学案例、公开材料，以及普通读者、高校、企业和 FDE 四种实践方向。",
});
const bookSchema = {
  "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": SITE_URL + "/#website", url: SITE_URL + "/", name: "智能体工作流设计", inLanguage: "zh-CN" },
    { "@type": "Book", "@id": SITE_URL + "/#book", name: BOOK.title,
      url: SITE_URL + "/", image: SITE_URL + BOOK.cover.src, isbn: BOOK.isbn,
      author: BOOK.authors.map(name => ({ "@type": "Person", name })),
      publisher: { "@type": "Organization", name: BOOK.publisher }, inLanguage: "zh-CN", numberOfPages: BOOK.pages }
  ]
};
export default function Home(){return <main id="main" className="home-structured"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(bookSchema).replace(/</g,"\\u003c")}}/>
  <section className="home-clean shell"><div className="home-clean-copy"><p className="home-kicker">{HOME_STRUCTURE.eyebrow}</p><h1>智能体工作流设计<span>方法与实践</span></h1><p className="home-clean-intro">{HOME_STRUCTURE.title}<br/>{HOME_STRUCTURE.intro}</p><p className="home-byline">{BOOK.authors.join('、')} 著 · {BOOK.publisher}</p><div className="home-clean-actions"><a className="home-primary" href="#audiences">选择实践方向 ↓</a><a className="home-secondary" href="#home-book">图书内容与购买</a></div><a className="textlink" href="/resources#book">直接查看书籍目录 →</a></div><figure className="home-clean-cover book-render"><img src={BOOK.cover.src} alt={BOOK.title+'立体书封'} width={BOOK.cover.width} height={BOOK.cover.height} fetchPriority="high" loading="eager"/><figcaption>四篇 · 十三章 · 从方法到实践</figcaption></figure></section>
  <section id="home-book" className="learning-home-section"><div className="shell"><div className="presence-heading"><div><p className="label">01 / 先了解这本书</p><h2>四篇十三章，从方法到实践</h2></div><a className="textlink" href="/resources#book">四篇十三章完整目录 →</a></div><details className="home-book-outline"><summary>展开四篇内容与导读入口</summary><ol className="book-content-map">{PARTS.map((part,i)=><li key={part.id}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{part.shortName}</h3><p>{part.description}</p><a href={'/book/chapters/'+CHAPTERS.find(chapter=>chapter.part===part.id)?.id}>阅读本篇导读 →</a></div></li>)}</ol></details><div className="book-purchase-strip"><p>{BOOK.authors.join('、')} 著 · {BOOK.publisher}<br/><span>图书购买与平台课程权益分别管理。</span></p><div className="actions"><PurchaseChannels showNote/></div></div></div></section>
  <section id="audiences" className="learning-home-section"><div className="shell"><p className="label">02 / 选择实践方向</p><h2>选择一条实践路线</h2><p>{HOME_STRUCTURE.versionsIntro}</p><div className="learning-home-grid">{VERSIONS.map(version=><a href={version.learn} key={version.slug} className="learning-home-card version-choice"><p className="label">{version.name}</p><h3>{version.title}</h3><p>{version.description}</p><p className="version-deliverable"><b>成果与材料</b>{version.outcome}</p><span>开始{version.name}实践 →</span></a>)}</div></div></section>
  <section id="home-resources" className="learning-home-section"><div className="shell"><div className="presence-heading"><div><p className="label">03 / 配套资源</p><h2>配套资源</h2></div><p>目录、案例和下载材料集中查找。</p></div><a className="library-home-entry" href="/resources"><div><p className="label">目录 · 案例 · 配套材料</p><h3>目录、案例与材料</h3><p>查阅导读与案例，下载练习和工程材料。</p></div><span>进入配套资源 →</span></a></div></section>
  <IndustryModule/>
  <PolicyModule/>
  <PartnerModule/>
  <BookPresence/>
  <AuthorAccounts/>
  <section id="home-questions" className="learning-home-section"><div className="shell"><details className="home-support-outline"><summary>使用说明与常见问题</summary>{HOME_SUPPORT.questions.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</details></div></section>
  <section className="learning-home-section home-next"><div className="shell"><div><p className="label">教学与团队实践</p><h2>{HOME_SUPPORT.cooperationTitle}</h2><p>{HOME_SUPPORT.cooperationIntro}</p></div><div className="home-clean-actions"><a className="home-primary" href="/campus/apply">咨询高校教学</a><a className="home-secondary" href="/enterprise/apply">咨询企业试点</a></div></div></section>
</main>}
