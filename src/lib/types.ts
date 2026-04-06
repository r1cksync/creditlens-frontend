export type UserRole = "customer" | "employee" | "admin";

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  created_at: string;
}

export interface AnalysisSession {
  id: string;
  company_name: string;
  company_type?: string;
  industry_sector?: string;
  annual_revenue?: number;
  loan_amount_requested?: number;
  loan_purpose?: string;
  status: AnalysisStatus;
  agent_progress: AgentProgress[];
  final_report?: CreditReport;
  employee_review?: EmployeeReview;
  created_at: string;
  completed_at?: string;
}

export type AnalysisStatus =
  | "in_progress"
  | "waiting_user_input"
  | "completed"
  | "failed"
  | "under_review"
  | "approved"
  | "rejected";

export interface AgentProgress {
  agent_name: string;
  status: "pending" | "running" | "completed" | "error" | "skipped";
  duration_seconds?: number;
  message?: string;
}

export interface CreditReport {
  session_id: string;
  company_name: string;
  executive_summary: string;
  financial_metrics: FinancialMetrics;
  risk_assessment: RiskAssessment;
  compliance_report: ComplianceReport;
  forecasting: ForecastResult;
  benchmarking: BenchmarkResult;
  fraud_report: FraudReport;
  sentiment: SentimentResult;
  recommendation: string;
  explainability: ExplainabilityReport;
}

export interface FinancialMetrics {
  current_ratio: number;
  quick_ratio: number;
  cash_ratio: number;
  debt_to_equity: number;
  debt_to_assets: number;
  interest_coverage: number;
  dscr: number;
  gross_profit_margin: number;
  net_profit_margin: number;
  return_on_assets: number;
  return_on_equity: number;
  asset_turnover: number;
  inventory_turnover: number;
  receivables_turnover: number;
  altman_z_score: number;
  ohlson_o_score: number;
  [key: string]: number;
}

export interface RiskAssessment {
  probability_of_default: number;
  loss_given_default: number;
  exposure_at_default: number;
  expected_loss: number;
  credit_rating: string;
  composite_risk_score: number;
  quantitative_score: number;
  qualitative_score: number;
  macro_score: number;
}

export interface ComplianceReport {
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  checks: ComplianceCheck[];
  priority_sector: boolean;
  restructuring_eligible: boolean;
}

export interface ComplianceCheck {
  name: string;
  status: "pass" | "fail" | "warning";
  value: number;
  threshold: number;
  message: string;
}

export interface ForecastResult {
  revenue_forecast: number[];
  dcf_valuation: number;
  var_95: number;
  var_99: number;
  cvar_95: number;
  stress_tests: StressTest[];
}

export interface StressTest {
  scenario: string;
  dscr: number;
  default_probability: number;
}

export interface BenchmarkResult {
  sector: string;
  percentile_rankings: Record<string, number>;
  peer_comparisons: Record<string, number>;
  narrative: string;
}

export interface FraudReport {
  overall_score: number;
  signals: FraudSignal[];
  benford_analysis: {
    chi_square: number;
    p_value: number;
    result: string;
  };
}

export interface FraudSignal {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  description: string;
}

export interface SentimentResult {
  overall_sentiment: string;
  sentiment_score: number;
  news_items: Array<{ title: string; sentiment: string; source: string }>;
  macro_risk_factor: number;
}

export interface ExplainabilityReport {
  feature_importance: Record<string, number>;
  decision_path: string[];
  confidence_score: number;
}

export interface EmployeeReview {
  reviewer_id: string;
  reviewer_name: string;
  decision: "approve" | "reject" | "escalate";
  comments: string;
  override_rating?: string;
  reviewed_at: string;
}

export interface Document {
  document_id: string;
  filename: string;
  document_type: string;
  description?: string;
  status: string;
  file_size: number;
  version: number;
  download_url?: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface ChatSession {
  _id: string;
  user_id: string;
  title: string;
  analysis_id?: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  total_analyses: number;
  completed_analyses: number;
  failed_analyses: number;
  in_progress_analyses: number;
  success_rate: number;
  total_users: number;
  total_documents: number;
  recent_analyses: any[];
  system_analytics: any;
}

export interface PortfolioData {
  pd_distribution: Record<string, number>;
  sector_concentration: Record<string, number>;
  hhi: number;
  rating_distribution: Record<string, number>;
  total_exposure: number;
  avg_pd: number;
}
