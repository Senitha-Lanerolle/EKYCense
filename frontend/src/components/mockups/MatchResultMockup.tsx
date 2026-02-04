import { CheckCircle2, Shield, FileText, ExternalLink } from 'lucide-react';

export function MatchResultMockup() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">Match Confirmed</h4>
            <p className="text-xs text-emerald-600 font-medium">High confidence</p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scores */}
      <div className="space-y-3 mb-4">
        <ScoreBar label="Lexical Score" value={94} />
        <ScoreBar label="Semantic Score" value={89} />
      </div>

      {/* Source Badges */}
      <div className="flex gap-2">
        <Badge icon={Shield} label="PEP List" />
        <Badge icon={FileText} label="OFAC" />
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-muted/50 rounded-full">
      <Icon className="w-3 h-3 text-muted-foreground" />
      <span className="font-medium text-foreground/80">{label}</span>
    </div>
  );
}
