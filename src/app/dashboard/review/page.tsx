"use client";

import { useEffect, useState } from "react";
import { employee } from "@/lib/api";
import Card, { CardTitle } from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getRatingColor, timeAgo, getRiskColor } from "@/lib/utils";
import Link from "next/link";
import { Eye, CheckCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewQueuePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({ decision: "", comments: "" });

  useEffect(() => {
    employee.getQueue("completed").then((res) => {
      setItems(res.data?.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const submitReview = async (sessionId: string) => {
    try {
      await employee.submitReview(sessionId, reviewData);
      toast.success("Review submitted");
      setReviewModal(null);
      setReviewData({ decision: "", comments: "" });
      const res = await employee.getQueue("completed");
      setItems(res.data?.items || []);
    } catch (err: any) {
      toast.error(err.message || "Review failed");
    }
  };

  if (loading) return <LoadingSpinner message="Loading review queue..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Review Queue</h1>
        <p className="text-muted-foreground font-body mt-1">Review and approve credit analyses</p>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Company</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Risk Score</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Reviewed</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Created</th>
                <th className="text-right py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.session_id} className="border-b border-border-light hover:bg-muted transition-colors duration-100">
                  <td className="py-3 px-4 font-medium">{item.company_name}</td>
                  <td className={`py-3 px-4 font-bold font-mono ${getRatingColor(item.credit_rating || "")}`}>
                    {item.credit_rating || "—"}
                  </td>
                  <td className={`py-3 px-4 font-medium font-mono ${getRiskColor(item.composite_risk_score || 0)}`}>
                    {item.composite_risk_score?.toFixed(1) || "—"}
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                  <td className="py-3 px-4">
                    {item.reviewed ? (
                      <CheckCircle size={16} strokeWidth={1.5} className="text-foreground" />
                    ) : (
                      <AlertTriangle size={16} strokeWidth={1.5} className="text-muted-foreground" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{timeAgo(item.created_at)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/analysis/${item.session_id}`}>
                        <Button variant="ghost" size="sm"><Eye size={16} strokeWidth={1.5} /></Button>
                      </Link>
                      {!item.reviewed && (
                        <Button size="sm" onClick={() => setReviewModal(item.session_id)}>
                          Review
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-body italic">No analyses pending review</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <Card className="w-full max-w-md bg-background">
            <CardTitle>Review Analysis</CardTitle>
            <hr className="border-t border-foreground my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["approve", "reject", "escalate"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setReviewData((p) => ({ ...p, decision: d }))}
                      className={`px-3 py-2 text-sm border-2 uppercase tracking-widest font-mono transition-colors duration-100 ${
                        reviewData.decision === d
                          ? "bg-foreground text-background border-foreground"
                          : "border-border-light text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Comments</label>
                <textarea
                  value={reviewData.comments}
                  onChange={(e) => setReviewData((p) => ({ ...p, comments: e.target.value }))}
                  className="w-full mt-2 px-4 py-3 bg-transparent border-0 border-b-2 border-foreground text-foreground font-body min-h-[100px] focus:outline-none focus:border-b-[4px] placeholder:italic placeholder:text-muted-foreground"
                  placeholder="Add review comments..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setReviewModal(null)}>Cancel</Button>
                <Button
                  onClick={() => submitReview(reviewModal)}
                  disabled={!reviewData.decision || reviewData.comments.length < 10}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
