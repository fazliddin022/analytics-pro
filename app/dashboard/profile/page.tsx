"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Shield, Calendar, Save } from "lucide-react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setRole(profile.role || "user");
        setCreatedAt(profile.created_at);
      }

      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "4rem", color: "#9ca3af" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "640px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          Profile
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Manage your account information.
        </p>
      </div>

      {/* Avatar */}
      <div style={{
        background: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "white", fontSize: "1.75rem", fontWeight: 700 }}>
            {email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "#111827", fontSize: "1.125rem" }}>
            {fullName || email.split("@")[0]}
          </p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>{email}</p>
          <span style={{
            display: "inline-block",
            marginTop: "0.375rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#2563eb",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {role}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
      }}>
        {[
          { icon: Mail, label: "Email", value: email },
          { icon: Shield, label: "Role", value: role },
          {
            icon: Calendar,
            label: "Member since",
            value: createdAt ? new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }) : "—"
          },
          { icon: User, label: "Status", value: "Active" },
        ].map((item) => (
          <div key={item.label} style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.25rem",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}>
              <item.icon size={16} color="#9ca3af" />
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>
                {item.label}
              </p>
            </div>
            <p style={{ fontWeight: 600, color: "#111827", fontSize: "0.875rem" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div style={{
        background: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
      }}>
        <h2 style={{ fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}>
          Edit Information
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#374151",
              marginBottom: "0.5rem",
            }}>
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                outline: "none",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#374151",
              marginBottom: "0.5rem",
            }}>
              Email
            </label>
            <input
              value={email}
              disabled
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                outline: "none",
                background: "#f9fafb",
                color: "#9ca3af",
                cursor: "not-allowed",
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.375rem" }}>
              Email cannot be changed.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: saved ? "#059669" : saving ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.2s",
              alignSelf: "flex-start",
            }}
          >
            <Save size={16} />
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}