import { Brain, Scale, FileSearch, CheckCircle2 } from 'lucide-react';

export function DecisionEngineMockup() {
  return (
    <div className="glass-card p-6 shadow-lg border border-white/20 float-animation-slow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender to-mint flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Hybrid Decision Engine</h3>
          <p className="text-xs text-muted-foreground">Multi-factor identity analysis</p>
        </div>
      </div>

      {/* Analysis Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
            <FileSearch className="w-4 h-4 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Lexical Analysis</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-mint-dark to-lavender-dark h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Semantic Matching</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-lavender-dark to-soft-pink h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Fuzzy Logic</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-periwinkle to-lavender h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-foreground">Decision Ready</span>
          </div>
          <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full font-medium">
            MATCH
          </span>
        </div>
      </div>
    </div>
  );
}
