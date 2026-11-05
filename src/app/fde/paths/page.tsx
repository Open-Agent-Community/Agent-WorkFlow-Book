import { pageSeo } from "@/lib/seo";
import {FdePage} from "@/components/fde/FdePage";
import pages from "@/content/fde/pages.json";
export const metadata=pageSeo("/fde/paths", {title:pages.paths.title,description:pages.paths.meta,alternates:{canonical:"/fde/paths"}});
export default function Page(){return <FdePage slug="paths"/>}
