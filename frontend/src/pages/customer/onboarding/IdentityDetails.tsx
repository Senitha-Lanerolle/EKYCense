import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { ProgressStepper } from '@/components/customer/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, CreditCard } from 'lucide-react';
import { countries } from '@/data/countries';

const steps = [
  { id: 'personal', label: 'Personal' },
  { id: 'address', label: 'Address' },
  { id: 'identity', label: 'Identity' },
  { id: 'consent', label: 'Submit' },
];

const idTypes = [
  { value: 'nic', label: 'National ID Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
];

const sourceOfFundsOptions = [
  { value: 'employment', label: 'Employment Income' },
  { value: 'business', label: 'Business Income' },
  { value: 'investments', label: 'Investments' },
  { value: 'inheritance', label: 'Inheritance' },
  { value: 'savings', label: 'Savings' },
  { value: 'other', label: 'Other' },
];

export default function IdentityDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    issuingCountry: '',
    expiryDate: '',
    occupation: '',
    sourceOfFunds: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_identity');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.idType) newErrors.idType = 'ID type is required';
    if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
    if (!formData.issuingCountry) newErrors.issuingCountry = 'Issuing country is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem('onboarding_identity', JSON.stringify(formData));
      navigate('/customer/onboarding/consent');
    }
  };

  return (
    <CustomerLayout showBackLink>
      <div className="mx-auto max-w-xl">
        <ProgressStepper steps={steps} currentStep={2} />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4">
            <CreditCard className="h-8 w-8 text-cyan-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Identity Information</h1>
          <p className="mt-2 text-slate-500">Provide your identification details</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ID type</label>
              <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
                <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {idTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idType && <p className="text-xs text-red-500">{errors.idType}</p>}
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ID number</label>
              <Input
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder="Enter your ID number"
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.idNumber && <p className="text-xs text-red-500">{errors.idNumber}</p>}
            </div>

            {/* Issuing Country & Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Issuing country</label>
                <Select value={formData.issuingCountry} onValueChange={(value) => setFormData({ ...formData, issuingCountry: value })}>
                  <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.issuingCountry && <p className="text-xs text-red-500">{errors.issuingCountry}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Expiry date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
              </div>
            </div>

            {/* Optional Section */}
            <div className="border-t border-slate-200 pt-5">
              <p className="mb-4 text-sm font-medium text-slate-400">Additional Information</p>

              {/* Occupation (Optional) */}
              <div className="space-y-2 mb-5">
                <label className="text-sm font-medium text-slate-700">
                  Occupation <span className="text-slate-400">(optional)</span>
                </label>
                <Input
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {/* Source of Funds (Optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Source of funds <span className="text-slate-400">(optional)</span>
                </label>
                <Select value={formData.sourceOfFunds} onValueChange={(value) => setFormData({ ...formData, sourceOfFunds: value })}>
                  <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {sourceOfFundsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                Continue
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
