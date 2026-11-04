/* Book companion navigation extension. Idempotent across client navigation. */
(()=>{if(window.__agentflowFDE)return;window.__agentflowFDE=true;document.documentElement.dataset.editorial="1";
const style=document.createElement('style');style.textContent='header [data-original-versions]{display:none!important}[data-stable-versions]{display:flex;align-items:center;flex-wrap:nowrap;flex-shrink:0;padding:4px;border:1px solid #1a2f52;border-radius:999px;background:#101f38;gap:0}[data-stable-versions] a{display:block;white-space:nowrap;padding:6px 12px;border-radius:999px;color:#c6d3e8!important;background:transparent;font-size:14px;line-height:20px;font-weight:500}[data-stable-versions] a[aria-current]{background:#a3e635;color:#050a14!important}[data-stable-versions] a:hover{background:#26406b;color:white!important}[data-stable-versions] a[aria-current]:hover{background:#a3e635;color:#050a14!important}@media(max-width:639px){[data-stable-versions]{width:100%}[data-stable-versions] a{flex:1;padding:7px 5px;font-size:12px;text-align:center}}[data-fde-grid]{grid-template-columns:repeat(4,minmax(0,1fr))!important}@media(max-width:1023px){[data-fde-grid]{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:639px){[data-fde-grid]{grid-template-columns:1fr!important}}[data-fde-nav]{white-space:nowrap}[data-fde-reading]{margin-top:1rem;padding:1rem;border:1px solid #4d7c0f;border-radius:.75rem;font-size:.875rem;line-height:1.7}[data-fde-reading] a{color:#84cc16;text-decoration:underline}';document.head.append(style);
const replacements=[
['普通读者版、高校版、企业版共享的知识主线','普通读者版、高校版、企业版与 FDE 版共享的知识主线'],
['普通读者、高校与企业三版共同的方法底座','普通读者、高校、企业与 FDE 四版共同的方法底座'],
['三版学习路径、教学安排','四版学习路径、教学安排'],
['可在三个版本中按人群使用','可在四个版本中按人群使用'],
['三个版本有什么区别？','四个版本有什么区别？'],
['普通读者的个人作品、高校的项目成果、企业的岗位任务或试点成果','普通读者的个人作品、高校的项目成果、企业的岗位任务，以及 FDE 的客户交付项目']
];
function optimizeHome(){
 const main=document.querySelector('main'),aud=document.querySelector('#audiences');
 if(!main||!aud||main.dataset.homeGuide)return;
 main.dataset.homeGuide='1';
 const css=document.createElement('style');css.textContent=`
 main[data-home-guide] section{padding-top:42px;padding-bottom:42px}#audiences{scroll-margin-top:90px}#audiences>div:first-child{max-width:760px}#audiences .version-guide{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:24px}.version-choice{padding:22px!important;display:flex;flex-direction:column;gap:12px;text-align:left;min-width:0}.version-choice h3{font-size:20px;line-height:1.4;margin:0}.version-choice p{margin:0;font-size:14px;line-height:1.65}.version-choice .vg-label{font-size:13px;font-weight:700}.version-choice .vg-detail{opacity:.8}.version-choice .vg-go{margin-top:auto;padding-top:12px;font-weight:600}.version-note{font-size:14px;line-height:1.8;text-align:center;margin:20px auto 0;max-width:760px}.home-hero-inner{padding-top:48px!important;padding-bottom:40px!important}.home-hero-inner h1{font-size:clamp(28px,3.4vw,44px);max-width:1000px}.home-hero-inner>p:nth-of-type(2){max-width:860px;line-height:1.8}.home-book-details img{max-width:210px;margin:auto}.home-book-details>div{margin-top:20px!important}.home-shortcuts{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 24px;margin-top:18px;font-size:14px}.home-shortcuts a{text-decoration:underline;text-underline-offset:4px}@media(max-width:900px){#audiences .version-guide{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:540px){main[data-home-guide] section{padding-top:30px;padding-bottom:30px}.home-hero-inner{padding-top:32px!important;padding-bottom:28px!important}#audiences .version-guide{grid-template-columns:1fr;gap:10px}.version-choice{padding:16px!important;gap:7px}.version-choice h3{font-size:18px}.version-choice .vg-go{padding-top:3px}.version-note{text-align:left}.home-shortcuts{justify-content:flex-start}}
 `;document.head.append(css);
 const heading=aud.querySelector('h2');if(heading)heading.textContent='四个版本，按你要完成的事来选';
 const intro=heading?.nextElementSibling;if(intro)intro.textContent='共用本书四篇十三章，区别在学习目标、练习方式和最终交付物。随时可以从顶部切换。';
 const base=aud.querySelector('a[href="/reader"]');if(base){const grid=base.parentElement;grid.className='version-guide';grid.removeAttribute('data-fde-grid');
 const data=[['/reader','普通读者版','做出自己的第一个作品','适合个人自学、AI 入门者','个人助手、内容或办公工作流','从五分钟首练开始'],['/campus','高校版','把知识变成教学项目','适合教师、学生、课程负责人','课程实验、项目成果与评分记录','查看课程与实验安排'],['/enterprise','企业版','让团队完成业务任务','适合企业管理者、内训与业务团队','岗位任务、团队试点与复盘','从企业需求诊断开始'],['/fde','FDE版','为客户完成项目交付','适合工程师、解决方案与交付人员','需求方案、系统集成与验收交接','查看五阶段交付路线']];
 for(const [url,name,goal,who,out,start]of data){const a=grid.querySelector('a[href="'+url+'"]');if(!a)continue;a.className=base.className+' version-choice';a.innerHTML='<p class="vg-label text-accent-strong">'+name+'</p><h3>'+goal+'</h3><p class="vg-detail">'+who+'</p><p><strong>成果：</strong>'+out+'</p><p class="vg-go text-accent-strong">'+start+' →</p>';}
 const note=document.createElement('p');note.className='version-note text-ink-600';note.textContent='企业版侧重自己的团队与业务；FDE 版侧重客户现场的项目交付。不确定从哪开始，可先选普通读者版。';aud.append(note);
 const quick=document.createElement('nav');quick.className='home-shortcuts text-accent-strong';quick.setAttribute('aria-label','首页内容导航');quick.innerHTML='<a href="#home-cases">看看能做什么</a><a href="#toc">查看书籍目录</a><a href="#home-book">图书信息</a><a href="#resources">配套资源</a>';aud.append(quick);
 }
 const hero=main.firstElementChild,inner=hero?.querySelector('h1')?.parentElement;
 let book=null;if(inner){
 const details=[...inner.children].find(x=>x.querySelector('img'));
 const clean=document.createElement('div');clean.className='home-clean shell';
 clean.innerHTML='<div class="home-clean-copy"><p class="home-kicker">图书配套学习平台</p><h1>智能体工作流设计<span>方法与实践</span></h1><p class="home-clean-intro">从理解 AI，到完成一个可用的工作流。<br>以四篇十三章为基础，选择适合你的实践路径。</p><p class="home-byline">绛烨、吕昭波 著 · 机械工业出版社</p><div class="home-clean-actions"><a class="home-primary" href="#audiences">选择学习版本 ↓</a><a class="home-secondary" href="#toc">查看书籍目录</a></div><a class="home-purchase" href="#home-book">图书信息与购买 →</a></div><figure class="home-clean-cover"><img src="/images/book-cover.webp" width="1200" height="1489" alt="《智能体工作流设计：方法与实践》封面" fetchpriority="high"><figcaption>四篇 · 十三章 · 从方法到实践</figcaption></figure>';
 inner.hidden=true;inner.style.display='none';inner.after(clean);
 book=document.createElement('section');book.id='home-book';book.className='home-clean-book shell';book.innerHTML='<p class="home-kicker">图书与购买</p><h2>智能体工作流设计：方法与实践</h2>';
 if(details){const metadata=details.lastElementChild.cloneNode(true);book.append(metadata)}
 const purchases=document.createElement('div');purchases.className='home-clean-actions';inner.querySelectorAll('a[target="_blank"]').forEach(a=>{if(/京东|淘宝/.test(a.textContent)){const copy=a.cloneNode(true);copy.className='home-secondary';purchases.append(copy)}});book.append(purchases);main.append(book);
 }

 const topBlock=el=>{while(el&&el.parentElement!==main)el=el.parentElement;return el};
 const titles=['为何学工作流','十一个书籍主案例','核心方法与平台导览','四篇十三章','关于作者','本书值得读的 8 个理由','图解全书框架','从课堂到客户现场，一本教材多种用法','资源与配套内容','开始之前，你可能想问','内容边界与编号体系','今天先做一个小任务'];
 const blocks=titles.map(title=>{const h=[...main.querySelectorAll('h2')].find(h=>h.textContent===title);if(title==='十一个书籍主案例'&&h)h.closest('section').id='home-cases';return h?topBlock(h):null});
 const order=[hero,aud,...blocks.slice(0,4),book,...blocks.slice(4)];for(const block of [...new Set(order.filter(Boolean))])main.append(block);
}

function improveLearning(){
 const route=location.pathname.replace(/\/$/,'')||'/',version=route.split('/')[1];
 const targets={reader:['/learn/reader/','读者作品与练习'],campus:['/learn/campus/','高校样课与实验'],enterprise:['/learn/enterprise/','部门试点样例'],fde:['/learn/fde-project/','FDE工程实训']};
 document.querySelectorAll('header nav[aria-label="主导航"] a,header nav[aria-label="移动端导航"] a').forEach(a=>{
 const href=a.getAttribute('href');
 if(!a.dataset.contextCase&&!a.dataset.contextResource){if(href==='/reader/cases')a.dataset.contextCase='1';else if(href==='/resources')a.dataset.contextResource='1'}
 if(!a.dataset.contextCase&&!a.dataset.contextResource)return;
 const t=targets[version],isCase=!!a.dataset.contextCase;
 const url=t?t[0]:(isCase?'/reader/cases':'/resources'),label=t?(isCase?t[1]:'本版学习资源'):(isCase?'案例':'资源');
 if(a.getAttribute('href')!==url)a.href=url;if(a.textContent!==label)a.textContent=label;
 });
 document.querySelectorAll('header a[href="/#toc"]').forEach(a=>a.href='/learn/book/');
 const root=document.querySelector('main')||document.querySelector('header')?.parentElement;
 if(!root)return;
 if(route==='/'&&root.dataset.homeGuide&&!root.dataset.homeSimplified){
  root.dataset.homeSimplified='1';
  const keep=[root.firstElementChild,root.querySelector('#audiences'),root.querySelector('#home-book')];
  const author=[...root.querySelectorAll('h2')].find(h=>h.textContent==='关于作者');let authorBlock=author;while(authorBlock&&authorBlock.parentElement!==root)authorBlock=authorBlock.parentElement;if(authorBlock)keep.push(authorBlock);
  [...root.children].forEach(el=>{if(!keep.includes(el)){el.hidden=true;el.style.display='none'}});
  const outcomes=document.createElement('section');outcomes.className='learning-home-section';outcomes.id='home-outcomes';outcomes.innerHTML='<div class="shell"><p class="label">成果预览</p><h2>先看能做出什么，再决定从哪里开始</h2><div class="learning-home-grid">'+[['会议纪要','行动项、负责人、期限与待确认事项','/learn/reader/'],['课堂作业','任务卡、实验流程与教师评分示例','/learn/campus/'],['岗位试点','回复草稿、人工审核与效果复盘表','/learn/enterprise/'],['工程交付','可运行API、测试记录与运行手册','/learn/fde-project/']].map(([h,p,u])=>'<a class="learning-home-card" href="'+u+'"><h3>'+h+'</h3><p>'+p+'</p><span>查看成果样例 →</span></a>').join('')+'</div></div>';
  const trial=document.createElement('section');trial.className='learning-home-section';trial.innerHTML='<div class="shell"><p class="label">免费体验</p><h2>用一份模拟素材，完成你的第一个成果</h2><p>看处理结果、找出错误、人工修订，下载属于你的流程卡与作品。</p><a class="home-primary" href="/learn/reader/">开始五分钟练习 →</a><a class="textlink" href="/learn/book/">查看完整目录与配套说明 →</a></div>';
  const coop=document.createElement('section');coop.className='learning-home-section';coop.innerHTML='<div class="shell"><h2>把学习带进课堂与业务</h2><div class="home-clean-actions"><a class="home-primary" href="/campus/apply">咨询高校教学</a><a class="home-primary" href="/enterprise/apply">咨询企业试点与工程实训</a></div></div>';
  const aud=root.querySelector('#audiences');aud.after(outcomes);outcomes.after(trial);root.append(root.querySelector('#home-book'));if(authorBlock)root.append(authorBlock);root.append(coop);
  const faq=document.createElement('section');faq.className='learning-home-section';faq.id='home-faq';faq.innerHTML='<div class="shell"><h2>开始前，先了解这三件事</h2>'+[
  ['四个版本，需要按顺序学吗？','不需要。个人自学选普通读者版，组织教学选高校版，团队业务试点选企业版，客户现场开发与交付选FDE版。它们共用本书知识主线，可以随时切换。'],
  ['网站里的内容都来自原书吗？','图书目录对应原书四篇十三章。在线练习、教学材料和FDE工程任务是配套扩展内容，模拟场景不代表真实客户成果。'],
  ['练习会调用AI，或上传我的资料吗？','普通读者公开练习使用预设教学样例，不调用模型；草稿仅保存在本浏览器。请使用模拟资料练习，并及时下载成果备份。']
  ].map(([q,a])=>'<details style="border-bottom:1px solid currentColor;padding:16px 0"><summary style="cursor:pointer;font-weight:600;line-height:1.7">'+q+'</summary><p style="max-width:780px;line-height:1.85;margin:12px 0">'+a+'</p></details>').join('')+'</div>';coop.before(faq);
  root.querySelectorAll('a[href="#toc"]').forEach(a=>a.href='/learn/book/');root.querySelector('.home-shortcuts')?.remove();
 }
 const key=route==='/'?'':route==='/reader'?'reader':route==='/campus'||route==='/campus/teaching-pack'?'campus':route==='/enterprise'?'enterprise':route==='/reader/quickstart'?'reader':route==='/fde'||route==='/fde/paths'?'fde':null;
 const oldEntry=root.querySelector('[data-learning-entry]');
 if(oldEntry&&oldEntry.dataset.learningVersion!==key)oldEntry.remove();
 if(key&&!root.querySelector('[data-learning-entry]')){
  const [url,title]=targets[key],box=document.createElement('section');box.dataset.learningEntry='1';box.dataset.learningVersion=key;box.className='learning-entry shell';
  box.innerHTML='<p class="label">'+({reader:'可体验 · 可下载',campus:'教师与学生入口 · 可下载完整样课',enterprise:'可阅读 · 可下载试点模板',fde:'可运行 · 可下载工程任务包'}[key])+'</p><h2>'+({reader:'从一个熟悉的任务开始，做出第一个 AI 工作流',campus:'先用一份完整样课，判断如何开课',enterprise:'先跑通一个部门任务，再安排培训',fde:'用企业资料问答，贯穿五阶段交付'}[key])+'</h2><p>'+({reader:'会议纪要、内容创作、个人资料问答：有素材、有结果、有核查与复盘。',campus:'课件、指导书、模拟数据、三类作业样例、评分示例与 AI 使用记录直接开放。',enterprise:'试点任务、角色、素材、岗位成果、审核与复盘口径集中展示。',fde:'工程交付指深入客户业务现场，完成开发、验证、上线演练与交接。'}[key])+'</p><a class="home-primary" href="'+url+'">'+title+' →</a>';
  let hero=root.querySelector('h1');while(hero&&hero.parentElement!==root)hero=hero.parentElement;hero?.after(box);
 }
 if(route==='/reader'){
  const h=root.querySelector('h1');if(h&&h.textContent!=='从一个熟悉的任务开始，做出自己的第一个 AI 工作流。')h.textContent='从一个熟悉的任务开始，做出自己的第一个 AI 工作流。';
  root.querySelectorAll('a[href="/reader/quickstart"]').forEach(a=>a.href='/learn/reader/');
 }
 if(route==='/enterprise'){
  const h=root.querySelector('h1');if(h&&h.textContent!=='让员工用好 AI，让岗位任务形成可复用流程。')h.textContent='让员工用好 AI，让岗位任务形成可复用流程。';
  root.querySelectorAll('a').forEach(a=>{if(a.textContent.includes('培训成果难衡量')&&a.getAttribute('href')!=='/learn/enterprise/#measurement')a.href='/learn/enterprise/#measurement'});
 }
 const copyMap=[['从 R-PATH-01 开始','从第一个工作流开始'],['工具槽位','任务工具参考'],['由运营配置','具体开放内容以页面说明为准']];
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement.closest('script,style,pre,code'))continue;let v=n.nodeValue;for(const [a,b]of copyMap)v=v.replace(a,b);if(v!==n.nodeValue)n.nodeValue=v}
}
function apply(){
 // Keep historical directory bookmarks working after the homepage simplification.
 if(location.pathname==='/'&&location.hash==='#toc'){location.replace('/learn/book/');return}
 document.querySelectorAll('a[href="/#toc"]').forEach(a=>a.setAttribute('href','/learn/book/'));
 if(location.pathname.replace(/\/$/,'')==='/resources'&&!document.querySelector('[data-open-resources]')){
  const main=document.querySelector('main')||document.querySelector('h1')?.parentElement?.parentElement;
  if(main){const box=document.createElement('section');box.dataset.openResources='1';box.className='shell section';box.innerHTML='<h2>已开放的配套学习材料</h2><p>以下是平台扩展练习与交付模板；原书代码、勘误及工具适配清单的状态另见本页资源清单。</p><div class="grid">'+[['普通读者练习','模拟素材、成果核查与作品下载','/learn/reader/'],['高校教学材料','样课、作业示例与评分参考','/learn/campus/'],['企业试点模板','岗位任务、人工审核与复盘','/learn/enterprise/'],['FDE 工程任务包','示例工程、测试与交接材料','/learn/fde-project/']].map(([h,t,u])=>'<a class="card" href="'+u+'"><h3>'+h+'</h3><p>'+t+'</p><span>查看材料 →</span></a>').join('')+'</div>';main.append(box)}
 }

 document.querySelectorAll('header a[href="/"]').forEach(a=>{const mark=a.firstElementChild;if(mark&&mark.textContent.trim()==='智'&&!mark.querySelector('img')){const img=document.createElement('img');img.src='/images/platform-robot-avatar-20261027.png';img.alt='';img.width=32;img.height=32;img.style.cssText='width:32px;height:32px;object-fit:cover;border-radius:8px;display:block';mark.textContent='';mark.style.cssText='width:32px;height:32px;background:transparent;flex-shrink:0';mark.append(img)}});
 document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]').forEach(icon=>{if(!icon.href.includes('/images/platform-robot-avatar-20261027.png')){icon.href='/images/platform-robot-avatar-20261027.png';icon.type='image/png';icon.removeAttribute('sizes')}});

 const publicLanding=['/','/reader','/campus','/enterprise'].includes(location.pathname.replace(/\/$/,'')||'/');
 if(publicLanding){document.body.dataset.layoutPolish='1'}else{delete document.body.dataset.layoutPolish}
 if(!document.getElementById('layout-polish-css')){const link=document.createElement('link');link.id='layout-polish-css';link.rel='stylesheet';link.href='/fde-assets/layout.css?v=20261013-22';document.head.append(link)}
 if(!style.isConnected)document.head.append(style);
 document.querySelectorAll('header [aria-label="版本切换"]:not([data-stable-versions])').forEach(group=>{
  group.setAttribute('data-original-versions','');
  let nav=group.parentElement.querySelector('[data-stable-versions]');
  if(!nav){nav=document.createElement('nav');nav.dataset.stableVersions='1';nav.setAttribute('aria-label','版本切换');
   for(const [slug,name] of [['reader','普通读者版'],['campus','高校版'],['enterprise','企业版'],['fde','FDE版']]){const a=document.createElement('a');a.href='/'+slug;a.textContent=name;a.dataset.version=slug;a.addEventListener('click',event=>{if(window.__yqDirty&&!window.confirm('当前页面有未保存的内容，确定要离开吗？'))event.preventDefault()});nav.append(a)}
   group.after(nav);
  }
  const current=location.pathname.split('/')[1];for(const a of nav.children){if(a.dataset.version===current){if(a.getAttribute('aria-current')!=='page')a.setAttribute('aria-current','page')}else a.removeAttribute('aria-current')}
 });
 const section=document.querySelector('#audiences');if(section&&!section.querySelector('[data-fde-card]')){const base=section.querySelector('a[href="/enterprise"]');if(base){const a=base.cloneNode(true);a.href='/fde';a.dataset.fdeCard='1';a.innerHTML='<p class="text-sm font-semibold text-accent-strong">FDE版</p><h3 class="mt-2 text-xl font-bold text-ink-900">从客户问题到生产交付</h3><p class="mt-3 text-sm leading-6 text-ink-600">沿书中四篇十三章，练习业务诊断、系统接入、评测上线与项目交接。</p><ul class="mt-4 flex-1 space-y-2 border-t border-ink-100 pt-4"><li>五阶段交付路线</li><li>三类行业实训</li><li>项目任务书与验收清单</li></ul><p class="mt-5 text-sm font-semibold text-accent-strong">进入 FDE版 →</p>';base.parentElement.dataset.fdeGrid='1';base.after(a)}}
 document.querySelectorAll('main a[href="/enterprise"]').forEach(base=>{if(!base.textContent.includes('让企业 AI 能力，完成跃迁')||base.parentElement.querySelector('[data-fde-cta]'))return;const a=base.cloneNode(true);a.href='/fde';a.dataset.fdeCta='1';const ps=a.querySelectorAll('p');if(ps[0])ps[0].textContent='FDE版';if(ps[1])ps[1].textContent='把书中方法带到客户现场';base.parentElement.dataset.fdeGrid='1';base.after(a)});
 document.querySelectorAll('footer a[href="/enterprise"]').forEach(base=>{if(base.parentElement.parentElement.querySelector('[data-fde-footer]'))return;const a=base.cloneNode(true);a.href='/fde';a.textContent='FDE版';a.dataset.fdeFooter='1';if(base.parentElement.tagName==='LI'){const li=document.createElement('li');li.append(a);base.parentElement.after(li)}else base.after(a)});
 document.querySelectorAll('a[href="/book/chapters/B04"]').forEach(a=>{if(a.textContent.includes('FDE 人才培训'))a.href='/fde'});
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement.closest('script,style'))continue;let v=n.nodeValue;for(const [before,after]of replacements)v=v.replace(before,after);if(v!==n.nodeValue)n.nodeValue=v;}
 document.querySelectorAll('button').forEach(button=>{if(!button.textContent.includes('四个版本有什么区别？'))return;const box=button.parentElement;const answer=[...box.children].find(el=>el!==button&&!el.hasAttribute('data-fde-answer'));let p=box.querySelector('[data-fde-answer]');if(answer&&!p){p=document.createElement('p');p.dataset.fdeAnswer='1';p.className='px-5 pb-4 text-sm text-ink-600';p.textContent='FDE版面向客户交付，结合本书练习需求诊断、系统集成、评测上线与验收交接。';box.append(p)}if(p){const hidden=button.getAttribute('aria-expanded')!=='true';if(p.hidden!==hidden)p.hidden=hidden;}});
 const reading=document.querySelector('[aria-label="按人群推荐阅读"]');if(reading&&!document.querySelector('[data-fde-reading]')){const a=document.createElement('a');a.href='/fde/paths';a.textContent='FDE 交付路线 ↗';a.className=reading.lastElementChild?.className||'';a.style.display='inline-flex';reading.append(a);const p=document.createElement('p');p.dataset.fdeReading='1';p.innerHTML='<strong>FDE 阅读与实践：</strong>第1—3章诊断业务，第4—6章设计与评测，第7—10章系统接入，第11—13章行业交付。<a href="/fde/paths">查看五阶段任务与验收要求 →</a>';reading.after(p);}
 optimizeHome();
 improveLearning();
}
let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(refresh)});
function refresh(){pending=false;observer.disconnect();try{if(hydrationComplete())apply()}finally{observer.observe(document.documentElement,{childList:true,subtree:true})}}
window.addEventListener('popstate',()=>requestAnimationFrame(refresh));
// Enhancement must wait for React hydration, not a fixed elapsed delay.
// Fail closed if a future React build no longer exposes the inspected host fiber.
function hydrationComplete(){
 const host=[...document.querySelectorAll('header,main,button,h1')].find(e=>Object.keys(e).some(k=>k.startsWith('__reactFiber$')));
 if(!host)return false;
 let fiber=host[Object.keys(host).find(k=>k.startsWith('__reactFiber$'))];
 while(fiber?.return)fiber=fiber.return;
 const root=fiber?.stateNode?.current;
 if(!root||root.memoizedState?.isDehydrated)return false;
 const pending=[root];while(pending.length){const f=pending.pop();if(f.tag===13&&f.memoizedState?.dehydrated)return false;if(f.child)pending.push(f.child);if(f.sibling)pending.push(f.sibling)}
 return true;
}
function start(){
 if(hydrationComplete()){refresh();return}
 if(document.readyState!=='complete'){window.addEventListener('load',start,{once:true});return}
 const began=Date.now();const timer=setInterval(()=>{if(hydrationComplete()){clearInterval(timer);refresh()}else if(Date.now()-began>30000){clearInterval(timer);console.warn('AgentFlow enhancement skipped: hydration not ready')}},100);
}
window.addEventListener('hashchange',()=>{if(location.pathname==='/'&&location.hash==='#toc')location.replace('/learn/book/')});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,250),{once:true});else setTimeout(start,250);
})();
