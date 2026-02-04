import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { ProgressStepper } from '@/components/customer/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, FileCheck, Loader2, User, MapPin, CreditCard } from 'lucide-react';
import { verifyName, getLatestCase } from '@/lib/api';
import { getCountryName } from '@/data/countries';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 'personal', label: 'Personal' },
  { id: 'address', label: 'Address' },
  { id: 'identity', label: 'Identity' },
  { id: 'consent', label: 'Submit' },
];

interface PersonalData {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  phone?: string;
  phoneNumber?: string;
  countryOfResidence: string;
}

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince?: string;
  state?: string;
  postalCode: string;
  country: string;
}

interface IdentityData {
  idType: string;
  idNumber: string;
  issuingCountry: string;
  expiryDate: string;
  occupation: string;
  sourceOfFunds: string;
}

export default function ConsentSubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [consents, setConsents] = useState({
    accurateInfo: false,
    screeningConsent: false,
    privacyPolicy: false,
  });
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);

  useEffect(() => {
    const personal = sessionStorage.getItem('onboarding_personal');
    const address = sessionStorage.getItem('onboarding_address');
    const identity = sessionStorage.getItem('onboarding_identity');

    if (!personal) {
      navigate('/customer/onboarding/personal');
      return;
    }

    setPersonalData(JSON.parse(personal));
    if (address) setAddressData(JSON.parse(address));
    if (identity) setIdentityData(JSON.parse(identity));
  }, [navigate]);

  const allConsentsGiven = consents.accurateInfo && consents.screeningConsent && consents.privacyPolicy;

  const maskIdNumber = (id: string) => {
    if (id.length <= 4) return id;
    return '•'.repeat(id.length - 4) + id.slice(-4);
  };

  const getIdTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      nic: 'National ID Card',
      passport: 'Passport',
      driving_license: 'Driving License',
    };
    return types[type] || type;
  };

  const handleSubmit = async () => {
    if (!personalData) {
      toast({
        title: 'Missing information',
        description: 'Please complete all previous steps',
        variant: 'destructive',
      });
      return;
    }

    const countryCode = personalData.countryOfResidence;
    if (!/^[a-z]{2}$/.test(countryCode)) {
      toast({
        title: 'Invalid country',
        description: 'Country code must be a valid 2-letter ISO code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const fullName = `${personalData.firstName} ${personalData.lastName}`;
      const response = await verifyName({
        full_name: fullName,
        country: countryCode,
        top_k: 10,
      });

      let caseId = response.case_id || response.id;

      if (!caseId) {
        const latestCase = await getLatestCase();
        if (latestCase) {
          caseId = latestCase.id;
        }
      }

      // Clear session storage
      sessionStorage.removeItem('onboarding_personal');
      sessionStorage.removeItem('onboarding_address');
      sessionStorage.removeItem('onboarding_identity');
      sessionStorage.removeItem('customer_email');

      navigate(`/customer/submitted${caseId ? `?caseId=${caseId}` : ''}`);
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!personalData) {
    return null;
  }

  return (
    <CustomerLayout showBackLink>
      <div className="mx-auto max-w-xl">
        <ProgressStepper steps={steps} currentStep={3} />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-4">
            <FileCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Review & Submit</h1>
          <p className="mt-2 text-slate-500">Please review your information and provide consent</p>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4 mb-8">
          {/* Personal Summary */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/10">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Personal Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Full name</p>
                <p className="text-slate-900">{personalData.title} {personalData.firstName} {personalData.lastName}</p>
              </div>
              <div>
                <p className="text-slate-500">Date of birth</p>
                <p className="text-slate-900">{personalData.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-slate-500">Nationality</p>
                <p className="text-slate-900">{getCountryName(personalData.nationality)}</p>
              </div>
              <div>
                <p className="text-slate-500">Country of residence</p>
                <p className="text-slate-900">{getCountryName(personalData.countryOfResidence)}</p>
              </div>
            </div>
          </div>

          {/* Address Summary */}
          {addressData && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-teal-500/10">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Address</h3>
              </div>
              <p className="text-slate-900 text-sm">
                {addressData.addressLine1}
                {addressData.addressLine2 && `, ${addressData.addressLine2}`}
                <br />
                {addressData.city}, {addressData.stateProvince || addressData.state} {addressData.postalCode}
                <br />
                {getCountryName(addressData.country)}
              </p>
            </div>
          )}

          {/* Identity Summary */}
          {identityData && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-500/10">
                  <CreditCard className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Identity Document</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">ID type</p>
                  <p className="text-slate-900">{getIdTypeLabel(identityData.idType)}</p>
                </div>
                <div>
                  <p className="text-slate-500">ID number</p>
                  <p className="text-slate-900 font-mono">{maskIdNumber(identityData.idNumber)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Issuing country</p>
                  <p className="text-slate-900">{getCountryName(identityData.issuingCountry)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Expiry date</p>
                  <p className="text-slate-900">{identityData.expiryDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consent Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <h3 className="font-semibold text-slate-900 mb-6">Consent & Declaration</h3>
          
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="accurate"
                checked={consents.accurateInfo}
                onCheckedChange={(checked) => setConsents({ ...consents, accurateInfo: checked as boolean })}
                className="mt-0.5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="accurate" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                I confirm that all information provided is accurate and complete to the best of my knowledge
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="screening"
                checked={consents.screeningConsent}
                onCheckedChange={(checked) => setConsents({ ...consents, screeningConsent: checked as boolean })}
                className="mt-0.5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="screening" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                I consent to verification screening against regulatory databases as required by law
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="privacy"
                checked={consents.privacyPolicy}
                onCheckedChange={(checked) => setConsents({ ...consents, privacyPolicy: checked as boolean })}
                className="mt-0.5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="privacy" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                I have read and agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button 
              onClick={handleSubmit}
              disabled={!allConsentsGiven || loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit for verification
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
