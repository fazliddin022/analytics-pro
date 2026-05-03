export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
};

export type AnalyticsEvent = {
  id: string;
  user_id: string;
  event_type: string;
  value: number;
  created_at: string;
};

export type KPICard = {
  title: string;
  value: string | number;
  change: number;
  icon: string;
};