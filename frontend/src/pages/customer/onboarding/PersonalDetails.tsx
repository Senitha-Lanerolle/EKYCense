import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { ProgressStepper } from '@/components/customer/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, User } from 'lucide-react';
import { countries } from '@/data/countries';

const steps = [
  { id: 'personal', label: 'Personal' },
  { id: 'address', label: 'Address' },
  { id: 'identity', label: 'Identity' },
  { id: 'consent', label: 'Submit' },
];

const titles = ['Mr', 'Ms', 'Mrs', 'Dr'];

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    phone: '',
    countryOfResidence: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_personal');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.countryOfResidence) {
      newErrors.countryOfResidence = 'Country of residence is required';
    } else if (!/^[a-z]{2}$/.test(formData.countryOfResidence)) {
      newErrors.countryOfResidence = 'Invalid country selection';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem('onboarding_personal', JSON.stringify(formData));
      navigate('/customer/onboarding/address');
    }
  };

  return (
    <CustomerLayout showBackLink>
      <div className="mx-auto max-w-xl">
        <ProgressStepper steps={steps} currentStep={0} />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Personal Details</h1>
          <p className="mt-2 text-slate-500">Tell us a bit about yourself</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {titles.map((title) => (
                    <SelectItem key={title} value={title.toLowerCase()} className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date of birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nationality</label>
              <Select value={formData.nationality} onValueChange={(value) => setFormData({ ...formData, nationality: value })}>
                <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 max-h-60">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nationality && <p className="text-xs text-red-500">{errors.nationality}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Country of Residence */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Country of residence</label>
              <Select value={formData.countryOfResidence} onValueChange={(value) => setFormData({ ...formData, countryOfResidence: value })}>
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
              {errors.countryOfResidence && <p className="text-xs text-red-500">{errors.countryOfResidence}</p>}
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
