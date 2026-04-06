"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/api";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, AlertTriangle, PieChart as PieIcon, Shield } from "lucide-react";

const MONO_SHADES = ["#000000", "#333333", "#555555", "#777777", "#999999", "#BBBBBB", "#DDDDDD", "#E5E5E5"];

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.getPortfolio().then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading portfolio analytics..." />;
  if (!data) return <div className="text-muted-foreground text-center py-12 font-body italic">No portfolio data available</div>;

  const sectorData = Object.entries(data.sector_concentration || {}).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  const ratingData = Object.entries(data.rating_distribution || {}).map(([name, value]) => ({
    name,
    count: value as number,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground font-body mt-1">Portfolio-level risk and concentration analysis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-foreground">
        <div className="p-4 border-r border-foreground last:border-r-0 hover:bg-foreground hover:text-background transition-colors duration-100">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Exposure</p>
          <p className="text-2xl font-display font-bold mt-1">
            {data.total_exposure ? `₹${(data.total_exposure / 10_000_000).toFixed(1)} Cr` : "N/A"}
          </p>
        </div>
        <div className="p-4 border-r border-foreground hover:bg-foreground hover:text-background transition-colors duration-100">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Avg PD</p>
          <p className="text-2xl font-display font-bold mt-1">
            {data.avg_pd ? `${(data.avg_pd * 100).toFixed(2)}%` : "N/A"}
          </p>
        </div>
        <div className="p-4 border-r border-foreground hover:bg-foreground hover:text-background transition-colors duration-100">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">HHI Index</p>
          <p className="text-2xl font-display font-bold mt-1">
            {data.hhi?.toFixed(0) || "N/A"}
            <span className="text-xs font-mono text-muted-foreground ml-1">
              {data.hhi > 2500 ? "(Concentrated)" : data.hhi > 1500 ? "(Moderate)" : "(Diversified)"}
            </span>
          </p>
        </div>
        <div className="p-4 hover:bg-foreground hover:text-background transition-colors duration-100">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Active Analyses</p>
          <p className="text-2xl font-display font-bold mt-1">{data.total_analyses || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle><PieIcon size={20} strokeWidth={1.5} className="inline mr-2" />Sector Concentration</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label stroke="#FFFFFF" strokeWidth={2}>
                  {sectorData.map((_, idx) => (
                    <Cell key={idx} fill={MONO_SHADES[idx % MONO_SHADES.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "2px solid #000000", borderRadius: "0px", fontFamily: "'Source Serif 4'" }} />
                <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", textTransform: "uppercase" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Shield size={20} strokeWidth={1.5} className="inline mr-2" />Rating Distribution</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="name" tick={{ fill: "#000000", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
                <YAxis tick={{ fill: "#525252", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "2px solid #000000", borderRadius: "0px", fontFamily: "'Source Serif 4'" }} />
                <Bar dataKey="count" fill="#000000" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
