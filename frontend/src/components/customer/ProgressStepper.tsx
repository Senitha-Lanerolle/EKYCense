import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <li key={step.id} className="relative flex-1">
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-emerald-400 bg-emerald-400 text-white'
                      : isCurrent
                      ? 'border-emerald-400 bg-transparent text-emerald-400'
                      : 'border-slate-600 bg-transparent text-slate-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        isCompleted ? 'bg-emerald-400' : 'bg-slate-700'
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Step Label */}
              <p
                className={cn(
                  'mt-2 text-xs font-medium transition-colors',
                  isCompleted || isCurrent ? 'text-emerald-400' : 'text-slate-500'
                )}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
