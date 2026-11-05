import { CORE_ROUTES, type Edition } from '@/content/delivery';
import { PageHero, Section, ButtonLink } from '@/components/ui/primitives';
import { CHAPTERS } from '@/content/chapters';
export function EditionLanding({edition}:{edition:Edition}) {
 const r=CORE_ROUTES[edition];
 const anchors:Record<Edition,string[]>={reader:['reader-start','reader-route','reader-support','more-paths'],campus:['campus-preview','campus-plan','campus-support'],enterprise:['enterprise-start','enterprise-delivery','enterprise-operations','enterprise-support','problems','sample','diagnosis','modules','o-tasks','enterprise-cases','solutions','starter','digital','structure','book-mapping','control','metrics','process','faq'],fde:['fde-start','fde-delivery','fde-next']};
 return <main id="main" className="edition-delivery"><PageHero eyebrow={r.name+' · 已开放实践'} title={r.title} description={r.intro} actions={<><ButtonLink href={r.learn}>{r.cta} →</ButtonLink><ButtonLink href="/resources" variant="secondary">查看配套资源</ButtonLink></>}/>
 <div className="legacy-anchors" aria-hidden="true">{anchors[edition].slice(0,2).map(id=><span id={id} key={id}/>)}</div><Section title="开始前，先看要做成什么"><div className="delivery-facts">{[['准备',r.input],['成果',r.output],['核对标准',r.check],['保存与边界',r.save]].map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div></Section>
 <Section title="沿一条路线，完成一次实践" id="core-route"><ol className="delivery-route">{r.steps.map(([h,p,u],i)=><li key={h}><span>0{i+1}</span><div><h3>{h}</h3><p>{p}</p><a href={u}>进入这一步 →</a></div></li>)}</ol></Section>
 <div className="legacy-anchors" aria-hidden="true">{anchors[edition].slice(2).map(id=><span id={id} key={id}/>)}</div><Section title="完成之后，再按需扩展"><div className="delivery-links">{r.more.map(([h,u,status])=><a href={u} key={u}><small>{status}</small><h3>{h}</h3><span>查看 →</span></a>)}</div>
 <details className="delivery-reference"><summary>展开章节导读与后续规划</summary><p>章节导读与案例参考不是完整课程。高校16周大纲、企业课程编号和其他行业任务属于设计参考或规划；当前以本页主路线作为可用实践入口。</p><div className="delivery-chapter-links">{CHAPTERS.map(c=><a key={c.id} href={'/book/chapters/'+c.id+(edition==='fde'?'?audience=fde':'?audience='+edition)}>{c.id} {c.title}</a>)}</div></details>
 <p className="delivery-note">配套练习为本站教学扩展，使用合成素材，不代表真实客户成果。原书内容以正式出版物为准。商业培训与项目使用材料前，请核对授权并联系权利人。</p></Section>
 </main>;
}
