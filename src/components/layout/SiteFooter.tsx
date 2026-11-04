import { BOOK } from "@/content/book";
import { FOOTER_LINK_GROUPS } from "@/content/site";
import { WecomContact } from "@/components/layout/WecomContact";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-ink-800 bg-ink-950 text-ink-200">
      <div className="footer-navigation mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="footer-about">
          <div className="footer-platform-brand"><img src="/images/platform-robot-avatar-20261027.webp" alt="" width="44" height="44" loading="lazy"/><p className="text-base font-bold text-white">智能体工作流设计</p></div>
          <p className="mt-3 text-sm leading-6">从理解 AI，到完成一个可用的智能体工作流。以《{BOOK.title}》四篇十三章为共享知识主线的交互式学习平台。</p>
        </div>
        {FOOTER_LINK_GROUPS.map(group => {
          const links = <ul className="footer-links">{group.links.map(link => <li key={link.href}><a href={link.href} {...(link.href.startsWith("https:") ? {target:"_blank",rel:"noopener noreferrer"} : {})}>{link.label}</a></li>)}</ul>;
          return <nav className="footer-link-group" key={group.title} aria-label={group.title}>
            <div className="footer-desktop-links"><p className="footer-group-title">{group.title}</p>{links}</div>
            <details className="footer-mobile-links"><summary>{group.title}<span aria-hidden="true">+</span></summary>{links}</details>
          </nav>;
        })}
      </div>
      <div id="contact" className="footer-contact-band mx-auto w-full max-w-6xl px-4 sm:px-6"><WecomContact dark /></div>
    </footer>
  );
}
