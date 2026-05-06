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
  Cell,
} from "recharts";
import {
  CheckSquare,
  Clock,
  Circle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Task } from "@/types";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      setUserName(user.email?.split("@")[0] || "there");

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setTasks(data || []);
      setLoading(false);
    });
  }, []);

  // --- Real statistika ---
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const KPIS = [
    {
      title: "Total Tasks",
      value: total,
      change: total,
      icon: CheckSquare,
      color: "#2563eb",
      bg: "#eff6ff",
      suffix: "",
    },
    {
      title: "Completed",
      value: done,
      change: done,
      icon: CheckSquare,
      color: "#059669",
      bg: "#ecfdf5",
      suffix: "",
    },
    {
      title: "In Progress",
      value: inProgress,
      change: inProgress,
      icon: Clock,
      color: "#d97706",
      bg: "#fffbeb",
      suffix: "",
    },
    {
      title: "Completion Rate",
      value: completionRate,
      change: completionRate,
      icon: TrendingUp,
      color: "#7c3aed",
      bg: "#f5f3ff",
      suffix: "%",
    },
  ];

  // --- Status chart data ---
  const statusData = [
    { name: "To Do", value: todo, color: "#6b7280" },
    { name: "In Progress", value: inProgress, color: "#d97706" },
    { name: "Done", value: done, color: "#059669" },
  ];

  // --- Priority chart data ---
  const priorityData = [
    {
      name: "High",
      value: tasks.filter((t) => t.priority === "high").length,
      color: "#dc2626",
    },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "medium").length,
      color: "#d97706",
    },
    {
      name: "Low",
      value: tasks.filter((t) => t.priority === "low").length,
      color: "#059669",
    },
  ];

  // --- So'nggi 7 kun bo'yicha tasks ---
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    return {
      day: dayName,
      created: tasks.filter((t) => t.created_at.startsWith(dateStr)).length,
      done: tasks.filter(
        (t) => t.status === "done" && t.updated_at.startsWith(dateStr)
      ).length,
    };
  });

  // --- So'nggi 5 ta task ---
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "4rem", color: "#9ca3af" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          Good morning, {userName}! 👋
        </h1>
        <p style={{ color: "#6b7280", marginTop: "0.25rem", fontSize: "0.875rem" }}>
          You have {todo} pending and {inProgress} tasks in progress.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
      }}>
        {KPIS.map((kpi) => (
          <div key={kpi.title} style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.25rem",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}>
              <div style={{
                background: kpi.bg,
                padding: "0.625rem",
                borderRadius: "0.75rem",
              }}>
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: kpi.change > 0 ? "#059669" : "#9ca3af",
                background: kpi.change > 0 ? "#ecfdf5" : "#f3f4f6",
                padding: "0.25rem 0.5rem",
                borderRadius: "999px",
              }}>
                {kpi.change > 0
                  ? <ArrowUpRight size={12} />
                  : <ArrowDownRight size={12} />
                }
                {kpi.change}{kpi.suffix}
              </span>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#111827" }}>
              {kpi.value}{kpi.suffix}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
              {kpi.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
      }}>
        {/* Area chart — so'nggi 7 kun */}
        <div style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>
            Activity (Last 7 Days)
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
            Tasks created vs completed
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorCreated)"
                name="Created"
              />
              <Area
                type="monotone"
                dataKey="done"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#colorDone)"
                name="Done"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — status bo'yicha */}
        <div style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>
            Tasks by Status
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
            Current task distribution
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Tasks">
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
      }}>
        {/* Priority breakdown */}
        <div style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}>
            Priority Breakdown
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {priorityData.map((item) => (
              <div key={item.name}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.375rem",
                }}>
                  <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {item.value} / {total}
                  </span>
                </div>
                <div style={{
                  height: "8px",
                  background: "#f3f4f6",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
                    background: item.color,
                    borderRadius: "999px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tasks */}
        <div style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}>
            Recent Tasks
          </h2>
          {recentTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "#9ca3af" }}>
              <Circle size={32} style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "0.875rem" }}>No tasks yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentTasks.map((task) => (
                <div key={task.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}>
                  <p style={{
                    fontSize: "0.875rem",
                    color: task.status === "done" ? "#9ca3af" : "#111827",
                    textDecoration: task.status === "done" ? "line-through" : "none",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {task.title}
                  </p>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "999px",
                    flexShrink: 0,
                    background:
                      task.status === "done" ? "#ecfdf5" :
                      task.status === "in_progress" ? "#fffbeb" : "#f3f4f6",
                    color:
                      task.status === "done" ? "#059669" :
                      task.status === "in_progress" ? "#d97706" : "#6b7280",
                  }}>
                    {task.status === "in_progress" ? "In Progress" :
                     task.status === "done" ? "Done" : "To Do"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}