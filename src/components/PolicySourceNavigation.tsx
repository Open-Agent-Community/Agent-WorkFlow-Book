"use client";
import {useEffect} from 'react';

/** Enhance real fragment links; native links and details still work without JS. */
export function PolicySourceNavigation(){
 useEffect(()=>{
  let frame:number|undefined;
  let pendingFocusId:string|undefined;
  const reveal=(hash:string,focus=false)=>{
   let id:string;try{id=decodeURIComponent(hash.slice(1))}catch{return}
   const target=document.getElementById(id);
   if(!(target instanceof HTMLDetailsElement)||(!target.hasAttribute('data-policy-source')&&!target.hasAttribute('data-fragment-details')))return;
   target.open=true;
   if(focus)pendingFocusId=id;
   if(frame!==undefined)cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{target.scrollIntoView({block:'start',behavior:'instant'});if(pendingFocusId===id)target.querySelector('summary')?.focus({preventScroll:true});pendingFocusId=undefined});
  };
  const fromHash=()=>reveal(location.hash);
  const fromLink=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const anchor=event.target instanceof Element?event.target.closest('a[href]'):null;
   if(!(anchor instanceof HTMLAnchorElement)||anchor.target==='_blank')return;
   const url=new URL(anchor.href);
   if(url.origin===location.origin&&url.pathname===location.pathname)reveal(url.hash,true);
  };
  window.addEventListener('hashchange',fromHash);document.addEventListener('click',fromLink);fromHash();
  return()=>{window.removeEventListener('hashchange',fromHash);document.removeEventListener('click',fromLink);if(frame!==undefined)cancelAnimationFrame(frame)};
 },[]);
 return null;
}
