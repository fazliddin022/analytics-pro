import { supabase } from "./supabase";
import { Task } from "@/types";

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTask(
  userId: string,
  title: string,
  priority: Task["priority"] = "medium"
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ user_id: userId, title, priority })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  status: Task["status"]
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw error;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
}