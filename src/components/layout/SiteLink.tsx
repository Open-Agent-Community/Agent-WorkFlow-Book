import NextLink from 'next/link';
import type {ComponentProps} from 'react';
/** Static learning workspaces remain document navigations; app routes share Next routing. */
export default function SiteLink(props:ComponentProps<typeof NextLink>){
 const {href,prefetch,replace,scroll,shallow,locale,onNavigate,...rest}=props;
 if(typeof href==='string'&&(href.startsWith('/learn/')||href.startsWith('/fde-assets/')))return <a {...rest} href={href}/>;
 return <NextLink {...rest} href={href} prefetch={false} replace={replace} scroll={scroll} shallow={shallow} locale={locale} onNavigate={onNavigate}/>;
}
