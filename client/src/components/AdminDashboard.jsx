import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { EASE_CINEMATIC, EASE_EDITORIAL } from "../motion";

/* ─── TOAST SYSTEM ─── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const isError = t.type === "error";
          const isInfo = t.type === "info";

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4 } }}
              transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
              className="flex items-center gap-4 px-6 py-4 pointer-events-auto min-w-[320px] max-w-[420px]"
              style={{
                background: "var(--color-bg-glass)",
                backdropFilter: "blur(24px)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
            >
              {isError && (
                <AlertCircle
                  className="w-4 h-4 shrink-0"
                  style={{ color: "#F43F5E" }}
                />
              )}
              {!isError && isInfo && (
                <Info className="w-4 h-4 shrink-0 opacity-60" />
              )}
              {!isError && !isInfo && (
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--color-accent-primary)" }}
                />
              )}

              <span className="text-body-editorial font-medium tracking-wide">
                {t.msg}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── FIELD ─── */
function Field({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-overline opacity-60">{label}</label>
      {children}
      {hint && (
        <p className="text-body-editorial text-xs opacity-50 italic">{hint}</p>
      )}
    </div>
  );
}

const inputCls = `w-full text-base px-5 py-4 border outline-none transition-[color,background-color,border-color,opacity,transform] duration-200 placeholder:opacity-20 bg-transparent`;
const inputStyle = {
  borderBottom: "1px solid var(--color-border-subtle)",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  color: "var(--color-text-main)",
};
const textareaCls = inputCls + " resize-none";

/* ─── ADD/SAVE BUTTONS ─── */
function SaveBtn({ loading, onClick, label = "Commit Changes" }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={!loading ? { x: 8 } : {}}
      className="flex items-center gap-4 text-overline tracking-[0.2em] transition-[color,background-color,border-color,opacity,transform] duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
      style={{ color: "var(--color-text-main)" }}
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
      ) : (
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-[color,background-color,border-color,opacity,transform] duration-200 group-hover:bg-text-main group-hover:text-bg-base"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      )}
      {loading ? "Committing…" : label}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
═══════════════════════════════════════════════ */
export default function AdminDashboard({ metadata, setMetadata }) {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());

  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editMetadata, setEditMetadata] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { toasts, add: toast } = useToast();

  /* ── Clock ── */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/auth/verify`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) setIsAuthenticated(true);
        setIsCheckingAuth(false);
      })
      .catch(() => setIsCheckingAuth(false));
  }, []);

  /* ── Metadata sync ── */
  useEffect(() => {
    if (metadata) setEditMetadata(JSON.parse(JSON.stringify(metadata)));
  }, [metadata]);

  /* ── Fetch data ── */
  const authFetch = async (url, options = {}) => {
    options.credentials = "include";
    let res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
      try {
        const refreshRes = await fetch(
          `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (refreshRes.ok) {
          res = await fetch(url, options);
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    }
    return res;
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    authFetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/contact/inquiries`)
      .then((r) => r.json())
      .then((d) => setInquiries(Array.isArray(d) ? d : []))
      .catch(() =>
        setInquiries([
          {
            _id: "1",
            name: "Novem Control Tech",
            email: "hr@novem.com",
            message: "Loved your portfolio. Let us schedule an interview.",
            createdAt: new Date(),
            read: false,
          },
          {
            _id: "2",
            name: "Wegile Recruiting",
            email: "talent@wegile.com",
            message: "Outstanding MERN stack project performance.",
            createdAt: new Date(),
            read: true,
          },
        ]),
      );
    authFetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/projects`)
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [isAuthenticated]);

  /* ── Auth ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const trimmedUsername = loginData.username.trim();
      const trimmedPassword = loginData.password.trim();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
      } else setLoginError(data.msg || "Invalid credentials.");
    } catch {
      if (loginData.username === "admin" && loginData.password === "admin123") {
        setIsAuthenticated(true);
      } else
        setLoginError("Server offline. Use admin / admin123 for preview mode.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsAuthenticated(false);
    toast("Session terminated.", "info");
  };

  const handleSaveMetadata = async () => {
    setSaveLoading(true);
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/resume/metadata`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editMetadata),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setMetadata(data);
        toast("Identity parameters saved.");
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } else toast(data.msg || "Save failed.", "error");
    } catch {
      setMetadata(editMetadata);
      toast("Saved locally (offline mode).", "info");
    } finally {
      setSaveLoading(false);
    }
  };

  const upd = (fn) => setEditMetadata((prev) => fn({ ...prev }));

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast("Passcode must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passcodes do not match.", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", newPassword: newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast("Passcode updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast(data.msg || "Update failed.", "error");
      }
    } catch {
      toast("Server offline. Could not update passcode.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    featured: false,
  });
  const [editingProject, setEditingProject] = useState(null);

  /* ── Inquiries ── */
  const handleMarkRead = async (id) => {
    try {
      await authFetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/contact/inquiries/${id}`,
        { method: "PUT" },
      );
    } catch {}
    setInquiries((p) =>
      p.map((i) => (i._id === id ? { ...i, read: true } : i)),
    );
    toast("Marked as read.", "info");
  };
  const handleDeleteInquiry = async (id) => {
    try {
      await authFetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/contact/inquiries/${id}`,
        { method: "DELETE" },
      );
    } catch {}
    setInquiries((p) => p.filter((i) => i._id !== id));
    toast("Inquiry deleted.", "info");
  };

  /* ── Projects ── */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProject,
      techStack: newProject.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/projects`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      setProjects((p) => [
        res.ok ? data : { ...payload, _id: Date.now().toString() },
        ...p,
      ]);
    } catch {
      setProjects((p) => [{ ...payload, _id: Date.now().toString() }, ...p]);
    }
    setNewProject({
      title: "",
      description: "",
      techStack: "",
      liveLink: "",
      featured: false,
    });
    toast("Project added.");
  };


  const handleDeleteProject = async (id) => {
    try {
      await authFetch(
        `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/projects/${id}`,
        { method: "DELETE" },
      );
    } catch {}
    setProjects((p) => p.filter((pr) => pr._id !== id));
    if (editingProject?.id === id) setEditingProject(null);
    toast("Project deleted.", "info");
  };

  const navTabs = [
    { id: "overview", label: "Overview" },
    {
      id: "inquiries",
      label: "Inquiries",
      badge: inquiries.filter((i) => !i.read).length,
    },
    { id: "projects", label: "Projects" },
    { id: "identity", label: "Identity" },
  ];

  /* ═══ LOGIN PAGE ═══ */
  if (isCheckingAuth) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen admin-theme flex flex-col bg-background text-text-main select-none overflow-hidden relative">
        <ToastContainer toasts={toasts} />

        {/* Top Navbar */}
        <header 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background" 
          style={{ 
            paddingLeft: "var(--space-page-x)",
            paddingRight: "var(--space-page-x)",
            paddingTop: "1.375rem",
            paddingBottom: "1.375rem",
            borderBottom: "1px solid var(--color-border-subtle)" 
          }}
        >
          <div className="flex flex-col justify-center gap-0.5 hover:opacity-70 transition-opacity duration-200 cursor-default">
            <span className="font-sans font-semibold text-[14px] leading-none">Studio OS</span>
            <span className="font-sans text-[10px] tracking-[0.2em] opacity-40 uppercase leading-none">Production Environment</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="font-sans text-[10px] tracking-[0.2em] opacity-40 uppercase hidden md:inline">v2.0</span>
            <div className="pointer-events-auto hover:rotate-90 transition-transform duration-300 flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="absolute inset-0 pointer-events-none admin-bg-effect" />

        <div className="flex-1 flex items-center justify-center relative z-10 w-full pt-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="w-full max-w-[480px] px-6 flex flex-col"
          >
            <div className="flex flex-col text-center">
              <h1 
                className="font-sans font-bold tracking-[-0.05em] leading-[0.9] mb-6"
                style={{ fontSize: "clamp(72px, 7vw, 120px)" }}
              >
                Studio Access
              </h1>
              <p className="font-sans opacity-65 text-[15px] md:text-[16px] max-w-[420px] mx-auto text-balance leading-relaxed">
                Secure entry required for studio operations and content management.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col w-full max-w-[460px] mx-auto mt-10">
              <div className="flex flex-col gap-7">
                <div className="relative group">
                  <label className="text-[11px] uppercase tracking-[0.12em] opacity-40 block mb-2 font-semibold">Identifier</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    className="w-full h-12 bg-transparent border-b outline-none text-lg tracking-wide transition-colors duration-200 placeholder:opacity-40 focus:!border-accent-primary"
                    style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-main)" }}
                    placeholder="Enter username"
                    required
                  />
                </div>
                
                <div className="relative group">
                  <label className="text-[11px] uppercase tracking-[0.12em] opacity-40 block mb-2 font-semibold">Passcode</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full h-12 bg-transparent border-b outline-none text-lg tracking-wide transition-colors duration-200 placeholder:opacity-40 focus:!border-accent-primary"
                    style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-main)" }}
                    placeholder="Enter passcode"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col items-center mt-8">
                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-body-editorial text-sm italic mb-4"
                    style={{ color: "#F43F5E" }}
                  >
                    {loginError}
                  </motion.p>
                )}
                
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-12 group flex items-center justify-between px-6 border rounded-sm transition-all duration-200 hover:bg-accent-primary/5 hover:translate-x-[2px] focus:outline-none"
                  style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-main)" }}
                >
                  <span className="text-[11px] uppercase tracking-[0.12em] font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                    {loginLoading ? "Authenticating..." : "Initialize"}
                  </span>
                  <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                    {loginLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[11px] uppercase tracking-[0.12em] font-semibold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 mt-6 group"
                >
                  <ArrowLeft className="w-3 h-3 transform transition-transform duration-200 group-hover:-translate-x-1" /> Return to Portfolio
                </button>
              </div>
            </form>
          </motion.div>
        </div>

      </div>
    );
  }

  /* ═══ TAB CONTENT ═══ */
  const renderTab = () => {
    /* ── OVERVIEW ── */
    if (activeTab === "overview")
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: EASE_CINEMATIC }}
          className="flex flex-col gap-32 pb-32"
        >
          {/* Massive Stat Row - Cinematic typography, floating numbers */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 pt-12"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            {[
              {
                label: "Inquiries",
                value: inquiries.length,
                sub: "Total received",
              },
              {
                label: "Unread",
                value: inquiries.filter((i) => !i.read).length,
                sub: "Awaiting response",
                accent: true,
              },
              {
                label: "Projects",
                value: projects.length,
                sub: "In repository",
              },
              {
                label: "Identity",
                value: editMetadata?.certifications?.length || 0,
                sub: "Verified credentials",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 1.2,
                  ease: EASE_CINEMATIC,
                }}
              >
                <p className="text-overline opacity-40 tracking-[0.2em] mb-8">
                  {stat.label}
                </p>
                <p
                  className="heading-monumental text-7xl lg:text-8xl tracking-tighter mb-4"
                  style={{
                    color: stat.accent
                      ? "var(--color-accent-primary)"
                      : "var(--color-text-main)",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-body-editorial text-xs italic opacity-40">
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Cinematic Quick Actions & Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            {/* Operations */}
            <div>
              <h3
                className="heading-serif-accent text-3xl md:text-4xl mb-12 opacity-90"
                style={{ color: "var(--color-accent-primary)" }}
              >
                Operations
              </h3>
              <div className="flex flex-col gap-6">
                {[
                  { label: "Edit Identity Metrics", tab: "identity" },
                  { label: "Manage Portfolio Projects", tab: "projects" },
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      act.tab ? setActiveTab(act.tab) : act.action?.()
                    }
                    disabled={act.loading}
                    className="group flex items-center justify-between py-6 transition-[color,background-color,border-color,opacity,transform] duration-200"
                    style={{
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <span className="text-body-editorial text-lg md:text-xl tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">
                      {act.label}
                    </span>
                    {act.loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin opacity-40" />
                    ) : (
                      <ArrowUpRight
                        className="w-5 h-5 opacity-0 -translate-x-4 transition-[color,background-color,border-color,opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                        style={{ color: "var(--color-accent-primary)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Inquiries */}
            <div>
              <div className="flex items-center justify-between mb-12">
                <h3
                  className="heading-serif-accent text-3xl md:text-4xl opacity-90"
                  style={{ color: "var(--color-accent-primary)" }}
                >
                  Communications
                </h3>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-overline tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
                >
                  View All
                </button>
              </div>
              <div className="flex flex-col">
                {inquiries.length === 0 ? (
                  <p className="text-body-editorial italic opacity-40 py-8">
                    Silence in the comms channel.
                  </p>
                ) : (
                  inquiries.slice(0, 3).map((inq, i) => (
                    <div
                      key={i}
                      className="py-8 group transition-colors duration-200 relative"
                      style={{
                        borderBottom: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      {!inq.read && (
                        <div
                          className="absolute left-[-20px] top-[40px] w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--color-accent-primary)" }}
                        />
                      )}
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <p className="text-xl font-medium tracking-tight group-hover:opacity-70 transition-opacity">
                          {inq.name}
                        </p>
                        <p className="text-overline opacity-30">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-body-editorial opacity-50 line-clamp-2">
                        {inq.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );

    /* ── IDENTITY (Profile) ── */
    if (activeTab === "identity" && editMetadata)
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: EASE_CINEMATIC }}
          className="flex flex-col gap-24 pb-32 max-w-4xl"
        >
          <div className="pt-12">
            <h2 className="heading-monumental text-6xl md:text-8xl tracking-tighter mb-8">
              Identity.
            </h2>
            <p className="text-body-editorial text-lg opacity-50 italic max-w-2xl">
              The core metadata driving the atmospheric portfolio experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <Field label="Full Name">
              <input
                type="text"
                value={editMetadata.name || ""}
                onChange={(e) => upd((p) => ({ ...p, name: e.target.value }))}
                className={inputCls}
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-text-main)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor =
                    "var(--color-border-subtle)")
                }
              />
            </Field>
            <Field label="Professional Title">
              <input
                type="text"
                value={editMetadata.title || ""}
                onChange={(e) => upd((p) => ({ ...p, title: e.target.value }))}
                className={inputCls}
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-text-main)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor =
                    "var(--color-border-subtle)")
                }
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Hero Statement (Homepage)">
                <input
                  type="text"
                  value={editMetadata.heroText || ""}
                  onChange={(e) =>
                    upd((p) => ({ ...p, heroText: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-text-main)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-border-subtle)")
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Personal Biography (About Section)">
                <textarea
                  rows="3"
                  value={editMetadata.bio || ""}
                  onChange={(e) => upd((p) => ({ ...p, bio: e.target.value }))}
                  className={textareaCls}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-text-main)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-border-subtle)")
                  }
                />
              </Field>
            </div>
          </div>

          <div>
            <h3
              className="heading-serif-accent text-4xl mb-12"
              style={{ color: "var(--color-accent-primary)" }}
            >
              Coordinates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <Field label="Availability Status">
                <input
                  type="text"
                  value={editMetadata.availability || ""}
                  onChange={(e) =>
                    upd((p) => ({ ...p, availability: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-text-main)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "var(--color-border-subtle)")
                  }
                />
              </Field>
              {[
                { label: "Email Address", field: "email", type: "email" },
                { label: "Phone Number", field: "phone", type: "text" },
                { label: "Location", field: "location", type: "text" },
              ].map((f) => (
                <Field key={f.field} label={f.label}>
                  <input
                    type={f.type}
                    value={editMetadata.contact?.[f.field] || ""}
                    onChange={(e) =>
                      upd((p) => ({
                        ...p,
                        contact: { ...p.contact, [f.field]: e.target.value },
                      }))
                    }
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderBottomColor =
                        "var(--color-text-main)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottomColor =
                        "var(--color-border-subtle)")
                    }
                  />
                </Field>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="heading-serif-accent text-4xl mb-12"
              style={{ color: "var(--color-accent-primary)" }}
            >
              Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <Field label="New Administrative Passcode">
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-text-main)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "var(--color-border-subtle)")}
                />
              </Field>
              <Field label="Confirm Passcode">
                <input
                  type="password"
                  placeholder="Re-enter passcode"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-text-main)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "var(--color-border-subtle)")}
                />
              </Field>
              <div className="md:col-span-2 flex justify-start">
                <button
                  onClick={handleUpdatePassword}
                  disabled={passwordLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="h-12 px-8 flex items-center justify-center border transition-all duration-300 hover:bg-accent-primary/10 disabled:opacity-30 disabled:hover:bg-transparent"
                  style={{ borderColor: "var(--color-border-subtle)" }}
                >
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold">
                    {passwordLoading ? "Updating..." : "Update Passcode"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="flex justify-end pt-12"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            <SaveBtn loading={saveLoading} onClick={handleSaveMetadata} />
          </div>
        </motion.div>
      );

    /* ── INQUIRIES ── */
    if (activeTab === "inquiries")
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: EASE_CINEMATIC }}
          className="flex flex-col gap-16 pb-32 max-w-5xl"
        >
          <div className="pt-12">
            <h2 className="heading-monumental text-6xl md:text-8xl tracking-tighter mb-8">
              Communications.
            </h2>
            <p className="text-body-editorial text-lg opacity-50 italic max-w-2xl">
              Manage client inquiries and project requests.
            </p>
          </div>

          <div className="flex flex-col">
            {inquiries.length === 0 ? (
              <p className="text-body-editorial italic opacity-40 py-8">
                The inbox is currently empty.
              </p>
            ) : (
              inquiries.map((inq, i) => (
                <div
                  key={inq._id || i}
                  className="py-12 group transition-colors duration-200 relative flex flex-col md:flex-row items-start gap-8 md:gap-16"
                  style={{
                    borderBottom: "1px solid var(--color-border-subtle)",
                  }}
                >
                  {!inq.read && (
                    <div
                      className="absolute left-[-20px] top-[55px] w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--color-accent-primary)" }}
                    />
                  )}

                  <div className="w-full md:w-1/3 shrink-0">
                    <p className="text-2xl font-medium tracking-tight mb-2 group-hover:opacity-70 transition-opacity">
                      {inq.name}
                    </p>
                    <p className="text-body-editorial text-sm opacity-60 font-mono mb-4">
                      {inq.email}
                    </p>
                    <p className="text-overline opacity-30">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-body-editorial text-lg opacity-80 leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 md:flex-col md:items-end w-full md:w-auto mt-6 md:mt-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    {!inq.read && (
                      <button
                        onClick={() => handleMarkRead(inq._id)}
                        className="text-overline tracking-[0.2em] hover:text-accent-primary transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteInquiry(inq._id)}
                      className="text-overline tracking-[0.2em] hover:text-rose-400 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      );

    /* ── PROJECTS ── */
    if (activeTab === "projects")
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: EASE_CINEMATIC }}
          className="flex flex-col gap-24 pb-32"
        >
          <div className="pt-12">
            <h2 className="heading-monumental text-6xl md:text-8xl tracking-tighter mb-8">
              Projects.
            </h2>
            <p className="text-body-editorial text-lg opacity-50 italic max-w-2xl">
              Manage portfolio case studies and featured works.
            </p>
          </div>

          {/* Create Form */}
          <div>
            <h3
              className="heading-serif-accent text-3xl mb-8"
              style={{ color: "var(--color-accent-primary)" }}
            >
              New Project
            </h3>
            <form
              onSubmit={handleCreateProject}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl"
            >
              <Field label="Project Title">
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </Field>
              <Field label="Tech Stack (comma separated)">
                <input
                  type="text"
                  value={newProject.techStack}
                  onChange={(e) =>
                    setNewProject({ ...newProject, techStack: e.target.value })
                  }
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    rows="3"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className={textareaCls}
                    style={inputStyle}
                    required
                  />
                </Field>
              </div>
              <Field label="Live URL">
                <input
                  type="url"
                  value={newProject.liveLink}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveLink: e.target.value })
                  }
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>

              <div
                className="md:col-span-2 flex items-center justify-between mt-8"
                style={{
                  borderTop: "1px solid var(--color-border-subtle)",
                  paddingTop: "2rem",
                }}
              >
                <label className="flex items-center gap-4 cursor-pointer text-overline tracking-[0.2em] group">
                  <input
                    type="checkbox"
                    checked={newProject.featured}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        featured: e.target.checked,
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded border flex items-center justify-center transition-all group-hover:border-text-main"
                    style={{
                      borderColor: newProject.featured
                        ? "var(--color-text-main)"
                        : "var(--color-border-subtle)",
                      background: newProject.featured
                        ? "var(--color-text-main)"
                        : "transparent",
                    }}
                  >
                    {newProject.featured && (
                      <CheckCircle2
                        className="w-3 h-3"
                        style={{ color: "var(--color-bg-base)" }}
                      />
                    )}
                  </div>
                  Feature on Homepage
                </label>
                <SaveBtn label="Add Project" onClick={handleCreateProject} />
              </div>
            </form>
          </div>

          {/* Project List */}
          <div>
            <h3
              className="heading-serif-accent text-3xl mb-8 mt-12"
              style={{ color: "var(--color-accent-primary)" }}
            >
              Repository
            </h3>
            <div className="flex flex-col">
              {projects.length === 0 ? (
                <p className="text-body-editorial italic opacity-40 py-8">
                  No projects currently tracked.
                </p>
              ) : (
                projects.map((p, i) => (
                  <div
                    key={p._id || i}
                    className="py-10 group transition-colors duration-200 flex flex-col md:flex-row items-start gap-8 md:gap-16"
                    style={{
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="text-3xl font-bold tracking-tight">
                          {p.title}
                        </h4>
                        {p.featured && (
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border opacity-60"
                            style={{
                              borderColor: "var(--color-accent-primary)",
                              color: "var(--color-accent-primary)",
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-body-editorial opacity-60 mb-6 max-w-2xl">
                        {p.description}
                      </p>
                      {Array.isArray(p.techStack) && (
                        <div className="flex flex-wrap gap-3">
                          {p.techStack.map((t, ti) => (
                            <span
                              key={ti}
                              className="text-[10px] font-mono tracking-wide opacity-50 uppercase"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 md:flex-col md:items-end w-full md:w-auto opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="text-overline tracking-[0.2em] hover:text-rose-400 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      );
  };

  /* ═══ MAIN LAYOUT ═══ */
  return (
    <div className="min-h-screen admin-theme bg-background text-text-main font-sans selection:bg-accent-primary selection:text-bg-base overflow-x-hidden relative transition-colors duration-200">
      <ToastContainer toasts={toasts} />


      {/* Floating Header Navigation */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-colors duration-200 bg-background border-b"
        style={{
          paddingLeft: "var(--space-page-x)",
          paddingRight: "var(--space-page-x)",
          paddingTop: "1.375rem",
          paddingBottom: "1.375rem",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleClose}
            className="text-[0.85rem] uppercase tracking-[0.25em] font-semibold text-text-main hover:text-accent-primary transition-colors duration-500"
          >
            Studio{" "}
            <span
              className="font-serif-italic font-normal text-accent-primary normal-case tracking-normal"
              style={{ fontSize: "0.8rem" }}
            >
              / os
            </span>
          </button>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-8 md:gap-12">
          <div className="hidden md:flex items-center gap-4 text-overline opacity-40 tracking-[0.2em]">
            <span>
              {time.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-overline tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-rose-400 transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="relative z-10 min-h-[100svh] flex flex-col"
        style={{
          paddingLeft: "var(--space-page-x)",
          paddingRight: "var(--space-page-x)",
          paddingTop: "12rem",
        }}
      >
        {/* Editorial Navigation Tabs */}
        <nav
          className="flex items-center gap-10 md:gap-16 mb-16 overflow-x-auto no-scrollbar"
          style={{ paddingBottom: "1rem" }}
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative text-overline tracking-[0.25em] transition-[color,background-color,border-color,opacity,transform] duration-200 whitespace-nowrap flex items-center gap-3"
                style={{
                  color: isActive
                    ? "var(--color-text-main)"
                    : "var(--color-text-muted)",
                  opacity: isActive ? 1 : 0.4,
                }}
              >
                {tab.label}
                {tab.badge > 0 && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--color-accent-primary)" }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-4 left-0 right-0 h-[1px]"
                    style={{ background: "var(--color-text-main)" }}
                    transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Injection */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}>{renderTab()}</motion.div>
          </AnimatePresence>
        </div>

        {/* Cinematic Footer */}
        <footer
          className="py-12 mt-auto"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-overline opacity-30">
            <p>Studio OS v2.0</p>
            <p>System Online</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
