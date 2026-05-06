"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "@/lib/tasks";
import { Task } from "@/types";
import {
  Plus,
  Trash2,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "#6b7280", bg: "#f3f4f6", icon: Circle },
  in_progress: {
    label: "In Progress",
    color: "#d97706",
    bg: "#fffbeb",
    icon: Clock,
  },
  done: { label: "Done", color: "#059669", bg: "#ecfdf5", icon: CheckCircle2 },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "#059669", bg: "#ecfdf5" },
  medium: { label: "Medium", color: "#d97706", bg: "#fffbeb" },
  high: { label: "High", color: "#dc2626", bg: "#fef2f2" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [adding, setAdding] = useState(false);
  const [userId, setUserId] = useState("");
  const [filter, setFilter] = useState<Task["status"] | "all">("all");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        const data = await getTasks(user.id);
        setTasks(data);
        setLoading(false);
      }
    });
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const task = await createTask(userId, newTitle.trim(), newPriority);
      setTasks([task, ...tasks]);
      setNewTitle("");
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    await updateTaskStatus(taskId, status);
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", paddingTop: "4rem", color: "#9ca3af" }}
      >
        Loading tasks...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          Tasks
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          Manage your tasks and track progress.
        </p>
      </div>

      {/* Add task */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.25rem",
          border: "1px solid #e5e7eb",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "0.625rem 1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
          style={{
            padding: "0.625rem 1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            background: "white",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAdd}
          disabled={adding || !newTitle.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: adding || !newTitle.trim() ? "#93c5fd" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            cursor: adding || !newTitle.trim() ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["all", "todo", "in_progress", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.375rem 1rem",
              borderRadius: "999px",
              border: "1px solid",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s",
              background: filter === f ? "#2563eb" : "white",
              color: filter === f ? "white" : "#6b7280",
              borderColor: filter === f ? "#2563eb" : "#e5e7eb",
            }}
          >
            {f === "all" ? "All" : STATUS_CONFIG[f].label} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "white",
              borderRadius: "1rem",
              border: "1px solid #e5e7eb",
              color: "#9ca3af",
            }}
          >
            <AlertCircle size={32} style={{ margin: "0 auto 0.75rem" }} />
            <p>No tasks found. Add one above!</p>
          </div>
        ) : (
          filtered.map((task) => {
            const statusCfg = STATUS_CONFIG[task.status];
            const priorityCfg = PRIORITY_CONFIG[task.priority];
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={task.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "all 0.2s",
                }}
              >
                {/* Status icon */}
                <StatusIcon
                  size={20}
                  color={statusCfg.color}
                  style={{ flexShrink: 0 }}
                />

                {/* Title */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: task.status === "done" ? "#9ca3af" : "#111827",
                      textDecoration:
                        task.status === "done" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      marginTop: "0.125rem",
                    }}
                  >
                    {new Date(task.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Priority badge */}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    background: priorityCfg.bg,
                    color: priorityCfg.color,
                    flexShrink: 0,
                  }}
                >
                  {priorityCfg.label}
                </span>

                {/* Status select */}
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(
                      task.id,
                      e.target.value as Task["status"],
                    )
                  }
                  style={{
                    padding: "0.375rem 0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.625rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    background: "white",
                    color: "#374151",
                    cursor: "pointer",
                    outline: "none",
                    flexShrink: 0,
                  }}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#d1d5db",
                    display: "flex",
                    flexShrink: 0,
                    padding: "0.25rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
