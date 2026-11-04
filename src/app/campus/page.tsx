import { pageSeo } from '@/lib/seo';
import { EditionLanding } from '@/components/EditionLanding';
import { CORE_ROUTES } from '@/content/delivery';
export const metadata = pageSeo('/campus', {title:CORE_ROUTES.campus.name+'｜智能体工作流设计',description:CORE_ROUTES.campus.intro});
export default function Page(){return <EditionLanding edition="campus"/>}
