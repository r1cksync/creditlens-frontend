"use client";

import { CreditReport } from "@/lib/types";
import { formatCurrency, formatPercent, formatNumber, getRatingColor, getRiskColor } from "@/lib/utils";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const MONO_SHADES = ["#000000", "#555555", "#999999"];

interface ReportViewProps {
  report: CreditReport;
}

export default function ReportView({ report }: ReportViewProps) {
  const { risk_assessment, financial_metrics, compliance_report, forecasting, fraud_report, sentiment } = report;

  const radarData = [
    { metric: "Liquidity", value: Math.min(100, (financial_metrics.current_ratio / 3) * 100) },
    { metric: "Solvency", value: Math.min(100, (1 / Math.max(0.1, financial_metrics.debt_to_equity)) * 100) },
    { metric: "Profitability", value: Math.min(100, financial_metrics.net_profit_margin * 500) },
    { metric: "Efficiency", value: Math.min(100, financial_metrics.asset_turnover * 50) },
    { metric: "Coverage", value: Math.min(100, (financial_metrics.dscr / 3) * 100) },
    { metric: "Growth", value: Math.min(100, financial_metrics.return_on_equity * 300) },
  ];

  const compliancePie = compliance_report ? [
    { name: "Passed", value: compliance_report.passed, color: "#000000" },
    { name: "Failed", value: compliance_report.failed, color: "#999999" },
    { name: "Warnings", value: compliance_report.warnings, color: "#DDDDDD" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-display font-bold ${getRatingColor(risk_assessment.credit_rating)}`}>
              {risk_assessment.credit_rating}
            </span>
            <span className={`text-lg font-mono font-semibold ${getRiskColor(risk_assessment.composite_risk_score)}`}>
              Risk: {risk_assessment.composite_risk_score.toFixed(1)}
            </span>
          </div>
        </CardHeader>
        <p className="text-muted-foreground font-body leading-relaxed">{report.executive_summary}</p>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-foreground">
        <MetricCard label="PD" value={formatPercent(risk_assessment.probability_of_default)} />
        <MetricCard label="LGD" value={formatPercent(risk_assessment.loss_given_default)} />
        <MetricCard label="EAD" value={formatCurrency(risk_assessment.exposure_at_default)} />
        <MetricCard label="Expected Loss" value={formatCurrency(risk_assessment.expected_loss)} />
      </div>

      {/* Financial Radar + Key Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Financial Health Radar</CardTitle>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#000000", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#525252" }} />
                <Radar dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Key Financial Ratios</CardTitle>
          <div className="mt-4 space-y-3">
            <RatioRow label="Current Ratio" value={financial_metrics.current_ratio} benchmark={1.5} />
            <RatioRow label="DSCR" value={financial_metrics.dscr} benchmark={1.25} />
            <RatioRow label="Debt/Equity" value={financial_metrics.debt_to_equity} benchmark={2.0} inverted />
            <RatioRow label="Interest Coverage" value={financial_metrics.interest_coverage} benchmark={3.0} />
            <RatioRow label="ROE" value={financial_metrics.return_on_equity * 100} benchmark={15} suffix="%" />
            <RatioRow label="Altman Z-Score" value={financial_metrics.altman_z_score} benchmark={2.99} />
            <RatioRow label="Net Margin" value={financial_metrics.net_profit_margin * 100} benchmark={10} suffix="%" />
          </div>
        </Card>
      </div>

      {/* Compliance */}
      {compliance_report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardTitle>Compliance Summary</CardTitle>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={compliancePie} dataKey="value" cx="50%" cy="50%" outerRadius={80} label stroke="#FFFFFF" strokeWidth={2}>
                    {compliancePie.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", textTransform: "uppercase" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "2px solid #000000", borderRadius: "0px", fontFamily: "'Source Serif 4'" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardTitle>Compliance Checks</CardTitle>
            <div className="mt-4 space-y-0 max-h-64 overflow-y-auto">
              {compliance_report.checks?.map((check, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                  <span className="text-sm font-body">{check.name}</span>
                  <span className={`text-xs font-mono uppercase tracking-widest px-2 py-0.5 border ${
                    check.status === "pass" ? "border-foreground text-foreground" :
                    check.status === "fail" ? "bg-foreground text-background" :
                    "border-border-light text-muted-foreground"
                  }`}>
                    {check.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Fraud Detection */}
      {fraud_report && (
        <Card>
          <CardHeader>
            <CardTitle>Fraud Detection</CardTitle>
            <span className="text-lg font-mono font-bold">
              Score: {(fraud_report.overall_score * 100).toFixed(0)}%
            </span>
          </CardHeader>
          {fraud_report.signals?.length > 0 && (
            <div className="space-y-2">
              {fraud_report.signals.map((signal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border-light">
                  <span className={`w-2 h-2 ${
                    signal.severity === "critical" || signal.severity === "high" ? "bg-foreground" : "bg-muted-foreground"
                  }`} />
                  <span className="text-sm font-body flex-1">{signal.description}</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{signal.severity}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Recommendation */}
      <Card inverted>
        <CardTitle>Recommendation</CardTitle>
        <p className="mt-3 font-body leading-relaxed">{report.recommendation}</p>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border-r border-foreground last:border-r-0 text-center hover:bg-foreground hover:text-background transition-colors duration-100">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-display font-bold">{value}</p>
    </div>
  );
}

function RatioRow({
  label, value, benchmark, inverted = false, suffix = "",
}: {
  label: string; value: number; benchmark: number; inverted?: boolean; suffix?: string;
}) {
  const isGood = inverted ? value <= benchmark : value >= benchmark;
  return (
    <div className="flex items-center justify-between py-1 border-b border-border-light last:border-0">
      <span className="text-sm text-muted-foreground font-body">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-mono font-bold ${isGood ? "text-foreground" : "text-muted-foreground"}`}>
          {formatNumber(value)}{suffix}
        </span>
        <span className="text-xs font-mono text-muted-foreground">(bench: {benchmark}{suffix})</span>
      </div>
    </div>
  );
}
