"use client";

import Link from "next/link";
import { Shield, Brain, BarChart3, FileSearch, Zap, Lock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "18 AI Agents",
    description: "Autonomous multi-agent system powered by LangGraph for comprehensive credit analysis",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Monte Carlo simulations, DCF modeling, Altman Z-Score, and Ohlson O-Score",
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description: "AWS Textract OCR with automatic financial data extraction from any document format",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description: "Benford's Law analysis, revenue-cashflow divergence, and anomaly detection",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "SSE streaming of agent progress with live updates and interactive Q&A",
  },
  {
    icon: Lock,
    title: "RBI Compliance",
    description: "Built-in regulatory checks aligned with RBI IRAC norms and Basel III requirements",
  },
];

const stats = [
  { value: "18", label: "AI Agents" },
  { value: "99.1%", label: "Accuracy" },
  { value: "<3s", label: "Avg. Latency" },
  { value: "100%", label: "RBI Compliant" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} strokeWidth={1.5} className="text-foreground" />
            <span className="text-lg font-display font-bold tracking-tight uppercase">CreditLens</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-body text-muted-foreground hover:text-foreground hover:underline transition-colors duration-100"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-foreground text-background text-xs font-medium uppercase tracking-widest hover:bg-background hover:text-foreground border-2 border-foreground transition-colors duration-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 md:pb-32 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Decorative element */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-16 bg-foreground" />
            <div className="w-3 h-3 border-2 border-foreground" />
          </div>

          <h1 className="font-display font-bold tracking-tighter leading-none mb-8">
            <span className="block text-5xl md:text-7xl lg:text-8xl">Credit</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl italic">Analysis</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl">Redefined</span>
          </h1>

          <div className="max-w-xl">
            <p className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed mb-10">
              Production-grade multi-agent platform that transforms banking credit analysis
              with 18 specialized AI agents, real-time processing, and regulatory compliance.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-foreground text-background text-xs font-medium uppercase tracking-widest hover:bg-background hover:text-foreground border-2 border-foreground transition-colors duration-100 inline-flex items-center gap-2"
              >
                Start Analysis <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-transparent text-foreground text-xs font-medium uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                Employee Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Thick divider */}
      <hr className="border-0 border-t-[8px] border-foreground" />

      {/* Stats section — inverted */}
      <section className="bg-foreground text-background py-20 md:py-24 relative overflow-hidden">
        {/* Subtle vertical line texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 1px, #fff 1px, #fff 2px)",
            backgroundSize: "4px 100%",
            opacity: 0.03,
          }}
        />
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl md:text-6xl font-display font-bold tracking-tighter leading-none mb-2">
                  {stat.value}
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-background/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thick divider */}
      <hr className="border-0 border-t-[4px] border-foreground" />

      {/* Features Grid */}
      <section className="py-24 md:py-32 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-16">
            Platform Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-foreground">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-8 border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors duration-100 cursor-default"
              >
                <feature.icon size={20} strokeWidth={1.5} className="mb-6" />
                <h3 className="text-base font-display font-semibold tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm font-body leading-relaxed opacity-60 group-hover:opacity-80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thick divider */}
      <hr className="border-0 border-t-[4px] border-foreground" />

      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            &copy; {new Date().getFullYear()} CreditLens
          </p>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Multi-Agent Banking Credit Analysis Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
