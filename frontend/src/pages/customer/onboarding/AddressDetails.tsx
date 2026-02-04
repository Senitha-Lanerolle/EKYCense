import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { ProgressStepper } from '@/components/customer/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, MapPin } from 'lucide-react';
import { countries } from '@/data/countries';

const steps = [
  { id: 'personal', label: 'Personal' },
  { id: 'address', label: 'Address' },
  { id: 'identity', label: 'Identity' },
  { id: 'consent', label: 'Submit' },
];

export default function AddressDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_address');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.stateProvince) newErrors.stateProvince = 'State/Province is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem('onboarding_address', JSON.stringify(formData));
      navigate('/customer/onboarding/identity');
    }
  };

  return (
    <CustomerLayout showBackLink>
      <div className="mx-auto max-w-xl">
        <ProgressStepper steps={steps} currentStep={1} />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 mb-4">
            <MapPin className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Address Details</h1>
          <p className="mt-2 text-slate-500">Where do you currently reside?</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address Line 1 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Address line 1</label>
              <Input
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="123 Main Street"
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1}</p>}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Address line 2 <span className="text-slate-400">(optional)</span>
              </label>
              <Input
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Apartment, suite, etc."
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">State/Province</label>
                <Input
                  value={formData.stateProvince}
                  onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                  placeholder="NY"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.stateProvince && <p className="text-xs text-red-500">{errors.stateProvince}</p>}
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Postal code</label>
              <Input
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="10001"
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Country</label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
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
              {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
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
