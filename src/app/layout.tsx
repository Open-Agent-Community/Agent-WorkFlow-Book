import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./colorful.css";
import "./policy-versions.css";
import "./delivery.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE } from "@/content/site";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050a14" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  icons: { icon: "/images/platform-robot-avatar-20261027.png", apple: "/images/platform-robot-avatar-20261027.png" },
  metadataBase: new URL("https://agentflow.moyingsmart.cn"),
  title: {
    default: SITE.name,
    template: "%s | 智能体工作流设计",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE.name,
    title: `《智能体工作流设计：方法与实践》官方站点`,
    description: SITE.description,
    images: [{ url: "/images/book-3d-20261027.webp", width: 1200, height: 1200, alt: "智能体工作流设计：方法与实践" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/book-3d-20261027.webp"],
  },
};

/** 在首次渲染前应用主题偏好，避免闪烁（FOUC） */
const themeScript = `(function(){try{var t=localStorage.getItem('yq-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" data-editorial="1" data-colorful="1" data-layout-refined="1">
      <head><link rel="stylesheet" href="/fde-assets/native-base.css?v=36"/><link rel="stylesheet" href="/fde-assets/layout.css?v=36"/><link rel="stylesheet" href="/fde-assets/editorial.css?v=20261029-1"/></head>
      <body>
        
        <a className="skip-to-content" href="#main">跳到主要内容</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
