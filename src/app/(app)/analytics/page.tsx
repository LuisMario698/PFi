"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, PieChart, TrendingDown, TrendingUp, Flame, Trophy, AlertTriangle, Target } from "lucide-react";
import Link from "next/link";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category_id: string | null;
  notes: string | null;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

type FilterType = "this_week" | "this_month" | "last_month" | "ytd";

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<FilterType>("this_week");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);
  const [elapsedDays, setElapsedDays] = useState(1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      let start = new Date();
      let end = new Date();
      let days = 1;

      if (filter === "this_week") {
        const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
        const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(now.setDate(diffToMonday));
        start.setHours(0, 0, 0, 0);
        end = new Date();
        // Calculate days from Monday to today
        days = Math.max(1, Math.ceil((new Date().getTime() - start.getTime()) / (1000 * 3600 * 24)));
      } else if (filter === "this_month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
        days = Math.max(1, new Date().getDate());
      } else if (filter === "last_month") {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        days = end.getDate();
      } else if (filter === "ytd") {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date();
        days = Math.max(1, Math.ceil((new Date().getTime() - start.getTime()) / (1000 * 3600 * 24)));
      }

      setElapsedDays(days);

      const [txRes, catRes] = await Promise.all([
        supabase
          .from("transactions")
          .select("id, amount, type, date, category_id, notes")
          .eq("user_id", user.id)
          .gte("date", start.toISOString())
          .lte("date", end.toISOString()),
        supabase
          .from("categories")
          .select("id, name, color")
          .eq("user_id", user.id),
      ]);

      setTransactions(txRes.data || []);
      
      const catMap: Record<string, Category> = {};
      (catRes.data || []).forEach(c => {
        catMap[c.id] = c as Category;
      });
      setCategories(catMap);
      setLoading(false);
    }
    loadData();
  }, [filter]);

  // Core Math
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  // Advanced Insights
  const burnRate = expense / elapsedDays;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  const expensesList = transactions.filter(t => t.type === "expense");
  let topExpense: Transaction | null = null;
  if (expensesList.length > 0) {
    topExpense = expensesList.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
  }

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  expensesList.forEach(t => {
    const catId = t.category_id || "uncategorized";
    expensesByCategory[catId] = (expensesByCategory[catId] || 0) + t.amount;
  });

  const sortedExpenses = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([catId, amount]) => ({
      cat: categories[catId] || { name: "Sin categoría", color: "#6b7280" },
      amount,
      percentage: expense > 0 ? (amount / expense) * 100 : 0
    }));

  // Build Conic Gradient for the Donut Chart
  let cumulativePercent = 0;
  const gradientStops = sortedExpenses.map(item => {
    const start = cumulativePercent;
    const end = cumulativePercent + item.percentage;
    cumulativePercent = end;
    return `${item.cat.color} ${start}%, ${item.cat.color} ${end}%`;
  }).join(", ");

  const conicGradient = gradientStops ? `conic-gradient(${gradientStops})` : 'conic-gradient(var(--card-border) 0%, var(--card-border) 100%)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '30px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)' }}><ArrowLeft size={20} /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Análisis Inteligente</h2>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
        {(['this_week', 'this_month', 'last_month', 'ytd'] as const).map(f => {
          const labels: Record<FilterType, string> = {
            this_week: 'Semana',
            this_month: 'Mes',
            last_month: 'Pasado',
            ytd: 'Año'
          };
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1, padding: '8px 2px', border: 'none', background: isActive ? 'var(--card-bg)' : 'transparent',
                color: isActive ? 'var(--foreground)' : 'var(--muted)', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {labels[f]}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><p>Analizando...</p></div>
      ) : (
        <>
          {/* Executive Summary */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="glass-panel" style={{ flex: 1, padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                <TrendingUp size={16} /> <span style={{ fontSize: '0.8rem' }}>Ingresos</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div className="glass-panel" style={{ flex: 1, padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171' }}>
                <TrendingDown size={16} /> <span style={{ fontSize: '0.8rem' }}>Gastos</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>${expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Flujo Neto</p>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: net >= 0 ? '#4ade80' : '#f87171' }}>
              {net >= 0 ? '+' : '-'}${Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* ADVANCED INSIGHTS GRID */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '8px' }}>Inteligencia Financiera</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            {/* Burn Rate */}
            <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f97316' }}>
                <Flame size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Gasto Diario</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>${burnRate.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Promedio en {elapsedDays} días</p>
            </div>

            {/* Savings Rate */}
            <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6' }}>
                <Trophy size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Ahorro Real</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: savingsRate > 0 ? '#4ade80' : 'var(--foreground)' }}>
                {savingsRate > 0 ? `${savingsRate.toFixed(1)}%` : '0%'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>De tus ingresos</p>
            </div>

            {/* Top Expense */}
            <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ec4899' }}>
                <Target size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Fuga Principal</span>
              </div>
              {topExpense ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {topExpense.notes || categories[topExpense.category_id || ""]?.name || 'Gasto mayor'}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f87171' }}>
                    -${topExpense.amount.toLocaleString('en-US')}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Sin gastos en el periodo</p>
              )}
            </div>

            {/* Warning if overspending */}
            {expense > income && income > 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.8rem', color: '#f87171', lineHeight: 1.4 }}>
                  <strong>Alerta de Consumo:</strong> Estás gastando más dinero del que está ingresando. Reduce los gastos para evitar endeudamiento.
                </p>
              </div>
            )}
          </div>

          {/* Donut Chart (Expenses) */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '24px', alignSelf: 'flex-start' }}>
              Distribución de Gastos
            </h3>
            
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* The conic gradient circle */}
              <div style={{
                position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                background: conicGradient,
                transition: 'background 0.5s ease',
              }} />
              {/* Inner cutout to make it a donut */}
              <div style={{
                position: 'absolute', width: '140px', height: '140px', borderRadius: '50%',
                background: 'var(--background)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <PieChart size={24} color="var(--muted)" style={{ marginBottom: '4px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total</p>
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  ${expense.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          {/* Top Categories Progress Bars */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Detalle de Gastos</h3>
            
            {sortedExpenses.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
                No hay gastos registrados en este periodo.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sortedExpenses.map(item => (
                  <div key={item.cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.cat.color }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.cat.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', width: '32px', textAlign: 'right' }}>{Math.round(item.percentage)}%</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${item.percentage}%`, 
                        height: '100%', 
                        background: item.cat.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
