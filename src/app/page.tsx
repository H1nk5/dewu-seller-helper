"use client";

import { useState } from "react";

// 得物费率配置
const FEES = {
  techFeePercent: 0.03,
  techFeeMin: 1500,
  techFeeMax: 24900,
  transferFeePercent: 0.01,
  inspectFee: 1000,
  authFee: 1800,
  packFee: 1000,
};

type Tab = "home" | "calc" | "query" | "suggest";

function calcFees(price: number) {
  const techFee = Math.min(Math.max(Math.round(price * FEES.techFeePercent), FEES.techFeeMin), FEES.techFeeMax);
  const transferFee = Math.round(price * FEES.transferFeePercent);
  const totalFee = techFee + transferFee + FEES.inspectFee + FEES.authFee + FEES.packFee;
  const income = price - totalFee;
  return { techFee, transferFee, inspectFee: FEES.inspectFee, authFee: FEES.authFee, packFee: FEES.packFee, totalFee, income };
}

function fenToYuan(fen: number) {
  return (fen / 100).toFixed(2);
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setTab("home")} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">D</div>
            <div className="text-left">
              <h1 className="text-base font-bold text-slate-900 leading-tight">得物卖家助手</h1>
              <p className="text-[10px] text-slate-400 leading-tight">利润计算 · 出价建议</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium border border-emerald-200">免费</span>
            {tab !== "home" && (
              <button onClick={() => setTab("home")} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                首页
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tab Nav (hidden on home) */}
      {tab !== "home" && (
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 flex gap-1">
            {([
              { key: "calc", label: "利润计算器", icon: "📊" },
              { key: "query", label: "费用查询", icon: "🔍" },
              { key: "suggest", label: "出价建议", icon: "💡" },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "home" && <LandingPage onNavigate={setTab} />}
        {tab === "calc" && <ProfitCalc />}
        {tab === "query" && <FeeQuery />}
        {tab === "suggest" && <PriceSuggest />}
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        得物卖家助手 · 手续费率基于得物官方规则 · 仅供参考
      </footer>
    </div>
  );
}

// ========== 落地页 ==========
function LandingPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-4 border border-blue-200">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          得物卖家必备工具
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
          卖之前，先算清楚<br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">能赚多少</span>
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          输入售价和成本，自动扣除得物全部手续费<br />
          一秒算出净利润，再也不怕卖亏了
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate("calc")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            开始计算
          </button>
          <button
            onClick={() => onNavigate("query")}
            className="bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            费用查询
          </button>
        </div>
      </section>

      {/* 痛点 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">你是不是也遇到过这些问题？</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "😵", title: "不知道扣多少手续费", desc: "技术服务费、鉴别费、包装费...一堆费用搞不清" },
            { icon: "😰", title: "卖完才发现亏了", desc: "售价看着挺高，扣完费用到手比进货价还低" },
            { icon: "🤯", title: "出价全凭感觉", desc: "不知道出多少合适，出高了卖不掉，出低了不赚钱" },
          ].map((p, i) => (
            <div key={i} className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="text-2xl mb-2">{p.icon}</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">{p.title}</div>
              <div className="text-xs text-slate-500">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 功能介绍 */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">三个功能，解决所有问题</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "📊",
              title: "利润计算器",
              desc: "输入售价 + 成本，自动扣除全部费用，一秒算出净利润和利润率",
              tag: "最常用",
              action: () => onNavigate("calc"),
            },
            {
              icon: "🔍",
              title: "费用查询",
              desc: "输入商品当前最低价，自动显示费用明细、到账金额、三种出价建议",
              tag: "出价必备",
              action: () => onNavigate("query"),
            },
            {
              icon: "💡",
              title: "智能出价建议",
              desc: "设定目标利润率，自动反算建议售价，确保每单都赚钱",
              tag: "省心",
              action: () => onNavigate("suggest"),
            },
          ].map((f, i) => (
            <button
              key={i}
              onClick={f.action}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{f.tag}</span>
              </div>
              <div className="text-base font-bold text-slate-900 mb-1">{f.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              <div className="mt-3 text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                立即使用 →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 费率说明 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">得物手续费一览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: "技术服务费", value: "3%", note: "15-249元" },
            { name: "转账手续费", value: "1%", note: "无上限" },
            { name: "查验费", value: "10元", note: "固定" },
            { name: "鉴别费", value: "18元", note: "固定" },
            { name: "包装服务费", value: "10元", note: "固定" },
          ].map((f, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 mb-1">{f.name}</div>
              <div className="text-lg font-bold text-slate-900">{f.value}</div>
              <div className="text-[10px] text-slate-400">{f.note}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">费率基于得物官方规则，如有变动以平台为准</p>
      </section>

      {/* 举个例子 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">举个例子</h2>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-slate-500 mb-3">假设你卖一双鞋，售价 ¥599，进货价 ¥450</div>
            {(() => {
              const fees = calcFees(59900);
              const profit = fees.income - 45000;
              return (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">技术服务费</span><span>-¥{fenToYuan(fees.techFee)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">转账手续费</span><span>-¥{fenToYuan(fees.transferFee)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">查验+鉴别+包装</span><span>-¥{fenToYuan(fees.inspectFee + fees.authFee + fees.packFee)}</span></div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between"><span className="text-slate-500">总手续费</span><span className="text-red-600 font-medium">-¥{fenToYuan(fees.totalFee)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">到账金额</span><span className="font-medium">¥{fenToYuan(fees.income)}</span></div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                    <span className="text-slate-900">净利润</span>
                    <span className="text-green-600 text-base">¥{fenToYuan(profit)}</span>
                  </div>
                  <div className="text-center text-xs text-slate-400 mt-1">利润率 {((profit / 45000) * 100).toFixed(1)}%</div>
                </div>
              );
            })()}
          </div>
          <p className="text-xs text-slate-500 text-center mt-3">用这个工具，你可以在出价前就知道能赚多少</p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">别再凭感觉出价了</h2>
        <p className="text-sm text-slate-500 mb-6">10 秒算清楚，每单都赚钱</p>
        <button
          onClick={() => onNavigate("calc")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
        >
          免费开始使用
        </button>
      </section>
    </div>
  );
}

// ========== 利润计算器 ==========
function ProfitCalc() {
  const [priceStr, setPriceStr] = useState("");
  const [costStr, setCostStr] = useState("");

  const price = parseFloat(priceStr) || 0;
  const cost = parseFloat(costStr) || 0;
  const priceFen = Math.round(price * 100);
  const fees = priceFen > 0 ? calcFees(priceFen) : null;
  const profit = fees ? fees.income - Math.round(cost * 100) : 0;
  const profitRate = fees && cost > 0 ? ((profit / (cost * 100)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">利润计算器</h2>
        <p className="text-sm text-slate-500 mb-6">输入售价和成本，自动计算扣除得物手续费后的净利润</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">售价（元）</label>
            <input type="number" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} placeholder="例如：599"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">进货成本（元）</label>
            <input type="number" value={costStr} onChange={(e) => setCostStr(e.target.value)} placeholder="例如：450"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        {fees && priceFen > 0 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">¥{fenToYuan(fees.income)}</div>
                <div className="text-xs text-slate-500 mt-1">到账金额</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">¥{fenToYuan(fees.totalFee)}</div>
                <div className="text-xs text-slate-500 mt-1">总手续费</div>
              </div>
              <div className={`rounded-xl p-4 text-center ${profit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>¥{fenToYuan(profit)}</div>
                <div className="text-xs text-slate-500 mt-1">净利润</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">费用明细</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "技术服务费 (3%)", value: fees.techFee, note: "15-249元" },
                  { label: "转账手续费 (1%)", value: fees.transferFee },
                  { label: "查验费", value: fees.inspectFee },
                  { label: "鉴别费", value: fees.authFee },
                  { label: "包装服务费", value: fees.packFee },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-600">{f.label}{f.note && <span className="text-xs text-slate-400 ml-1">({f.note})</span>}</span>
                    <span className="font-medium text-slate-900">-¥{fenToYuan(f.value)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-semibold">
                  <span className="text-slate-700">总费用</span>
                  <span className="text-red-600">-¥{fenToYuan(fees.totalFee)}</span>
                </div>
              </div>
            </div>

            {cost > 0 && (
              <div className={`mt-4 p-4 rounded-xl text-center ${profit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <span className={`text-lg font-bold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                  利润率 {profitRate.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-500 ml-2">{profit >= 0 ? "✓ 可以赚" : "✗ 会亏钱"}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">快捷计算（热门价位）</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[299, 499, 699, 999, 1299, 1599, 1999, 2999].map((p) => {
            const f = calcFees(p * 100);
            return (
              <button key={p} onClick={() => { setPriceStr(String(p)); setCostStr(""); }}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg p-3 text-center transition-colors">
                <div className="text-sm font-semibold text-slate-900">¥{p}</div>
                <div className="text-xs text-slate-500">到账 ¥{fenToYuan(f.income)}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ========== 费用查询 ==========
function FeeQuery() {
  const [name, setName] = useState("");
  const [minPriceStr, setMinPriceStr] = useState("");
  const [costStr, setCostStr] = useState("");

  const minPrice = parseFloat(minPriceStr) || 0;
  const cost = parseFloat(costStr) || 0;
  const minPriceFen = Math.round(minPrice * 100);
  const fees = minPriceFen > 0 ? calcFees(minPriceFen) : null;

  const suggestions = minPrice > 0 ? [
    { label: "激进出价", price: minPrice - 20, color: "text-green-600", bg: "bg-green-50", desc: "比最低价低 20 元，快速成交" },
    { label: "稳进出价", price: minPrice - 5, color: "text-blue-600", bg: "bg-blue-50", desc: "比最低价低 5 元，平衡速度和利润" },
    { label: "利润出价", price: minPrice + 30, color: "text-orange-600", bg: "bg-orange-50", desc: "比最低价高 30 元，等涨价再卖" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">费用查询</h2>
        <p className="text-sm text-slate-500 mb-6">手动输入商品当前最低价，自动计算费用和出价建议</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">商品名称（可选）</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：Nike Dunk Low 熊猫"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">当前最低价（元）</label>
            <input type="number" value={minPriceStr} onChange={(e) => setMinPriceStr(e.target.value)} placeholder="例如：599"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">你的进货成本（元）</label>
            <input type="number" value={costStr} onChange={(e) => setCostStr(e.target.value)} placeholder="例如：450"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {fees && minPriceFen > 0 && (
          <>
            {name && (
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-slate-900">{name}</h3>
                <p className="text-sm text-slate-500">当前最低价 ¥{minPrice}</p>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">按最低价出售后费用明细</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">技术服务费 (3%)</span><span className="font-medium">-¥{fenToYuan(fees.techFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">转账手续费 (1%)</span><span className="font-medium">-¥{fenToYuan(fees.transferFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">查验费</span><span className="font-medium">-¥{fenToYuan(fees.inspectFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">鉴别费</span><span className="font-medium">-¥{fenToYuan(fees.authFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">包装服务费</span><span className="font-medium">-¥{fenToYuan(fees.packFee)}</span></div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-1"><span className="text-slate-700">总费用</span><span className="text-red-600">-¥{fenToYuan(fees.totalFee)}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">实际到账</span>
                <span className="text-xl font-bold text-green-600">¥{fenToYuan(fees.income)}</span>
              </div>
            </div>

            {cost > 0 && (() => {
              const profit = fees.income - Math.round(cost * 100);
              const rate = (profit / (cost * 100)) * 100;
              return (
                <div className={`rounded-xl p-4 mb-4 ${profit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">净利润（扣除成本 ¥{cost}）</span>
                    <span className={`text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ¥{fenToYuan(profit)} ({rate.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {profit >= 0 ? "✓ 可以赚" : "✗ 会亏钱，建议提高售价或降低成本"}
                  </div>
                </div>
              );
            })()}

            {suggestions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">出价建议</h3>
                <div className="grid grid-cols-3 gap-3">
                  {suggestions.map((s, i) => {
                    const f = calcFees(Math.round(s.price * 100));
                    const profit = cost > 0 ? f.income - Math.round(cost * 100) : null;
                    return (
                      <div key={i} className={`${s.bg} rounded-xl p-4 text-center border border-slate-200`}>
                        <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                        <div className={`text-xl font-bold ${s.color}`}>¥{s.price.toFixed(0)}</div>
                        <div className="text-xs text-slate-400 mt-1">到账 ¥{fenToYuan(f.income)}</div>
                        {profit !== null && (
                          <div className={`text-xs mt-1 font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            利润 ¥{fenToYuan(profit)}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">{s.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">如何使用</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>1. 在得物 APP 查看你要卖的商品当前最低价</p>
          <p>2. 输入最低价和你的进货成本</p>
          <p>3. 工具自动计算手续费、到账金额、净利润</p>
          <p>4. 根据出价建议决定你的售价</p>
        </div>
      </div>
    </div>
  );
}

// ========== 出价建议 ==========
function PriceSuggest() {
  const [priceStr, setPriceStr] = useState("");
  const [costStr, setCostStr] = useState("");
  const [targetProfit, setTargetProfit] = useState("20");

  const price = parseFloat(priceStr) || 0;
  const cost = parseFloat(costStr) || 0;
  const target = parseFloat(targetProfit) || 0;

  const targetIncome = cost > 0 ? cost * (1 + target / 100) : 0;
  const suggestedPrice = targetIncome > 0 ? Math.ceil((targetIncome * 100 + 3800) / 0.96) : 0;
  const suggestedPriceYuan = suggestedPrice / 100;

  const currentFees = price > 0 ? calcFees(Math.round(price * 100)) : null;
  const currentProfit = currentFees ? currentFees.income - Math.round(cost * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">智能出价建议</h2>
        <p className="text-sm text-slate-500 mb-6">设定目标利润率，自动算出建议售价</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">进货成本（元）</label>
            <input type="number" value={costStr} onChange={(e) => setCostStr(e.target.value)} placeholder="例如：450"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">目标利润率（%）</label>
            <input type="number" value={targetProfit} onChange={(e) => setTargetProfit(e.target.value)} placeholder="例如：20"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">当前售价（可选，对比用）</label>
            <input type="number" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} placeholder="例如：599"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {cost > 0 && target > 0 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
              <div className="text-sm text-blue-600 mb-1">建议出价</div>
              <div className="text-4xl font-bold text-blue-700">¥{suggestedPriceYuan.toFixed(0)}</div>
              <div className="text-sm text-blue-500 mt-2">
                目标利润率 {target}% · 目标到账 ¥{fenToYuan(Math.round(targetIncome * 100))}
              </div>
            </div>

            {(() => {
              const f = calcFees(suggestedPrice);
              const profit = f.income - Math.round(cost * 100);
              const rate = (profit / (cost * 100)) * 100;
              return (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">验算明细</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">建议售价</span><span className="font-medium">¥{suggestedPriceYuan.toFixed(0)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">总手续费</span><span className="text-red-600">-¥{fenToYuan(f.totalFee)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">到账金额</span><span className="font-medium">¥{fenToYuan(f.income)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">进货成本</span><span className="text-red-600">-¥{fenToYuan(Math.round(cost * 100))}</span></div>
                    <div className="flex justify-between col-span-2 border-t border-slate-200 pt-2 font-semibold">
                      <span className="text-slate-700">净利润</span>
                      <span className="text-green-600">¥{fenToYuan(profit)} ({rate.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {price > 0 && currentFees && (
              <div className={`rounded-xl p-4 border ${currentProfit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">当前售价 ¥{price} 对比</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">到账金额</span><span>¥{fenToYuan(currentFees.income)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">净利润</span>
                    <span className={currentProfit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>¥{fenToYuan(currentProfit)}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-slate-500">利润率</span>
                    <span className={currentProfit >= 0 ? "text-green-600" : "text-red-600"}>
                      {((currentProfit / (cost * 100)) * 100).toFixed(1)}%{currentProfit >= 0 ? " ✓" : " ✗ 不达标"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">利润率参考</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { rate: 10, label: "薄利多销", color: "bg-yellow-50 border-yellow-200" },
            { rate: 20, label: "稳健经营", color: "bg-green-50 border-green-200" },
            { rate: 30, label: "理想利润", color: "bg-blue-50 border-blue-200" },
            { rate: 50, label: "高利润", color: "bg-purple-50 border-purple-200" },
          ].map((r) => (
            <button key={r.rate} onClick={() => setTargetProfit(String(r.rate))}
              className={`${r.color} border rounded-lg p-3 text-center hover:shadow-sm transition-shadow`}>
              <div className="text-lg font-bold text-slate-900">{r.rate}%</div>
              <div className="text-xs text-slate-500">{r.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
