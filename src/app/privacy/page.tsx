import {pageSeo} from '@/lib/seo';
import {PageHero,Section,Card} from '@/components/ui/primitives';
import {PUBLIC_SITE_POLICY} from '@/content/platform-policies';
const content=PUBLIC_SITE_POLICY.privacy;
export const metadata=pageSeo('/privacy',{title:'隐私说明',description:content.intro});
export default function PolicyPage(){return <main id="main" className="policy-page"><PageHero compact eyebrow="平台说明" title="隐私说明" description={content.intro}/><Section title="当前公开功能说明"><p className="policy-updated">更新于 <time dateTime={PUBLIC_SITE_POLICY.updatedAt}>{PUBLIC_SITE_POLICY.updatedAt}</time></p><ol className="grid gap-5 md:grid-cols-2">{content.items.map((item,i)=><li key={item.title}><Card className="h-full"><h3 className="text-base font-semibold"><span className="label">{String(i+1).padStart(2,'0')} / </span>{item.title}</h3><p className="mt-3 text-sm leading-7">{item.body}</p></Card></li>)}</ol><p className="mt-8 text-sm leading-7">{content.note}</p></Section></main>}
