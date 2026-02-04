import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConsoleLayout } from "@/components/console/ConsoleLayout";
import { SectionCard } from "@/components/console/SectionCard";
import { DataTable, Column } from "@/components/console/DataTable";
import { StatusPill } from "@/components/console/StatusPill";
import { EmptyState } from "@/components/console/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Download, Search, Lightbulb, Sparkles } from "lucide-react";
import type { ReviewStatus, RiskLevel, Decision } from "@/data/mockCases";
import { formatDistanceToNow, format } from "date-fns";
import { listCases } from "@/lib/api";
import type { CaseResponse } from "@/lib/api";

// Lightweight row type for the table (matches backend /cases)
type CaseRow = {
  id: number;
  full_name: string;
  country: string;
  decision: Decision;
  risk_level: RiskLevel;
  review_status: ReviewStatus;
  created_at: string;
  explanation?: string;
};

function asDecision(v: any): Decision {
  if (v === "MATCH" || v === "PARTIAL_MATCH" || v === "NO_MATCH") return v;
  return "NO_MATCH";
}

function asRisk(v: any): RiskLevel {
  if (v === "HIGH" || v === "MEDIUM" || v === "LOW") return v;
  return "LOW";
}

function asReviewStatus(v: any): ReviewStatus {
  if (v === "OPEN" || v === "IN_REVIEW" || v === "CLEARED" || v === "REJECTED") return v;
  return "OPEN";
}

function asExplanation(v: any): string {
  if (typeof v === "string") return v;
  return "";
}

function extractExplanation(c: CaseResponse): string {
  // Prefer explicit top-level field if backend ever adds it
  const topLevel = (c as any).explanation;
  if (typeof topLevel === "string" && topLevel.trim()) return topLevel;

  // Otherwise try response_json.explanation
  const rj: any = (c as any).response_json;
  if (rj && typeof rj === "object") {
    const ex = (rj as any).explanation;
    if (typeof ex === "string") return ex;
  }

  return "";
}

export default function CasesList() {
  const navigate = useNavigate();

  // ✅ API state
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "risk">("newest");

  // ✅ Fetch from backend once
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const apiCases = await listCases(200);

        const mapped: CaseRow[] = (apiCases as CaseResponse[]).map((c) => ({
          id: Number(c.id),
          full_name: (c.full_name ?? "").toString(),
          country: (c.country ?? "").toString(),
          decision: asDecision((c as any).decision),
          risk_level: asRisk((c as any).risk_level),
          review_status: asReviewStatus((c as any).review_status),
          created_at: (c.created_at ?? new Date().toISOString()).toString(),
          explanation: extractExplanation(c),
        }));
        if (alive) setCases(mapped);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load cases");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filteredCases = useMemo(() => {
    let result = [...cases];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const id = String(c.id).toLowerCase();
        const name = (c.full_name ?? "").toLowerCase();
        const country = (c.country ?? "").toLowerCase();
        const explanation = (c.explanation ?? "").toLowerCase();
        return name.includes(query) || country.includes(query) || id.includes(query) || explanation.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((c) => c.review_status === statusFilter);
    }

    // Risk filter
    if (riskFilter !== "ALL") {
      result = result.filter((c) => c.risk_level === riskFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "risk") {
        const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
        return (riskOrder[a.risk_level] ?? 99) - (riskOrder[b.risk_level] ?? 99);
      }
      return 0;
    });

    return result;
  }, [cases, searchQuery, statusFilter, riskFilter, sortBy]);

  const columns: Column<CaseRow>[] = [
    {
      key: "case",
      header: "Case",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.full_name}</p>
          <p className="text-xs text-muted-foreground">Case #{item.id}</p>
          {item.explanation ? (
            <p
              className="mt-1 text-xs text-muted-foreground max-w-[360px] truncate"
              title={item.explanation}
            >
              {item.explanation}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "country",
      header: "Country",
      render: (item) => <span className="text-sm text-foreground">{item.country}</span>,
    },
    {
      key: "decision",
      header: "Decision",
      render: (item) => <StatusPill type="decision" value={item.decision} />,
    },
    {
      key: "risk",
      header: "Risk",
      render: (item) => <StatusPill type="risk" value={item.risk_level} />,
    },
    {
      key: "status",
      header: "Review Status",
      render: (item) => <StatusPill type="review" value={item.review_status} />,
    },
    {
      key: "created",
      header: "Created",
      render: (item) => (
        <div className="text-sm">
          <span className="text-foreground">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
          <p className="text-xs text-muted-foreground">
            {format(new Date(item.created_at), "MMM d, yyyy HH:mm")}
          </p>
        </div>
      ),
    },
  ];

  return (
    <ConsoleLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cases</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage all screening cases
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
              <Plus className="h-4 w-4" />
              New verification
            </Button>
          </div>
        </div>

        {/* ✅ Loading / Error */}
        {loading && (
          <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            Loading cases from backend…
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name / country / id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ReviewStatus | "ALL")}
          >
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue placeholder="Review status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="CLEARED">Cleared</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={riskFilter}
            onValueChange={(v) => setRiskFilter(v as RiskLevel | "ALL")}
          >
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All risks</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="risk">Highest risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-6">
          {/* Cases Table */}
          <SectionCard noPadding accent="blue">
            <DataTable
              data={filteredCases}
              columns={columns}
              onRowClick={(item) => navigate(`/console/cases/${item.id}`)}
              emptyState={<EmptyState type="cases" />}
            />
          </SectionCard>

          {/* Review Guidance Sidebar */}
          <div className="hidden lg:block">
            <SectionCard
              title="Review guidance"
              className="sticky top-24"
              accent="lavender"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(220 80% 90%) 0%, hsl(240 70% 88%) 100%)",
                    }}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Verify identity documents
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Cross-reference submitted documents with screening results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(258 50% 90%) 0%, hsl(280 50% 88%) 100%)",
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Check match rationale
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review similarity scores and dataset sources for each match.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(160 60% 88%) 0%, hsl(170 55% 85%) 100%)",
                    }}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Document your decision
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Add notes and provide clear reasoning for audit trails.
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}