# Family Road Trip 2026

2026-09-25 至 2026-10-03，一家四大一小自驾旅行路书。

路线：宁波 → 日照 → 威海/荣成 → 烟台 → 北京 → 临沂 → 杭州临平

## 技术栈

- Vite
- React 19
- TypeScript
- Node.js 20+
- Vercel

## 功能

- 手机优先的 9 天行程路书
- Open-Meteo 行程天气
- 高德景点 / 酒店 / 美食一键搜索
- 酒店信息 localStorage 本地保存
- 每日完成打卡和总进度
- 出发准备清单
- 出发倒计时
- 大字体模式
- 北京官方预约入口

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物输出到 `dist/`。

## 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F89404068%2Ffamily-roadtrip-2026&project-name=family-roadtrip-2026)

Vercel 会自动安装依赖并运行 `npm run build`，无需环境变量。
