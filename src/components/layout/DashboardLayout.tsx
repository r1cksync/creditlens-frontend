"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { auth } from "@/lib/api";
import type { User } from "@/lib/types";
import {
  Shield, LayoutDashboard, FileSearch, BarChart3, Users,
  Settings, LogOut, MessageSquare, ChevronLeft, ChevronRight,
  Brain, AlertTriangle, FileText, TrendingUp, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["customer", "employee", "admin"] },
  { label: "New Analysis", href: "/dashboard/analysis/new", icon: Brain, roles: ["customer", "employee", "admin"] },
  { label: "History", href: "/dashboard/history", icon: FileText, roles: ["customer", "employee", "admin"] },
  { label: "Documents", href: "/dashboard/documents", icon: FileSearch, roles: ["customer", "employee", "admin"] },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare, roles: ["customer", "employee", "admin"] },
  { label: "Review Queue", href: "/dashboard/review", icon: AlertTriangle, roles: ["employee", "admin"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["employee", "admin"] },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: TrendingUp, roles: ["admin"] },
  { label: "Employees", href: "/dashboard/employees", icon: Users, roles: ["admin"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    auth.me().then((res) => {
      setUser(res.data);
      setLoading(false);
    }).catch(() => {
      Cookies.remove("access_token");
      router.push("/login");
    });
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin w-6 h-6 border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  const filteredNav = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-background border-r-2 border-foreground flex flex-col transition-all duration-100",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b-2 border-foreground">
          <Shield size={20} strokeWidth={1.5} className="text-foreground flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-display font-bold tracking-tight uppercase">CreditLens</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 mx-2 text-sm transition-colors duration-100",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon size={18} strokeWidth={1.5} className="flex-shrink-0" />
                {!collapsed && <span className="font-body">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t-2 border-foreground">
          {!collapsed && user && (
            <div className="mb-3">
              <p className="text-sm font-display font-medium truncate">{user.full_name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-mono uppercase tracking-widest border border-foreground">
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-100"
          >
            <LogOut size={16} strokeWidth={1.5} />
            {!collapsed && <span className="font-body">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-2 border-t-2 border-foreground text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={cn("flex-1 transition-all duration-100", collapsed ? "lg:ml-16" : "lg:ml-64")}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border-light px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
