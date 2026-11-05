import { pageSeo } from "@/lib/seo";
import {FdePage} from "@/components/fde/FdePage";
import pages from "@/content/fde/pages.json";
export const metadata=pageSeo("/fde/kit", {title:pages.kit.title,description:pages.kit.meta,alternates:{canonical:"/fde/kit"}});
export default function Page(){return <FdePage slug="kit"/>}
