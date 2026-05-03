"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";
import { BarChart3, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signIn(form.email, form.password);
      } else {
        if (!form.fullName) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        await signUp(form.email, form.password, form.fullName);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    background: "white",
    color: "#111827",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #f9fafb 50%, #f0fdf4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "#2563eb",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <BarChart3 size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
            AnalyticsPro
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6",
        }}>
          {/* Tabs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#f3f4f6",
            borderRadius: "0.75rem",
            padding: "0.25rem",
            marginBottom: "1.5rem",
          }}>
            {["Login", "Sign Up"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === "Login"); setError(""); }}
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.625rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  background: (isLogin && tab === "Login") || (!isLogin && tab === "Sign Up")
                    ? "white"
                    : "transparent",
                  color: (isLogin && tab === "Login") || (!isLogin && tab === "Sign Up")
                    ? "#111827"
                    : "#6b7280",
                  boxShadow: (isLogin && tab === "Login") || (!isLogin && tab === "Sign Up")
                    ? "0 1px 4px rgba(0,0,0,0.08)"
                    : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Full name — faqat Sign Up da */}
            {!isLogin && (
              <div style={{ position: "relative" }}>
                <User size={16} style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }} />
                <input
                  name="fullName"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={handleChange}
                  style={INPUT_STYLE}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }} />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                style={INPUT_STYLE}
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={{ ...INPUT_STYLE, paddingRight: "3rem" }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                fontWeight: 600,
                fontSize: "0.875rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9ca3af",
          marginTop: "1.5rem",
        }}>
          Protected by Supabase Auth 🔐
        </p>
      </div>
    </div>
  );
}