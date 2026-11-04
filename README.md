# Agent Workflow

《智能体工作流设计：方法与实践》配套学习平台，现同步至 [Open Agent Community](https://github.com/Open-Agent-Community)。提供从工作流方法学习、交互演示到工程交付实践的公开内容。

**在线体验：[agentflow.moyingsmart.cn](https://agentflow.moyingsmart.cn/)**

## 内容

- 图书介绍与 B01–B13 章节导读。
- 普通读者、高校、企业与 FDE 四类学习入口。
- 工作流拆解、结构化提示词、教学包预览与企业诊断等演示。
- FDE 学习路径、行业案例、工程实训与交付材料。
- 公开资源、行业政策导航及证书核验演示。

本项目是学习平台及参考实现。章节导读不等于完整课程；模拟实验不等于真实模型执行。当前不包含真实账号、支付、数据库或通用 Agent 运行时。筹备中的内容以页面状态标注为准。

## 本地运行

使用 Node.js 20 或更高版本，以及 pnpm。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://localhost:3000`。

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

请先停止开发服务器再构建；构建与开发共用 `.next` 目录。

## 项目结构

```text
src/app/           Next.js 路由
src/components/    页面与交互组件
src/content/       内容数据与 FDE 页面内容
src/lib/           版本、工具与 SEO 配置
public/images/     站点公开图片
public/fde-assets/  公开实践材料与下载包
public/learn/      静态学习工作区
```

内容修改优先维护 `src/content/`；静态工作区在 `public/learn/` 中独立维护。演示数据、正式功能与规划内容需明确区分，不添加未经验证的效果或用户量数字。

## 部署

项目使用 Next.js standalone 输出。构建后将 `.next/standalone`、`.next/static` 与 `public` 一并部署；启动前清理从旧版本复制的路由缓存。仓库不包含生产服务器地址、SSH 凭据或部署账户。

站点中的 canonical URL、sitemap、商务入口及品牌素材延续现有线上项目。自行部署时请检查 `src/lib/seo.ts`、`src/app/robots.ts` 和内容配置，并替换为自己的站点信息。

## 参与贡献

欢迎通过 Issue 提交问题、内容勘误和建议，通过 Pull Request 改进代码与文档。请提供复现步骤；涉及交互或视觉修改时附上验证说明。不要提交密钥、个人数据、依赖目录及构建产物。

## 内容与许可

本次同步公开项目源码及现有站点素材，尚未统一授予开源许可证。图书、封面、照片、二维码、第三方标识及引用资料的权利归各自权利人所有；公开可访问不代表可任意转载或商业使用。具体授权范围待维护者确认。
