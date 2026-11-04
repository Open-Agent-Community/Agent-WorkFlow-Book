import {permanentRedirect,notFound} from 'next/navigation';
import {AUDIENCES,isAudience} from '@/lib/audience';
export function generateStaticParams(){return AUDIENCES.map(audience=>({audience}));}
export default async function CaseDirectory({params}:{params:Promise<{audience:string}>}){
 const {audience}=await params;if(!isAudience(audience))notFound();
 permanentRedirect('/resources?audience='+audience+'#cases');
}
