"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data — keyinchalik real Supabase data bilan almashtiramiz
const AREA_DATA = [
  { month: "Jan", revenue: 4200, users: 240 },
  { month: "Feb", revenue: 5800, users: 310 },
  { month: "Mar", revenue: 4900, users: 280 },
  { month: "Apr", revenue: 7200, users: 420 },
  { month: "May", revenue: 6100, users: 380 },
  { month: "Jun", revenue: 8400, users: 510 },
  { month: "Jul", revenue: 9200, users: 590 },
  { month: "Aug", revenue: 7800, users: 480 },
  { month: "Sep", revenue: 10200, users: 640 },
  { month: "Oct", revenue: 11500, users: 720 },
  { month: "Nov", revenue: 9800, users: 610 },
  { month: "Dec", revenue: 13200, users: 840 },
];

const BAR_DATA = [
  { day: "Mon", sales: 42 },
  { day: "Tue", sales: 67 },
  { day: "Wed", sales: 53 },
  { day: "Thu", sales: 89 },
  { day: "Fri", sales: 74 },
  { day: "Sat", sales: 95 },
  { day: "Sun", sales: 38 },
];

const KPIS = [
  {
    title: "Total Revenue",
    value: "$84,254",
    change: 12.5,
    icon: DollarSign,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    title: "Total Users",
    value: "5,842",
    change: 8.2,
    icon: Users,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    title: "Total Orders",
    value: "1,429",
    change: -3.1,
    icon: ShoppingCart,
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    title: "Growth Rate",
    value: "24.8%",
    change: 4.6,
    icon: TrendingUp,
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const RECENT_ACTIVITY = [
  {
    user: "Sarah Johnson",
    action: "Purchased MacBook Pro",
    time: "2 min ago",
    amount: "+$1,999",
  },
  {
    user: "Mike Chen",
    action: "Subscribed to Pro plan",
    time: "15 min ago",
    amount: "+$49",
  },
  {
    user: "Emily Davis",
    action: "Cancelled subscription",
    time: "1 hr ago",
    amount: "-$29",
  },
  {
    user: "Alex Kim",
    action: "Purchased iPhone 15",
    time: "2 hr ago",
    amount: "+$999",
  },
  {
    user: "Lisa Wang",
    action: "Upgraded to Enterprise",
    time: "3 hr ago",
    amount: "+$199",
  },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.email?.split("@")[0] || "there");
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          Good morning, {userName}! 👋
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginTop: "0.25rem",
            fontSize: "0.875rem",
          }}
        >
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {KPIS.map((kpi) => (
          <div
            key={kpi.title}
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1.25rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  background: kpi.bg,
                  padding: "0.625rem",
                  borderRadius: "0.75rem",
                }}
              >
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: kpi.change > 0 ? "#059669" : "#dc2626",
                  background: kpi.change > 0 ? "#ecfdf5" : "#fef2f2",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "999px",
                }}
              >
                {kpi.change > 0 ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {Math.abs(kpi.change)}%
              </span>
            </div>
            <p
              style={{
                fontSize: "1.625rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {kpi.value}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginTop: "0.25rem",
              }}
            >
              {kpi.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Area chart */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              color: "#111827",
              marginBottom: "1.5rem",
            }}
          >
            Revenue Overview
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              color: "#111827",
              marginBottom: "1.5rem",
            }}
          >
            Weekly Sales
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BAR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{ fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}
        >
          Recent Activity
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem 0",
                borderBottom:
                  i < RECENT_ACTIVITY.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#2563eb",
                    flexShrink: 0,
                  }}
                >
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    {item.user}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {item.action}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: item.amount.startsWith("+") ? "#059669" : "#dc2626",
                  }}
                >
                  {item.amount}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
