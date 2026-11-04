import { cx } from "@/lib/utils";
import { CONTACT, GROUP_BUY } from "@/content/site";

/** 共享商务联系区，二维码保留原始图片以便扫码与保存。 */
export function WecomContact({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cx("contact-options", className)}>
    <div className={cx("wecom-contact", dark && "wecom-contact-dark")}>
      <a className="wecom-code-link" href={CONTACT.qr} target="_blank" rel="noopener noreferrer" aria-label="打开企业微信二维码原图，可长按保存（新窗口）">
        <img src={CONTACT.qr} alt="商务合作企业微信二维码" loading="lazy" width={256} height={260} className="wecom-qr" />
        <span className="wecom-code-caption">扫码添加企业微信<span>点击查看原图 · 长按保存 ↗</span></span>
      </a>
      <div className="wecom-copy">
        <p className="wecom-title">{CONTACT.title}</p>
        <p className="wecom-description">{CONTACT.description}</p>
        <a className="wecom-email" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("智能体工作流设计｜商务合作")}`}>邮件联系 ↗<span>{CONTACT.email}</span></a>
      </div>
    </div>
    <div className={cx("wecom-contact group-buy-contact", dark && "wecom-contact-dark")}>
      <a className="wecom-code-link" href={GROUP_BUY.qr} target="_blank" rel="noopener noreferrer" aria-label="打开图书团购咨询二维码，可长按保存（新窗口）">
        <img src={GROUP_BUY.qr} alt="图书团购咨询二维码，对接机械工业出版社" loading="lazy" width={278} height={278} className="wecom-qr group-buy-qr" />
        <span className="wecom-code-caption">{GROUP_BUY.caption}<span>点击放大 · 长按保存 ↗</span></span>
      </a>
      <div className="wecom-copy">
        <p className="wecom-title">{GROUP_BUY.title}</p>
        <p className="wecom-description">{GROUP_BUY.description}</p>
        <p className="wecom-remark">添加时请备注：<strong>{GROUP_BUY.remark}</strong></p>
        <a className="wecom-email" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(GROUP_BUY.subject)}`}>邮件咨询团购 ↗</a>
      </div>
    </div>
    </div>
  );
}
