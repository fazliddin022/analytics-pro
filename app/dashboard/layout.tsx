"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import {
  BarChart3,
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

// ✅ Tashqarida — alohida komponent
type SidebarProps = {
  email: string;
  pathname: string;
  onSignOut: () => void;
  onClose: () => void;
};

function Sidebar({ email, pathname, onSignOut, onClose }: SidebarProps) {
  return (
    <aside style={{
      width: "240px",
      background: "white",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.5rem",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <div style={{
          background: "#2563eb",
          borderRadius: "0.625rem",
          padding: "0.375rem",
          display: "flex",
        }}>
          <BarChart3 size={20} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>
          AnalyticsPro
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  background: active ? "#eff6ff" : "transparent",
                  color: active ? "#2563eb" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.625rem",
          borderRadius: "0.75rem",
          marginBottom: "0.5rem",
          background: "#f9fafb",
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            background: "#2563eb",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{
            fontSize: "0.75rem",
            color: "#374151",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {email}
          </p>
        </div>

        <button
          onClick={onSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.875rem",
            borderRadius: "0.75rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: "#ef4444",
            fontWeight: 500,
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ✅ Asosiy layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setEmail(session.user.email || "");
        setLoading(false);
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}>
        <div style={{ textAlign: "center" }}>
          <BarChart3 size={40} color="#2563eb" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Desktop sidebar */}
      <Sidebar
        email={email}
        pathname={pathname}
        onSignOut={handleSignOut}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 30,
          }}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: "240px" }}>
        {/* Top bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "2.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            background: "#f3f4f6",
            padding: "0.375rem 0.875rem",
            borderRadius: "999px",
          }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <main style={{ padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}