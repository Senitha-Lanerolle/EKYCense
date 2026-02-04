import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConsoleLayout } from "@/components/console/ConsoleLayout";
import { SectionCard } from "@/components/console/SectionCard";
import { StatusPill } from "@/components/console/StatusPill";
import { EmptyState } from "@/components/console/EmptyState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Send,
  Shield,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

import type { Decision, RiskLevel, ReviewStatus, CaseNote, MatchResult } from "@/data/mockCases";
import {
  getCaseTimeline,
  setReviewStatus,
  submitFinalDecision,
  addCaseNote,
} from "@/lib/api";

type TimelineCase = {
  id: number | string;
  full_name?: string;
  country?: string;
  decision?: Decision | string;
  risk_level?: RiskLevel | string;
  created_at?: string;

  review_status?: ReviewStatus | string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;

  final_decision?: Decision | null;
  final_risk_level?: RiskLevel | null;

  request_json?: any;
  response_json?: any;
};

type TimelineReview = {
  case_id?: number | string;
  status?: ReviewStatus | string;
  final_decision?: Decision | null;
  final_risk_level?: RiskLevel | null;
  reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  updated_at?: string | null;
};

type TimelineNote = {
  id: number | string;
  case_id?: number | string;
  note: string;
  author?: string | null;
  created_at: string;
};

type TimelineResponse = {
  case: TimelineCase | null;
  review: TimelineReview | null;
  notes: TimelineNote[];
};

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [caseData, setCaseData] = useState<TimelineCase | null>(null);
  const [review, setReview] = useState<TimelineReview | null>(null);
  const [notes, setNotes] = useState<CaseNote[]>([]);

  const [newNote, setNewNote] = useState("");
  const [finalDecision, setFinalDecision] = useState<Decision | "">("");
  const [finalRisk, setFinalRisk] = useState<RiskLevel | "">("");
  const [reason, setReason] = useState("");

  // ✅ derive matches from response_json.top_hits (backend)
  const matches: MatchResult[] = useMemo(() => {
    const hits = caseData?.response_json?.top_hits;
    if (!Array.isArray(hits)) return [];
    return hits.map((h: any) => ({
      matched_name: h.matched_name ?? "",
      dataset: h.dataset ?? "",
      lexical_similarity: Number(h.lexical_similarity ?? 0),
      semantic_similarity: Number(h.semantic_similarity ?? 0),
      fuzzy_score: Number(h.fuzzy_score ?? 0),
      decision: (h.decision ?? "PARTIAL_MATCH") as Decision,
    }));
  }, [caseData]);

  // ✅ human-readable explanation (backend)
  const explanation: string | null = useMemo(() => {
    const direct = caseData?.response_json?.explanation;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const alt = caseData?.response_json?.human_readable;
    if (typeof alt === "string" && alt.trim()) return alt.trim();

    const reasons = caseData?.response_json?.reasons;
    if (Array.isArray(reasons) && reasons.length) {
      const parts = reasons
        .map((r: any) => (typeof r === "string" ? r : r?.text))
        .filter((x: any) => typeof x === "string" && x.trim());
      if (parts.length) return parts.join(" • ");
    }

    return null;
  }, [caseData]);

  const fetchTimeline = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const data: TimelineResponse = await getCaseTimeline(id, 50);

      if (!data?.case) {
        setCaseData(null);
        setReview(null);
        setNotes([]);
        return;
      }

      setCaseData(data.case);
      setReview(data.review);

      // map backend notes -> UI CaseNote
      const mappedNotes: CaseNote[] = (data.notes || []).map((n: any) => ({
        id: String(n.id),
        note: n.note ?? "",
        author: n.author ?? "—",
        created_at: n.created_at ?? new Date().toISOString(),
      }));

      setNotes(mappedNotes);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load case timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ✅ keep hook order stable: prefill from review if available (helps when refreshing)
  useEffect(() => {
    if (!caseData) return;
    const fd = (review?.final_decision ?? caseData.final_decision) as
      | Decision
      | null
      | undefined;
    const fr = (review?.final_risk_level ?? caseData.final_risk_level) as
      | RiskLevel
      | null
      | undefined;
    const rr = (review?.reason ?? "") as string;

    if (fd && finalDecision === "") setFinalDecision(fd);
    if (fr && finalRisk === "") setFinalRisk(fr);
    if (rr && reason === "") setReason(rr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData, review]);

  if (loading) {
    return (
      <ConsoleLayout>
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            Loading case details…
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  if (error) {
    return (
      <ConsoleLayout>
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <Button variant="outline" onClick={() => navigate("/console/cases")}>
            Back to cases
          </Button>
        </div>
      </ConsoleLayout>
    );
  }

  if (!caseData) {
    return (
      <ConsoleLayout>
        <div className="max-w-7xl mx-auto">
          <EmptyState
            title="Case not found"
            description="The case you're looking for doesn't exist or has been removed."
          />
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate("/console/cases")}>
              Back to cases
            </Button>
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  const reviewStatus = (caseData.review_status ?? review?.status ?? "OPEN") as ReviewStatus;
  const isOpen = reviewStatus === "OPEN";
  const isInReview = reviewStatus === "IN_REVIEW";
  const isFinalized = reviewStatus === "CLEARED" || reviewStatus === "REJECTED";
  const canSubmitFinalDecision = isInReview;

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;
    await addCaseNote(id, newNote.trim(), "analyst_1");
    setNewNote("");
    await fetchTimeline();
  };

  const handleMarkInReview = async () => {
    if (isFinalized) return;
    if (!isOpen) return;
    if (!id) return;
    await setReviewStatus(id, "IN_REVIEW", "analyst_1");
    await fetchTimeline();
  };

  const handleClear = async () => {
    if (isFinalized) return;
    if (!isInReview) return;
    if (!id) return;
    // simplest: set status only (final decision is via form)
    await setReviewStatus(id, "CLEARED", "analyst_1");
    await fetchTimeline();
  };

  const handleReject = async () => {
    if (isFinalized) return;
    if (!isInReview) return;
    if (!id) return;
    await setReviewStatus(id, "REJECTED", "analyst_1");
    await fetchTimeline();
  };

  const handleSubmitFinalDecision = async () => {
    if (isFinalized) return;
    if (!isInReview) return;
    if (!id) return;
    if (!finalDecision || !finalRisk) return;

    await submitFinalDecision(id, {
      final_decision: finalDecision,
      final_risk_level: finalRisk,
      reason: reason || undefined,
      reviewed_by: "analyst_1",
    });

    await fetchTimeline();
  };

  const workflowSteps = [
    { status: "OPEN", label: "Open", icon: Clock, complete: true },
    {
      status: "IN_REVIEW",
      label: "In Review",
      icon: Search,
      complete: reviewStatus !== "OPEN",
    },
    {
      status: "FINALIZED",
      label: "Finalized",
      icon: CheckCircle2,
      complete: reviewStatus === "CLEARED" || reviewStatus === "REJECTED",
    },
  ];


  return (
    <ConsoleLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/console/cases")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Console / Cases / Case #{caseData.id}
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(210 40% 98%) 100%)",
                  }}
                >
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {caseData.full_name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {caseData.country} • Case #{caseData.id}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <StatusPill type="review" value={reviewStatus} size="md" />
                <StatusPill type="decision" value={caseData.decision as any} size="md" />
                <StatusPill type="risk" value={caseData.risk_level as any} size="md" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={handleMarkInReview}
                disabled={isFinalized || !isOpen}
              >
                <Search className="h-4 w-4" />
                Mark In Review
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={handleClear}
                disabled={isFinalized || !isInReview}
              >
                <CheckCircle2 className="h-4 w-4" />
                Clear
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
                disabled={isFinalized || !isInReview}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Screening Result */}
            <SectionCard title="Screening Result" accent="lavender">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-transparent border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Decision
                    </p>
                    <div className="mt-2">
                      <StatusPill type="decision" value={caseData.decision as any} size="md" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-transparent border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Risk Level
                    </p>
                    <div className="mt-2">
                      <StatusPill type="risk" value={caseData.risk_level as any} size="md" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-transparent border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Match Count
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-2">{matches.length}</p>
                  </div>
                </div>

                <div className="rounded-xl p-4 border bg-muted/20">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm text-foreground leading-relaxed">
                        Review the top matches and similarity scores. Add notes for audit trail and submit a final decision when ready.
                      </p>

                      {explanation && (
                        <div className="rounded-xl border border-border bg-background p-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            System explanation
                          </p>
                          <p className="mt-1 text-sm text-foreground leading-relaxed">
                            {explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Top Matches */}
            {matches.length > 0 && (
              <SectionCard title="Top Matches" noPadding accent="mint">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Matched Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Dataset
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Lexical
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Semantic
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Fuzzy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Decision
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {matches.map((match, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{match.matched_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p
                              className="text-sm text-muted-foreground max-w-[180px] truncate"
                              title={match.dataset}
                            >
                              {match.dataset}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Progress value={match.lexical_similarity * 100} className="w-16 h-2" />
                              <span className="text-xs font-medium text-foreground">
                                {Math.round(match.lexical_similarity * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Progress value={match.semantic_similarity * 100} className="w-16 h-2" />
                              <span className="text-xs font-medium text-foreground">
                                {Math.round(match.semantic_similarity * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Progress value={match.fuzzy_score * 100} className="w-16 h-2" />
                              <span className="text-xs font-medium text-foreground">
                                {Math.round(match.fuzzy_score * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusPill type="decision" value={match.decision} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Request / Response JSON */}
            <SectionCard title="Request / Response" noPadding>
              <Tabs defaultValue="request" className="w-full">
                <div className="border-b border-border px-6">
                  <TabsList className="bg-transparent h-auto p-0 gap-4">
                    <TabsTrigger
                      value="request"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-3"
                    >
                      Request JSON
                    </TabsTrigger>
                    <TabsTrigger
                      value="response"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-3"
                    >
                      Response JSON
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="request" className="m-0 p-6">
                  <pre className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 text-sm text-foreground overflow-x-auto font-mono border border-border">
                    {JSON.stringify(caseData.request_json ?? {}, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="response" className="m-0 p-6">
                  <pre className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 text-sm text-foreground overflow-x-auto font-mono border border-border">
                    {JSON.stringify(caseData.response_json ?? {}, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Review Workflow */}
            <SectionCard title="Review Workflow" accent="blue">
              <div className="space-y-6">
                {/* Status Timeline */}
                <div className="space-y-0">
                  {workflowSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isLast = idx === workflowSteps.length - 1;
                    return (
                      <div key={step.status} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                              step.complete ? "shadow-sm" : ""
                            )}
                            style={{
                              background: step.complete
                                ? "linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 15% 25%) 100%)"
                                : "hsl(var(--muted))",
                            }}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                step.complete ? "text-white" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          {!isLast && (
                            <div className={cn("w-0.5 h-8", step.complete ? "bg-primary" : "bg-border")} />
                          )}
                        </div>

                        <div className="pb-8">
                          <p className={cn("font-medium", step.complete ? "text-foreground" : "text-muted-foreground")}>
                            {step.label}
                          </p>

                          {step.status === "IN_REVIEW" && (caseData.reviewed_by || review?.reviewed_by) && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              by {(caseData.reviewed_by ?? review?.reviewed_by) as string}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reviewed Info */}
                {(caseData.reviewed_at || review?.reviewed_at) && (
                  <div className="rounded-xl p-4 border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-muted">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {(caseData.reviewed_by ?? review?.reviewed_by ?? "—") as string}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Reviewed{" "}
                      {formatDistanceToNow(
                        new Date((caseData.reviewed_at ?? review?.reviewed_at) as string),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                )}

                {/* Final Decision Form */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground">Submit Final Decision</h4>
                  <p className="text-xs text-muted-foreground">
                    Workflow: <span className="font-medium">OPEN</span> → <span className="font-medium">Mark In Review</span> → <span className="font-medium">Submit final decision</span> → <span className="font-medium">Clear</span> / <span className="font-medium">Reject</span>.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Final Decision
                      </label>
                      <Select value={finalDecision} onValueChange={(v) => setFinalDecision(v as Decision)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MATCH">Match</SelectItem>
                          <SelectItem value="PARTIAL_MATCH">Partial Match</SelectItem>
                          <SelectItem value="NO_MATCH">No Match</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Final Risk Level
                      </label>
                      <Select value={finalRisk} onValueChange={(v) => setFinalRisk(v as RiskLevel)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Reason
                      </label>
                      <Textarea
                        placeholder="Provide reasoning for your decision..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="rounded-xl"
                      />
                    </div>

                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90"
                      disabled={isFinalized || !canSubmitFinalDecision || !finalDecision || !finalRisk}
                      onClick={handleSubmitFinalDecision}
                    >
                      Submit final decision
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Notes" accent="lavender">
              <div className="space-y-4">
                {/* Add Note */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                    className="rounded-xl"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="gap-2 rounded-xl"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Add note
                  </Button>
                </div>

                {/* Notes List */}
                {notes.length === 0 ? (
                  <EmptyState type="notes" className="py-6" />
                ) : (
                  <div className="space-y-3 pt-4 border-t border-border">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-xl p-3 border bg-muted/10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-5 w-5 rounded-lg flex items-center justify-center bg-muted">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-medium text-foreground">{note.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}