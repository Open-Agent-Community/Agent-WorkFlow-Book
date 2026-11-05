import { pageSeo } from "@/lib/seo";
import {FdePage} from "@/components/fde/FdePage";
import pages from "@/content/fde/pages.json";
export const metadata=pageSeo("/fde/cases", {title:pages.cases.title,description:pages.cases.meta,alternates:{canonical:"/fde/cases"}});
export default function Page(){return <FdePage slug="cases"/>}
