import {PresenceCarousel} from '@/components/interactive/PresenceCarousel';
import {BOOK_PRESENCE as content, presenceImage, PRESENCE_IMAGE_SIZES} from '@/content/book-presence';

function EvidenceImage({name, alt, className = ''}: {name: string; alt: string; className?: string}) {
  return <a className={`presence-photo ${className}`} href={presenceImage(name)} target="_blank" rel="noopener noreferrer" aria-label={`${alt}，打开大图`}><img src={presenceImage(name, true)} alt={alt} width={PRESENCE_IMAGE_SIZES[name]?.width} height={PRESENCE_IMAGE_SIZES[name]?.height} loading="lazy" decoding="async"/><span>查看大图 ↗</span></a>;
}
export function BookPresence(){return <>
  <section id="book-events" className="learning-home-section book-presence"><div className="shell">
    <div className="presence-heading"><div><p className="label">BOOK IN THE COMMUNITY</p><h2>{content.heading}</h2></div><p>{content.intro}</p></div>
    <PresenceCarousel labels={content.events.map(event=>event.name)}>{content.events.map((event,index)=><article className="presence-event" role="group" aria-roledescription="幻灯片" aria-label={`${index+1} / ${content.events.length}：${event.name}`} key={event.name}>
      {event.image?<EvidenceImage name={event.image} alt={event.alt}/>:<div className="presence-open-source" aria-hidden="true"><span>OPEN SOURCE</span><strong>GOAL</strong><span>共享方法 · 一起实践</span></div>}
      <div className="presence-event-copy"><p className="presence-meta"><span>{String(index+1).padStart(2,'0')}</span>{event.kind}</p><h3>{event.name}</h3><p>{event.description}</p></div>
    </article>)}</PresenceCarousel>
    <details className="presence-more"><summary>更多现场照片 <span>展开 / 收起</span></summary><div className="presence-records">{content.records.map(record=><figure key={record.image}><EvidenceImage name={record.image} alt={record.alt}/><figcaption>{record.caption}</figcaption></figure>)}</div></details>
  </div></section>
  <section id="book-partners" className="learning-home-section book-partners"><div className="shell">
    <details className="home-partner-outline"><summary>出版与推广伙伴 · 展开具体范围</summary><div className="presence-partners">{content.partners.map(partner=><article key={partner.name}><span>{partner.role}</span><h3>{partner.name}</h3><p>{partner.detail}</p></article>)}</div></details>
    <details className="presence-reading-disclosure"><summary>刘润读书会 · 新书分享回顾<span>展开海报与活动信息 ↓</span></summary><article className="presence-reading"><EvidenceImage name={content.readingClub.poster} alt="刘润读书会2026年10月23日新书分享海报，绛烨、吕昭波与玄子聊AI落地" className="presence-poster"/><div className="presence-reading-copy"><p className="presence-meta"><time dateTime={content.readingClub.date}>{content.readingClub.dateLabel}</time></p><h3>{content.readingClub.title}</h3><p>{content.readingClub.description}</p><p className="presence-reading-note">活动回顾 · 海报中的预约二维码为当期活动信息。</p><a className="presence-evidence-link" href={presenceImage(content.readingClub.store)} target="_blank" rel="noopener noreferrer">查看读书会图书展示截图 ↗</a><a className="presence-evidence-link" href="#home-book">图书信息与购买 ↑</a></div></article></details>
  </div></section>
</>}
