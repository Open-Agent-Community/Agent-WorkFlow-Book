"use client";
import {useEffect,useRef} from 'react';
/** Trusted, version-controlled book-companion content; no user HTML is accepted. */
export function FdeBody({html,slug}:{html:string;slug:string}){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=root.current;if(!el)return;const fields=[...el.querySelectorAll<HTMLInputElement>('input[data-check]')];if(!fields.length)return;
 const key='agentflow-fde-delivery-v1:/fde'+(slug==='overview'?'':'/'+slug);let saved:unknown=[];try{saved=JSON.parse(localStorage.getItem(key)||localStorage.getItem('agentflow-fde-delivery-v1')||'[]')}catch{}
 fields.forEach(f=>{f.checked=Array.isArray(saved)&&saved.includes(f.dataset.check)});
 const sync=()=>{const checked=fields.filter(f=>f.checked).map(f=>f.dataset.check);const status=el.querySelector('#check-status');if(status)status.textContent=`已完成 ${checked.length} / ${fields.length} 项 · 本页进度仅保存在本浏览器`;try{localStorage.setItem(key,JSON.stringify(checked))}catch{if(status)status.textContent+='（当前浏览器无法保存）'}};
 const reset=()=>{fields.forEach(f=>f.checked=false);sync()};fields.forEach(f=>f.addEventListener('change',sync));const button=el.querySelector('#reset-checks');button?.addEventListener('click',reset);sync();return()=>{fields.forEach(f=>f.removeEventListener('change',sync));button?.removeEventListener('click',reset)};
 },[slug]);
 return <div ref={root} className="fde-body" dangerouslySetInnerHTML={{__html:html}}/>;
}
