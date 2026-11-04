"use client";
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {VersionSwitcher} from './VersionSwitcher';
import {VERSIONS} from '@/content/versions';
import {isDirty,markDirty} from '@/lib/utils';
export function SiteHeader(){
 const pathname=usePathname(),[open,setOpen]=useState(false),trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
 const current=VERSIONS.find(v=>pathname.split('/')[1]===v.slug);
 useEffect(()=>{setOpen(false);if(pathname==='/'&&location.hash==='#toc')location.replace('/resources#book')},[pathname]);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}};const outside=(e:MouseEvent)=>{if(!menu.current?.contains(e.target as Node)&&!trigger.current?.contains(e.target as Node))setOpen(false)};document.addEventListener('keydown',close);document.addEventListener('click',outside);return()=>{document.removeEventListener('keydown',close);document.removeEventListener('click',outside)}},[open]);
 useEffect(()=>{const desktop=window.matchMedia('(min-width:1024px)');const reset=()=>{if(desktop.matches)setOpen(false)};desktop.addEventListener('change',reset);return()=>desktop.removeEventListener('change',reset)},[]);
 const versions=<VersionSwitcher currentSlug={current?.slug} onSelect={e=>{if(isDirty()&&!window.confirm('当前页面有未保存的内容，确定要离开吗？')){e.preventDefault();return}markDirty(false);setOpen(false)}}/>;
 const resourceActive=pathname.startsWith('/learn/')||pathname.startsWith('/book/chapters/')||pathname==='/resources'||(['reader','campus','enterprise'].some(slug=>pathname.startsWith('/'+slug+'/cases')));
 const links=<nav className="global-nav" aria-label="主导航"><a href="/resources" aria-current={resourceActive?'page':undefined}>配套资源</a><a href="/industries" aria-current={pathname==='/industries'?'page':undefined}>行业案例</a><a href="/policies" aria-current={pathname==='/policies'?'page':undefined}>AI政策</a><a href="/partners" aria-current={pathname==='/partners'?'page':undefined}>合作伙伴</a></nav>;

 return <header className="unified-header" data-shared-header="1"><div className="shell unified-top"><a className="unified-brand" href="/"><img src="/images/platform-robot-avatar-20261027.webp" alt="" width="44" height="44"/><span>智能体工作流设计</span></a><div className="unified-desktop">{versions}{links}</div><button ref={trigger} className="menu-toggle unified-menu" aria-label={open?'关闭菜单':'打开菜单'} aria-expanded={open} aria-controls="unified-mobile" onClick={()=>setOpen(!open)}>☰</button></div><div ref={menu} id="unified-mobile" className="unified-mobile" hidden={!open}>{versions}{links}</div></header>
}
