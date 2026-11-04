import {AUTHOR_ACCOUNTS} from '@/content/author-accounts';

export function AuthorAccounts() {
  return <section id="author-accounts" className="learning-home-section author-accounts" aria-labelledby="author-accounts-title"><div className="shell">
    <div className="presence-heading"><div><p className="label">KEEP IN TOUCH / 关注作者</p><h2 id="author-accounts-title">关注两位作者</h2></div><p>继续阅读AI、云计算与工作流实践。</p></div>
    <div className="author-accounts-grid">{AUTHOR_ACCOUNTS.map((account,index)=><article className="author-account" key={account.name}>
      <div className="author-account-copy"><p className="author-account-eyebrow">作者公众号 / {String(index+1).padStart(2,'0')}</p><h3>{account.name}</h3><p>{account.description}</p><ul className="author-account-topics" aria-label="关注方向">{account.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></div>
      <figure className="author-account-code"><a href={account.original} target="_blank" rel="noopener noreferrer" aria-label={`查看${account.name}公众号二维码原图`}><img src={account.qr} alt={`${account.name}微信公众号二维码`} width={account.width} height={account.height} loading="lazy" decoding="async"/></a><figcaption><strong>微信扫码关注</strong><span>手机可打开原图，长按识别</span></figcaption><a className="author-account-original" href={account.original} target="_blank" rel="noopener noreferrer">打开二维码原图 ↗</a></figure>
    </article>)}</div>
  </div></section>;
}
