import { pageSeo } from '@/lib/seo';
import { EditionLanding } from '@/components/EditionLanding';
import { CORE_ROUTES } from '@/content/delivery';
export const metadata = pageSeo('/fde', {title:CORE_ROUTES.fde.name+'｜智能体工作流设计',description:CORE_ROUTES.fde.intro});
export default function Page(){return <EditionLanding edition="fde"/>}
