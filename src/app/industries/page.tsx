import {pageSeo} from '@/lib/seo';
import {SeoBreadcrumbs} from '@/components/SeoBreadcrumbs';
import {LegacyPolicyLocation} from '@/components/LegacyPolicyLocation';
import {PolicySourceNavigation} from '@/components/PolicySourceNavigation';
import {IndustryExplorer} from '@/components/IndustryExplorer';
import {INDUSTRY_ATLAS} from '@/content/platform-modules';
export const metadata=pageSeo('/industries',{title:'AI产业链与行业案例｜教育、客服、制造及企业服务',description:'参考AI产业链分层，从AIGC、客服、电商零售、办公企业服务、制造运营和教育6个应用标签，查找本书11个教学案例及原书章节。AI政策另设独立入口。'});
export default function Industries(){return <main id="main" className="catalog-page industry-page"><LegacyPolicyLocation/><PolicySourceNavigation/><SeoBreadcrumbs items={[{name:'行业案例',href:'/industries'}]}/>
 <div className="industry-intro"><div className="shell"><a className="industry-breadcrumb" href="/">首页 / 行业案例</a><p className="label">INDUSTRY APPLICATIONS</p><h1>从AI产业链，找到具体工作流</h1><p className="industry-lead">{INDUSTRY_ATLAS.intro}</p><p className="industry-source-note">案例为原书关联的教学扩展场景，非客户交付或商业成果。</p></div></div>
 <div className="industry-nav-wrap"><nav className="shell industry-tabs" aria-label="本页导航"><a href="#industry-cases">应用案例</a><a href="#industry-chain">产业链位置</a><a href="#industry-upcoming">拓展方向</a><a href="/policies">AI政策 →</a></nav></div>
 <IndustryExplorer/>
 <details id="industry-chain" className="shell industry-chain industry-chain-disclosure" data-fragment-details><summary><span className="label">02 / 产业链背景</span><span>了解本书在AI产业链中的位置</span><span aria-hidden="true">展开 ↓</span></summary><div className="industry-chain-body"><h2>{INDUSTRY_ATLAS.title}</h2><ol className="industry-chain-layers">{INDUSTRY_ATLAS.layers.map((layer,i)=><li key={layer.id} data-layer={layer.id}><span className="label">L{ i+1 } / {layer.scope}</span><h3>{layer.name}</h3><p>{layer.description}</p></li>)}</ol><p className="industry-chain-coverage">{INDUSTRY_ATLAS.coverage}</p><details className="industry-classification-source"><summary>分类参考与适用范围</summary><p>{INDUSTRY_ATLAS.note}</p><p><a href={INDUSTRY_ATLAS.source.url} target="_blank" rel="noopener noreferrer">{INDUSTRY_ATLAS.source.name} ↗</a> · <a href={INDUSTRY_ATLAS.source.applications} target="_blank" rel="noopener noreferrer">应用层行业标签 ↗</a></p><p>查阅日期：{INDUSTRY_ATLAS.source.checkedAt}</p></details></div></details>
 <section id="industry-upcoming" className="shell industry-upcoming"><p className="label">03 / 持续整理</p><h2>{INDUSTRY_ATLAS.upcomingTitle}</h2><p>{INDUSTRY_ATLAS.upcomingNote}</p><ul>{INDUSTRY_ATLAS.upcoming.map(name=><li key={name}>{name}<span>待补充</span></li>)}</ul></section>
 <section className="learning-home-section"><div className="shell policy-next"><div><p className="label">独立模块 / AI政策</p><h2>查阅政策来源与延伸阅读</h2><p>按官方文件查看条款摘要和本站阅读建议。政策信息仅供读者参考，不构成本书内容。</p></div><a className="home-primary" href="/policies">查看AI政策 →</a></div></section>
 </main>}
