import { SeoBreadcrumbs } from "@/components/SeoBreadcrumbs";
import subpageStructure from '@/content/fde/subpage-structure.json';
import {ReadingGuide} from '@/components/PageStructure';
import {EDITION_STRUCTURE} from '@/content/page-structure';
import {PageHero,ButtonLink} from '@/components/ui/primitives';
import {FdeBody} from './FdeBody';
import pages from '@/content/fde/pages.json';
export type FdeSlug=keyof typeof pages;
export function FdePage({slug}:{slug:FdeSlug}){const p=pages[slug];return <main id="main" className="fde-edition"><SeoBreadcrumbs items={slug==='overview'?[{name:'FDE版',href:'/fde'}]:[{name:'FDE版',href:'/fde'},{name:p.title,href:`/fde/${slug}`}]}/><PageHero eyebrow={p.eyebrow} title={<>{p.titleLines.map((line,i)=><span key={i} style={{display:"block"}}>{line}</span>)}</>} description={p.description} actions={p.actions.map((a,i)=><ButtonLink key={a.href} href={a.href} className={i?"home-secondary":undefined} variant={i?'secondary':'primary'}>{a.label}</ButtonLink>)}>{p.note&&<p className="hero-note">{p.note}</p>}</PageHero><div className="subnav"><nav className="shell" aria-label="FDE 页面">{[['overview','概览'],['paths','交付路线'],['cases','行业实训'],['kit','交付工具箱']].map(([key,label])=><a key={key} href={'/fde'+(key==='overview'?'':'/'+key)} aria-current={key===slug?'page':undefined}>{label}</a>)}</nav></div><ReadingGuide stages={slug==='overview'?EDITION_STRUCTURE.fde:subpageStructure[slug]}/><FdeBody html={p.body} slug={slug}/><aside className="shell delivery-use"><h2>材料使用与实践边界</h2><p>本地教学基线不等于生产鉴权或上线系统。下载包已附使用说明；商业使用须确认权利，关联仓库CC BY-NC-SA 4.0许可保持不变。</p><a href="/fde-assets/material-use.md" download>下载使用说明 ↓</a> · <a href="/fde-assets/evidence-example.md" download>证据包填写示例 ↓</a></aside></main>}
