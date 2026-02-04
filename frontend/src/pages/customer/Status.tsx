import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { StatusBadge, mapReviewStatusToCustomerStatus } from '@/components/customer/StatusBadge';
import { Button } from '@/components/ui/button';
import { RefreshCw, MessageCircle, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getCaseById } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface CaseData {
  id: string;
  review_status?: string;
  reviewed_at?: string;
  updated_at?: string;
  created_at?: string;
}

export default function Status() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCase = async (isRefresh = false) => {
    if (!caseId) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getCaseById(caseId);
      setCaseData(data);
      setError(null);
    } catch (err) {
      setError('Unable to fetch verification status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const status = caseData ? mapReviewStatusToCustomerStatus(caseData.review_status) : 'submitted';
  const lastUpdated = caseData?.reviewed_at || caseData?.updated_at || caseData?.created_at;

  const getStatusMessage = () => {
    switch (status) {
      case 'submitted':
        return "We've received your verification request and it's in our queue for review.";
      case 'in_progress':
        return "Your verification is currently being reviewed. This usually takes just a few minutes.";
      case 'verified':
        return "Your identity has been successfully verified. You're all set!";
      case 'action_required':
        return "We need additional information to complete your verification. Please contact our support team.";
      default:
        return "Your verification is being processed.";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-8 w-8 text-slate-500" />;
      case 'in_progress':
        return <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'verified':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'action_required':
        return <AlertCircle className="h-8 w-8 text-amber-500" />;
    }
  };

  const steps = [
    { id: 1, label: 'Submitted', status: status === 'submitted' ? 'current' : 'complete' },
    { id: 2, label: 'In Review', status: status === 'in_progress' ? 'current' : status === 'submitted' ? 'pending' : 'complete' },
    { id: 3, label: status === 'action_required' ? 'Action Required' : 'Verified', status: status === 'verified' ? 'complete' : status === 'action_required' ? 'error' : 'pending' },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-lg">
        {/* Status Header */}
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: status === 'verified' 
                    ? 'radial-gradient(circle, hsl(142 70% 45% / 0.15) 0%, transparent 70%)'
                    : status === 'action_required'
                    ? 'radial-gradient(circle, hsl(45 80% 50% / 0.15) 0%, transparent 70%)'
                    : 'radial-gradient(circle, hsl(217 90% 60% / 0.15) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                  transform: 'scale(1.5)',
                }}
              />
              <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 ${
                status === 'verified' 
                  ? 'border-green-500 bg-green-50' 
                  : status === 'action_required'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-300 bg-slate-50'
              }`}>
                {getStatusIcon()}
              </div>
            </div>
          </div>

          <StatusBadge status={status} size="lg" />

          <p className="mt-6 text-slate-500 max-w-sm mx-auto">
            {getStatusMessage()}
          </p>

          {lastUpdated && (
            <p className="mt-4 text-sm text-slate-400">
              Last updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      step.status === 'complete' 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : step.status === 'current'
                        ? 'border-blue-500 bg-transparent text-blue-500'
                        : step.status === 'error'
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-slate-300 bg-transparent text-slate-400'
                    }`}
                  >
                    {step.status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.status === 'error' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step.status === 'complete' 
                      ? 'text-green-600' 
                      : step.status === 'current'
                      ? 'text-blue-600'
                      : step.status === 'error'
                      ? 'text-amber-600'
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

        {/* Reference Card */}
        {caseId && (
          <div className="mb-8 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Reference number</p>
            <p className="font-mono text-xl font-semibold text-slate-900">{caseId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={() => fetchCase(true)}
            disabled={refreshing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh status
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/customer/help')}
            className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-base rounded-xl transition-all"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact support
          </Button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
