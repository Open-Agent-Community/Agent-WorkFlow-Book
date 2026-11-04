import { pageSeo } from '@/lib/seo';
import { EditionLanding } from '@/components/EditionLanding';
import { CORE_ROUTES } from '@/content/delivery';
export const metadata = pageSeo('/reader', {title:CORE_ROUTES.reader.name+'｜智能体工作流设计',description:CORE_ROUTES.reader.intro});
export default function Page(){return <EditionLanding edition="reader"/>}
