"use client";
import {useEffect,useRef,type MouseEvent} from 'react';
import {VERSIONS} from '@/content/versions';

export function VersionSwitcher({currentSlug,onSelect}:{currentSlug?:string;onSelect:(event:MouseEvent<HTMLAnchorElement>)=>void}){
 const ref=useRef<HTMLDetailsElement>(null);
 // Close after click activation so links do not move between pointerdown and pointerup.
 useEffect(()=>{const outside=(e:globalThis.MouseEvent)=>{if(ref.current?.open&&!ref.current.contains(e.target as Node))ref.current.open=false};document.addEventListener('click',outside);return()=>document.removeEventListener('click',outside)},[]);
 useEffect(()=>{if(ref.current)ref.current.open=false},[currentSlug]);
 useEffect(()=>{const breakpoint=window.matchMedia('(min-width:1024px)');const close=()=>{if(ref.current)ref.current.open=false};breakpoint.addEventListener('change',close);return()=>breakpoint.removeEventListener('change',close)},[]);
 return <details ref={ref} className="version-switcher" onKeyDown={e=>{if(e.key==='Escape'&&ref.current?.open){e.stopPropagation();ref.current.open=false;ref.current.querySelector('summary')?.focus()}}}>
  <summary>切换版本<span aria-hidden="true">⌄</span></summary>
  <nav className="version-options" aria-label="选择学习版本">{VERSIONS.map(v=><a key={v.slug} href={'/'+v.slug} aria-current={currentSlug===v.slug?'page':undefined} onClick={e=>{onSelect(e);if(!e.defaultPrevented&&ref.current)ref.current.open=false}}><span>{v.name}{currentSlug===v.slug&&<small>当前版本</small>}</span><span>{v.outcome}</span></a>)}</nav>
 </details>
}
