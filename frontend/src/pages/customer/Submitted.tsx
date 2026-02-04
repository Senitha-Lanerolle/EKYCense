import { useNavigate, useSearchParams } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Mail, Clock, Shield } from 'lucide-react';

export default function Submitted() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');

  const steps = [
    { id: 1, label: 'Submitted', status: 'complete' },
    { id: 2, label: 'In Review', status: 'current' },
    { id: 3, label: 'Verified', status: 'pending' },
  ];

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-lg text-center pt-8">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(142 70% 45% / 0.2) 0%, transparent 70%)',
                filter: 'blur(15px)',
                transform: 'scale(1.5)',
              }}
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Application Submitted
        </h1>
        <p className="mb-10 text-lg text-slate-500">
          Your verification is being processed. You can safely close this page.
        </p>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      step.status === 'complete' 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : step.status === 'current'
                        ? 'border-blue-500 bg-transparent text-blue-500'
                        : 'border-slate-300 bg-transparent text-slate-400'
                    }`}
                  >
                    {step.status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step.status === 'complete' 
                      ? 'text-green-600' 
                      : step.status === 'current'
                      ? 'text-blue-600' 
                      : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div 
                      className={`h-0.5 ${
                        step.status === 'complete' 
                          ? 'bg-green-500' 
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Case Reference */}
        {caseId && (
          <div className="mb-8 rounded-2xl bg-slate-50 border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-1">Reference number</p>
            <p className="font-mono text-xl font-semibold text-slate-900">{caseId}</p>
          </div>
        )}

        {/* Email notification info */}
        <div className="mb-10 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <p className="font-medium text-slate-900">We'll keep you updated</p>
          </div>
          <p className="text-sm text-slate-600">
            You'll receive an email notification once your verification is complete. 
            This typically takes just a few minutes.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {caseId && (
            <Button
              onClick={() => navigate(`/customer/status/${caseId}`)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              Check status
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate('/customer')}
            className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-base rounded-xl transition-all"
          >
            Back to home
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Fast processing</span>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
