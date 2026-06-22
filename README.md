<div align="center">

# 👟 Dewu Seller Helper

**得物卖家助手 · 利润计算 · 出价建议 · 费用查询**

<br>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br>

得物卖家一站式工具 · 输入售价秒算到手利润 · 智能出价区间推荐 · 费率明细速查

[功能特性](#功能特性) · [费率模型](#费率模型) · [技术栈](#技术栈) · [快速启动](#快速启动) · [项目结构](#项目结构)

</div>

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 💰 **利润计算器** | 输入售价，自动扣除所有费用，秒算实际到手收入 |
| 📈 **出价建议** | 根据目标到手价反推建议售价区间 |
| 📋 **费率速查** | 一键查看得物各项费率规则与阶梯区间 |
| 📱 **响应式适配** | 桌面端与移动端均可流畅使用 |

---

## 费率模型

| 费用项 | 规则 | 说明 |
|--------|------|------|
| 技术服务费 | 售价 × 3% | 最低 ¥15，最高 ¥249 |
| 转账手续费 | 售价 × 1% | 无上限 |
| 查验费 | 固定 ¥10 | 每单固定 |
| 鉴定费 | 固定 ¥18 | 每单固定 |
| 包装费 | 固定 ¥10 | 每单固定 |

### 计算公式

```
到手收入 = 售价 - 技术服务费 - 转账手续费 - 查验费 - 鉴定费 - 包装费
```

### 示例

| 售价 | 技术服务费 | 转账手续费 | 查验+鉴定+包装 | 总费用 | 到手收入 |
|------|-----------|-----------|---------------|--------|---------|
| ¥500 | ¥15 | ¥5 | ¥38 | ¥58 | ¥442 |
| ¥1,000 | ¥30 | ¥10 | ¥38 | ¥78 | ¥922 |
| ¥5,000 | ¥150 | ¥50 | ¥38 | ¥238 | ¥4,762 |

---

## 技术栈

| 技术 | 职责 |
|------|------|
| Next.js 15 | React 全栈框架（App Router） |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 原子化样式 |

---

## 快速启动

```bash
git clone https://github.com/H1nk5/dewu-seller-helper.git
cd dewu-seller-helper
npm install
npm run dev
```

浏览器访问 **http://localhost:3000**。

---

## 项目结构

```
dewu-seller-helper/
├── src/
│   └── app/
│       ├── page.tsx         # 主页面（利润计算 + 出价建议 + 费率查询）
│       ├── layout.tsx       # 布局
│       └── globals.css      # 全局样式
├── public/                  # 静态资源
├── package.json
└── tailwind.config.ts
```

---

## 开源许可

MIT © [H1nk5](https://github.com/H1nk5)
