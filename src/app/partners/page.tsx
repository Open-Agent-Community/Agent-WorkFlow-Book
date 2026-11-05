import {pageSeo} from '@/lib/seo';
import {PageHero} from '@/components/ui/primitives';
import {DetailNavigation} from '@/components/DetailNavigation';
import {SeoBreadcrumbs} from '@/components/SeoBreadcrumbs';
import {PARTNER_MODULE} from '@/content/platform-modules';
import {BOOK_PRESENCE,presenceImage} from '@/content/book-presence';
export const metadata=pageSeo('/partners',{title:'合作伙伴｜图书出版、推荐与读书分享',description:PARTNER_MODULE.description});
const evidence:Record<string,{href:string;label:string}>={
 '机械工业出版社':{href:'/#home-book',label:'查看图书与购书渠道'},
 '刘润读书会':{href:presenceImage(BOOK_PRESENCE.readingClub.poster),label:'查看新书分享海报'},
 '极客邦科技':{href:presenceImage('geekbang-1024-ai-community'),label:'查看图书推荐资料'},
 'Datawhale':{href:presenceImage('geekbang-1024-ai-community'),label:'查看联合推荐资料'},
};
export default function Partners(){return <main id="main" className="catalog-page partners-page"><SeoBreadcrumbs items={[{name:'合作伙伴',href:'/partners'}]}/><PageHero compact eyebrow="合作伙伴" title="让一本书，走近更多读者" description={PARTNER_MODULE.description}/><DetailNavigation links={[{href:'/#book-partners',label:'首页出版与推广'},{href:'/resources',label:'配套资源'},{href:'#contact',label:'合作与团购咨询'}]}/><section className="learning-home-section"><div className="shell"><p className="module-note">{PARTNER_MODULE.note}</p><div className="partner-detail-grid">{BOOK_PRESENCE.partners.map(partner=><article key={partner.name}><p className="label">{partner.role}</p><h2>{partner.name}</h2><p>{partner.detail}</p><a className="textlink" href={evidence[partner.name].href}>{evidence[partner.name].label} →</a></article>)}</div></div></section></main>}
