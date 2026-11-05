'use client';
import {useEffect,useState} from 'react';
import {CASES} from '@/content/cases';
import {INDUSTRY_ATLAS,INDUSTRY_MODULE} from '@/content/platform-modules';

export function IndustryExplorer(){
 const [selected,setSelected]=useState('all');
 useEffect(()=>{
  // Keep existing industry bookmarks useful even when reached after a filter.
  const reset=()=>{if(INDUSTRY_MODULE.industries.some(item=>'#'+item.id===location.hash))setSelected('all')};
  window.addEventListener('hashchange',reset);return()=>window.removeEventListener('hashchange',reset);
 },[]);
 const active=INDUSTRY_ATLAS.tags.find(tag=>tag.id===selected);
 const visible=CASES.filter(item=>!active||(active.cases as readonly string[]).includes(item.id));
 return <section id="industry-cases" className="shell industry-explorer">
  <div className="catalog-group-heading"><p className="label">01 / 应用场景</p><h2>{INDUSTRY_ATLAS.filtersLabel}</h2><p>同一案例可关联多个方向，筛选结果按案例去重；仍保留原书的三个行业分组。</p></div>
  <div className="industry-filters" role="group" aria-label="案例应用方向">
   <button type="button" aria-pressed={selected==='all'} onClick={()=>setSelected('all')}>全部案例 <span>{CASES.length}</span></button>
   {INDUSTRY_ATLAS.tags.map(tag=><button key={tag.id} type="button" aria-pressed={selected===tag.id} onClick={()=>setSelected(tag.id)}>{tag.name} <span>{tag.cases.length}</span></button>)}
  </div>
  <p role="status" aria-live="polite" className="industry-filter-status">{active?.name??'全部应用方向'} · {visible.length}个教学案例</p>
  <div className="industry-sections">{INDUSTRY_MODULE.industries.map((item,i)=>{
   const examples=visible.filter(example=>example.industry===item.industry);
   return <section id={item.id} key={item.id} className="industry-section" hidden={!examples.length}>
    <div className="catalog-group-heading"><p className="label">{String(i+1).padStart(2,'0')} / 原书行业</p><h2>{item.name}</h2><p>{item.description}</p></div>
    <p className="industry-focus"><b>建议关注：</b>{item.focus}</p>
    <div className="industry-case-list">{examples.map(example=><a key={example.id} href={'/reader/cases/'+example.id} data-industry-case={example.id}><span>原书 {example.source}</span><h3>{example.theme}</h3><p>{example.outcomes.reader}</p><ul className="industry-case-tags" aria-label="应用标签">{INDUSTRY_ATLAS.tags.filter(tag=>(tag.cases as readonly string[]).includes(example.id)).map(tag=><li key={tag.id}>{tag.name}</li>)}</ul><span>查看教学案例 →</span></a>)}</div>
    <div className="industry-reading-links"><a href={'/resources?audience=reader#'+item.anchor}>普通读者方向 →</a><a href={'/resources?audience=campus#'+item.anchor}>高校方向 →</a><a href={'/resources?audience=enterprise#'+item.anchor}>企业方向 →</a></div>
   </section>;
  })}</div>
 </section>;
}
