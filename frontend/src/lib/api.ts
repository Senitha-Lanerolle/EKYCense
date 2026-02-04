const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// ----------------------------
// Types
// ----------------------------
export type ReviewStatus = "OPEN" | "IN_REVIEW" | "CLEARED" | "REJECTED";
export type Decision = "MATCH" | "PARTIAL_MATCH" | "NO_MATCH";
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface VerifyNamePayload {
  full_name: string;
  country: string; // ISO-2 (e.g., "lk", "us")
  top_k: number;
}

export interface VerifyNameResponse {
  case_id?: string | number;
  id?: string | number;
  [key: string]: unknown;
}

export interface CaseResponse {
  id: number;
  full_name?: string;
  country?: string;
  decision?: Decision | string;
  risk_level?: RiskLevel | string;

  review_status?: ReviewStatus | string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;

  final_decision?: Decision | null;
  final_risk_level?: RiskLevel | null;

  created_at?: string;

  request_json?: unknown;
  response_json?: unknown;

  [key: string]: unknown;
}

export interface TimelineReview {
  case_id?: number | string;
  status?: ReviewStatus | string;
  final_decision?: Decision | null;
  final_risk_level?: RiskLevel | null;
  reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  updated_at?: string | null;
}

export interface TimelineNote {
  id: number | string;
  case_id?: number | string;
  note: string;
  author?: string | null;
  created_at: string;
}

export interface TimelineResponse {
  case: CaseResponse | null;
  review: TimelineReview | null;
  notes: TimelineNote[];
}

// Backend /cases returns an array. Keep wrapper support as fallback.
type CasesListResponse =
  | CaseResponse[]
  | {
      cases?: CaseResponse[];
      items?: CaseResponse[];
      data?: CaseResponse[];
      [key: string]: unknown;
    };

// ----------------------------
// Helpers
// ----------------------------
async function jsonOrText(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

function httpError(res: Response, body: unknown) {
  const msg =
    typeof body === "string"
      ? body
      : (body as any)?.detail || res.statusText || "Request failed";
  return new Error(`${res.status} ${msg}`);
}

// ----------------------------
// API
// ----------------------------
export async function verifyName(
  payload: VerifyNamePayload
): Promise<VerifyNameResponse> {
  const res = await fetch(`${API_BASE}/verify-name`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);
  return body as VerifyNameResponse;
}

export async function listCases(limit: number = 50): Promise<CaseResponse[]> {
  const res = await fetch(`${API_BASE}/cases?limit=${limit}`);
  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);

  const data = body as CasesListResponse;

  // ✅ your backend format
  if (Array.isArray(data)) return data;

  // fallback formats
  const cases = (data as any).cases || (data as any).items || (data as any).data || [];
  return Array.isArray(cases) ? cases : [];
}

export async function getLatestCase(): Promise<CaseResponse | null> {
  const cases = await listCases(1);
  return cases.length ? cases[0] : null;
}

export async function getCaseById(caseId: string | number): Promise<CaseResponse> {
  const res = await fetch(`${API_BASE}/cases/${caseId}`);
  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);
  return body as CaseResponse;
}

export async function getCaseTimeline(
  caseId: string | number,
  limit: number = 20
): Promise<TimelineResponse> {
  const res = await fetch(`${API_BASE}/cases/${caseId}/timeline?limit=${limit}`);
  const body = await jsonOrText(res);

  if (!res.ok) {
    return { case: null, review: null, notes: [] };
  }

  return body as TimelineResponse;
}

// ✅ PATCH /cases/{case_id}/status
export async function setReviewStatus(
  caseId: string | number,
  status: ReviewStatus,
  reviewed_by?: string
) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reviewed_by }),
  });

  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);
  return body;
}

// ✅ POST /cases/{case_id}/final-decision
export async function submitFinalDecision(
  caseId: string | number,
  payload: {
    final_decision: Decision;
    final_risk_level: RiskLevel;
    reason?: string;
    reviewed_by?: string;
  }
) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/final-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);
  return body;
}

// ✅ POST /cases/{case_id}/notes
export async function addCaseNote(
  caseId: string | number,
  note: string,
  author?: string
) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note, author }),
  });

  const body = await jsonOrText(res);
  if (!res.ok) throw httpError(res, body);
  return body;
}