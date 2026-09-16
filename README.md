# AI Coding Learning Lab

一个面向儿童、家长与非技术教育者的开源 AI Coding 学习与作品展示平台。

项目通过无需复杂安装的静态网页、分级学习内容、互动练习和作品展示模板，帮助初学者完成从理解 AI、表达想法，到制作并展示浏览器作品的学习过程。网站可以直接部署到 GitHub Pages，适合家庭、课堂和小型学习活动使用。

> 本项目不是 OpenAI 官方项目，也不提供 OpenAI 产品认证。AI 工具用于辅助规划、编码、检查和维护，教育者与作品作者仍负责目标、内容和最终判断。

## 在线访问

- 项目主页：https://chrisqiao2024.github.io/ai-coding-camp-web/
- AI Coding 互动作品馆：https://chrisqiao2024.github.io/ai-coding-camp-web/gallery/
- 30 天雅思词汇训练：https://chrisqiao2024.github.io/ai-coding-camp-web/ielts-vocab-30d/
- MARCUS 作品主页：https://chrisqiao2024.github.io/ai-coding-camp-web/students/marcus/

## 项目解决什么问题

许多儿童、家长和非技术教育者想尝试 AI Coding，但会遇到环境配置复杂、任务过大、作品难以展示，以及学生只复制 AI 输出而缺少复盘等问题。本项目提供一个低门槛入口：

1. 用孩子能理解的方式解释 AI 与提示词；
2. 把想法拆成场景、规则、页面、状态和反馈；
3. 生成可以直接打开、测试和修改的网页作品；
4. 用作品说明、测试记录和改进过程保留学习证据；
5. 在公开展示时明确隐私、版权和人工审核边界。

## 当前内容

- **AI Coding 分级入口**：初级、中级、高级三个学习阶段；
- **互动作品馆**：教师演示、互动视觉实验、学习工具与学员作品；
- **学生作品展示**：提供作品入口、创作过程与权属说明；
- **专项学习工具**：浏览器本地运行的 30 天雅思词汇训练；
- **活动原型**：用于教学和论坛筹备的静态页面原型。

当前版本为纯静态网站，不需要后端、数据库或安装依赖。学习进度如有保存，默认仅保存在使用者自己的浏览器中。

## 快速开始

### 本地查看

克隆仓库后，直接用浏览器打开根目录的 `index.html`。部分浏览器功能在本地文件模式下可能受限，建议使用任意静态文件服务器进行完整测试。

### 部署到 GitHub Pages

1. Fork 或复制本仓库；
2. 在仓库设置中打开 **Pages**；
3. 选择从 `main` 分支的根目录发布；
4. 等待 GitHub Pages 完成部署。

## 目录说明

| 路径 | 内容 |
| --- | --- |
| `/` | 项目主页与分级学习入口 |
| `AI_Coding_Camp_Beginner_8_12/` | 初级学习入口 |
| `AI_Coding_Camp_Web_V1_1/` | 中级学习入口 |
| `AI_Coding_Camp_Advanced_15_20/` | 高级学习入口 |
| `gallery/` | 互动作品馆 |
| `teacher-demos/` | 教师演示案例 |
| `student-cases/` | 学员作品案例，适用独立权属说明 |
| `students/` | 学员个人展示页，适用独立权属说明 |
| `ielts-vocab-30d/` | 30 天雅思词汇训练工具 |
| `lingnan-forum/` | 独立的论坛筹备原型 |

## 开源范围与版权边界

本仓库包含开源程序代码、原创课程文字、学生作品和第三方依赖，不能把“公开可访问”理解为所有内容均可自由复制。

- 通用 HTML、CSS、JavaScript 实现和可复用页面模板，在 [MIT License](LICENSE) 约束下开放；
- 课程体系、课程文字、书稿衍生内容、品牌名称和图片不因代码开源而自动授权；
- `student-cases/` 与 `students/` 中标注作者的作品，版权及相关权益归对应学生作者所有；
- 第三方库、问卷和外部资源适用其各自条款；
- 详细边界见 [NOTICE.md](NOTICE.md)。

如需复用但无法判断某个文件是否属于开源范围，请先提交 Issue 询问，不要默认获得商业使用或再传播授权。

## 贡献方式

欢迎提交失效链接、兼容性问题、无障碍改进、文档修正和经过脱敏的教学模板。涉及学生作品时，必须确认作者与监护人同意公开展示，并避免提交真实姓名、学校、联系方式、精确位置等不必要的个人信息。

开始贡献前请阅读：

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [PRIVACY.md](PRIVACY.md)
- [SECURITY.md](SECURITY.md)
- [NOTICE.md](NOTICE.md)

## Codex 如何参与维护

本项目使用 Codex 辅助处理有明确验收标准的维护任务，例如：

- 检查站内链接和页面入口；
- 检查新增页面是否缺少版权与隐私提示；
- 辅助审查 HTML、CSS 和 JavaScript 修改；
- 生成候选修复并运行验证；
- 整理版本变更记录与发布检查清单。

所有公开修改由维护者复核。AI 生成结果不是自动发布依据，也不代替学生作者、教师或监护人的判断。具体流程见 [docs/CODEX_MAINTENANCE.md](docs/CODEX_MAINTENANCE.md)。

## 项目状态

项目由主要维护者持续维护。当前重点是完善开源治理、自动检查、移动端体验和学生作品提交边界。计划见 [ROADMAP.md](ROADMAP.md)，版本变化见 [CHANGELOG.md](CHANGELOG.md)。

## 维护者

主要维护者：[@CHRISQIAO2024](https://github.com/CHRISQIAO2024)。详见 [MAINTAINERS.md](MAINTAINERS.md)。

