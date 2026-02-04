import { CheckCircle2, AlertCircle, XCircle, Search, Filter } from 'lucide-react';

export function ScreeningMockup() {
  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground text-sm">Screening Results</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            Live
          </span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <Filter className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 mb-4">
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">محمد أحمد الرشيد</span>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <ResultRow 
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
          name="Mohammed Al-Rashid"
          id="EKY-2024-001"
          status="Match"
          statusColor="bg-emerald-100 text-emerald-700"
          rowBg="bg-emerald-50/50"
        />
        <ResultRow 
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
          name="M. Ahmed Rasheed"
          id="EKY-2024-002"
          status="Partial"
          statusColor="bg-amber-100 text-amber-700"
          rowBg="bg-amber-50/50"
        />
        <ResultRow 
          icon={XCircle}
          iconColor="text-muted-foreground"
          iconBg="bg-muted"
          name="Ahmad Mohamed"
          id="EKY-2024-003"
          status="No Match"
          statusColor="bg-muted text-muted-foreground"
          rowBg="bg-muted/30"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
        <span>3 results</span>
        <span>2.4M records screened</span>
      </div>
    </div>
  );
}

interface ResultRowProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  name: string;
  id: string;
  status: string;
  statusColor: string;
  rowBg: string;
}

function ResultRow({ icon: Icon, iconColor, iconBg, name, id, status, statusColor, rowBg }: ResultRowProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${rowBg}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">ID: {id}</p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}
