import { pageSeo } from '@/lib/seo';
import { EditionLanding } from '@/components/EditionLanding';
import { CORE_ROUTES } from '@/content/delivery';
export const metadata = pageSeo('/enterprise', {title:CORE_ROUTES.enterprise.name+'｜智能体工作流设计',description:CORE_ROUTES.enterprise.intro});
export default function Page(){return <EditionLanding edition="enterprise"/>}
