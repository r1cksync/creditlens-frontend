import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function fetchApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = Cookies.get("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    Cookies.remove("access_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.detail || data.error || "Request failed", response.status, data);
  }

  return data;
}

// Auth
export const auth = {
  signup: (body: { email: string; full_name: string; password: string }) =>
    fetchApi("/auth/signup", { method: "POST", body: JSON.stringify(body), skipAuth: true }),

  login: (body: { email: string; password: string }) =>
    fetchApi("/auth/login", { method: "POST", body: JSON.stringify(body), skipAuth: true }),

  me: () => fetchApi("/auth/me"),

  refresh: () => fetchApi("/auth/refresh", { method: "POST" }),
};

// Analysis
export const analysis = {
  start: (body: any) =>
    fetchApi("/analysis/start", { method: "POST", body: JSON.stringify(body) }),

  getStatus: (sessionId: string) =>
    fetchApi(`/analysis/${sessionId}/status`),

  getReport: (sessionId: string) =>
    fetchApi(`/analysis/${sessionId}/report`),

  getReportPdf: (sessionId: string) =>
    fetchApi(`/analysis/${sessionId}/report/pdf`),

  respond: (sessionId: string, body: { question_id: string; response: string }) =>
    fetchApi(`/analysis/${sessionId}/respond`, { method: "POST", body: JSON.stringify(body) }),

  history: (skip = 0, limit = 20) =>
    fetchApi(`/analysis/history?skip=${skip}&limit=${limit}`),

  streamUrl: (sessionId: string) => {
    const token = Cookies.get("access_token");
    return `${API_URL}/api/v1/analysis/${sessionId}/stream?token=${token}`;
  },
};

// Documents
export const documents = {
  upload: (file: File, documentType: string, description: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType);
    formData.append("description", description);
    return fetchApi("/documents/upload", { method: "POST", body: formData });
  },

  get: (documentId: string) =>
    fetchApi(`/documents/${documentId}`),

  delete: (documentId: string) =>
    fetchApi(`/documents/${documentId}`, { method: "DELETE" }),

  list: (skip = 0, limit = 20, documentType?: string) => {
    let url = `/documents/list?skip=${skip}&limit=${limit}`;
    if (documentType) url += `&document_type=${documentType}`;
    return fetchApi(url);
  },
};

// Admin
export const admin = {
  createEmployee: (body: any) =>
    fetchApi("/admin/employees", { method: "POST", body: JSON.stringify(body) }),

  listEmployees: () => fetchApi("/admin/employees"),

  removeEmployee: (userId: string) =>
    fetchApi(`/admin/employees/${userId}`, { method: "DELETE" }),

  getAnalytics: () => fetchApi("/admin/analytics"),

  getPortfolio: () => fetchApi("/admin/portfolio"),

  triggerKbUpdate: () =>
    fetchApi("/admin/kb/trigger", { method: "POST" }),

  getKbStats: () => fetchApi("/admin/kb/stats"),

  getRegulatoryAlerts: (skip = 0, limit = 50) =>
    fetchApi(`/admin/regulatory-alerts?skip=${skip}&limit=${limit}`),

  getCreditPolicies: () => fetchApi("/admin/credit-policies"),

  updateCreditPolicy: (policy: any) =>
    fetchApi("/admin/credit-policies", { method: "POST", body: JSON.stringify(policy) }),

  getAuditLogs: (skip = 0, limit = 50) =>
    fetchApi(`/admin/audit-logs?skip=${skip}&limit=${limit}`),
};

// Employee
export const employee = {
  getQueue: (status = "completed", skip = 0, limit = 20) =>
    fetchApi(`/employee/queue?status=${status}&skip=${skip}&limit=${limit}`),

  getAnalysis: (sessionId: string) =>
    fetchApi(`/employee/analysis/${sessionId}`),

  submitReview: (sessionId: string, body: any) =>
    fetchApi(`/employee/analysis/${sessionId}/review`, { method: "POST", body: JSON.stringify(body) }),

  getStats: () => fetchApi("/employee/stats"),

  multiCompare: (sessionIds: string[]) =>
    fetchApi(`/employee/multi-compare?session_ids=${sessionIds.join(",")}`),
};

// Analytics
export const analytics = {
  dashboard: () => fetchApi("/analytics/dashboard"),
  agents: () => fetchApi("/analytics/agents"),
  kbHealth: () => fetchApi("/analytics/kb-health"),
  groqUsage: () => fetchApi("/analytics/groq-usage"),
  creditScoreTrends: (companyName?: string) =>
    fetchApi(`/analytics/credit-score-trends${companyName ? `?company_name=${companyName}` : ""}`),
  kbSearch: (query: string, limit = 10) =>
    fetchApi(`/analytics/kb-search?query=${encodeURIComponent(query)}&limit=${limit}`),
};

// Chat
export const chat = {
  createSession: (body: { title?: string; analysis_id?: string }) =>
    fetchApi("/chat/sessions", { method: "POST", body: JSON.stringify(body) }),

  sendMessage: (sessionId: string, message: string) =>
    fetchApi(`/chat/sessions/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  listSessions: (skip = 0, limit = 20) =>
    fetchApi(`/chat/sessions?skip=${skip}&limit=${limit}`),

  getSession: (sessionId: string) =>
    fetchApi(`/chat/sessions/${sessionId}`),
};

export { ApiError };
export default fetchApi;
