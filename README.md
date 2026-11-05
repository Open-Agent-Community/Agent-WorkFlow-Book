<div align="center">

# Agent-WorkFlow-Book

### 《智能体工作流设计：方法与实践》配套学习平台

面向读者、高校、企业与 FDE 实践者，连接智能体工作流的方法学习、交互演示与工程交付。

[在线学习](https://agentflow.moyingsmart.cn/) · [章节导读](https://agentflow.moyingsmart.cn/learn/book) · [FDE 学习路径](https://agentflow.moyingsmart.cn/fde/paths) · [问题反馈](https://github.com/Open-Agent-Community/Agent-WorkFlow-Book/issues)

</div>

---

## 项目简介

**Agent-WorkFlow-Book** 是《智能体工作流设计：方法与实践》的配套学习平台源代码仓库，由 [Open Agent Community](https://github.com/Open-Agent-Community) 组织维护。

项目围绕“理解方法、拆解任务、设计流程、验证结果、完成交付”组织内容，将图书章节导读、工作流交互演示、场景案例与 FDE（Forward Deployed Engineer）工程实践连接起来，为不同学习场景提供统一的公开入口。

本仓库提供学习平台的参考实现与配套公开资源。在线内容及开放状态以[正式站点](https://agentflow.moyingsmart.cn/)为准。

## 学习入口

| 面向人群   | 学习重点                                     | 在线入口                                              |
| ---------- | -------------------------------------------- | ----------------------------------------------------- |
| 普通读者   | 理解工作流方法，从首个流程练习开始           | [读者版](https://agentflow.moyingsmart.cn/reader)     |
| 高校师生   | 结合教学大纲、教学包与案例开展课程实践       | [高校版](https://agentflow.moyingsmart.cn/campus)     |
| 企业团队   | 梳理业务场景、理解方案边界与实施路径         | [企业版](https://agentflow.moyingsmart.cn/enterprise) |
| FDE 实践者 | 围绕需求、方案、实现、验证与交接完成工程实践 | [FDE 版](https://agentflow.moyingsmart.cn/fde)        |

## 内容与功能

- **图书与章节导读**：图书介绍、四篇十三章（B01–B13）目录与章节学习指引。
- **工作流交互演示**：流程拆解、结构化提示词、五分钟首练等公开练习。
- **教学与场景资源**：教学包预览、企业诊断演示、行业案例与学习路径。
- **FDE 工程实践**：需求分析、方案取舍、最小闭环、评估验证与交付材料。
- **配套资源导航**：公开下载材料、行业政策信息及证书核验演示。

章节导读、模拟实验、筹备内容与正式服务在页面中分别标注。模拟实验用于学习与设计验证，不代表真实模型执行或业务运行；证书核验中的演示记录不构成实际认证。图书购买与平台课程权益分别管理。

## 技术架构

| 技术                    | 用途                           |
| ----------------------- | ------------------------------ |
| Next.js 15 / App Router | 页面路由、静态生成与服务端渲染 |
| React 19                | 页面组件与交互体验             |
| TypeScript              | 类型约束与代码维护             |
| Tailwind CSS 4          | 样式与主题系统                 |
| 静态 HTML / JavaScript  | 独立学习工作区与配套实践资源   |

当前实现不包含真实用户账户、在线支付、业务数据库或通用 Agent 运行时。

## 快速开始

### 环境准备

- Node.js 20 或更高版本。
- pnpm 包管理器。

### 获取源码并启动

```bash
git clone https://github.com/Open-Agent-Community/Agent-WorkFlow-Book.git
cd Agent-WorkFlow-Book
pnpm install --frozen-lockfile
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。

### 类型检查与生产运行

停止开发服务器后执行：

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

开发与生产构建共用 `.next` 目录，请勿同时运行 `pnpm dev` 和 `pnpm build`。

## 目录结构

```text
.
├── src/
│   ├── app/             页面路由、站点元数据与全局样式
│   ├── components/      布局、界面与交互组件
│   ├── content/         章节、案例、学习路径与 FDE 内容
│   └── lib/             版本规则、工具函数与 SEO 配置
├── public/
│   ├── images/          站点图片与视觉素材
│   ├── fde-assets/      实践材料、脚本与下载资源
│   └── learn/           静态学习工作区
├── next.config.ts       Next.js 配置
├── pnpm-lock.yaml       依赖版本锁定
└── SYNC.md              初次源码同步范围说明
```

内容更新优先维护 `src/content/`；静态学习工作区在 `public/learn/` 中独立维护。新增内容应注明来源，明确开放状态与适用范围。

## 部署说明

项目配置为 Next.js `standalone` 输出。部署时需同时提供 `.next/standalone`、`.next/static` 和 `public` 中的内容，并按目标环境配置启动服务与反向代理。

自行部署时，请检查并调整以下配置：

- `src/lib/seo.ts`、`src/app/robots.ts` 与 sitemap 中的站点地址。
- `src/content/` 中的品牌信息、商务入口及外部链接。
- `public/` 中的图片、二维码和第三方素材使用范围。

新版本应使用独立构建产物，避免沿用旧版本的页面缓存。生产环境凭据、服务器配置和账户信息不纳入仓库。

## 参与贡献

欢迎提交内容勘误、问题复现、教程改进和代码优化。

1. 在 [Issues](https://github.com/Open-Agent-Community/Agent-WorkFlow-Book/issues) 中搜索已有问题，或创建新问题说明背景、复现步骤与预期结果。
2. Fork 本仓库，在独立分支中完成修改。
3. 代码修改请执行类型检查和生产构建；交互或视觉修改请附上相应验证说明。
4. 提交 Pull Request，说明修改目的、影响范围与验证结果。

请勿提交密钥、个人数据、未经授权的资料、依赖目录或构建缓存。公开内容应清楚区分模拟演示、已实现功能和后续规划，不使用未经验证的效果或规模数据。

## 版权与许可

本仓库当前尚未声明统一的开源许可证。源码公开不等同于授予任意使用、修改、分发或商业授权；具体授权范围以维护者后续发布的许可证及相关声明为准。

图书正文、封面、照片、二维码、第三方标识及引用资料的权利归各自权利人所有，不因本仓库公开而改变。涉及转载、再分发或商业使用，请先确认相应授权。

---

由 [Open Agent Community](https://github.com/Open-Agent-Community) 维护 · [在线平台](https://agentflow.moyingsmart.cn/) · [GitHub 仓库](https://github.com/Open-Agent-Community/Agent-WorkFlow-Book)
