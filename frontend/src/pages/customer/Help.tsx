import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone, FileText, ChevronRight, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How long does verification take?',
    answer: 'Most verifications are completed within a few minutes. In some cases, additional review may be required which can take up to 24 hours.',
  },
  {
    question: 'What documents do I need?',
    answer: 'You will need a valid government-issued ID (passport, national ID, or driving license) and proof of address.',
  },
  {
    question: 'Is my information secure?',
    answer: 'Yes, we use bank-grade 256-bit encryption to protect your data. Your information is never shared with third parties.',
  },
  {
    question: 'What if my verification fails?',
    answer: 'If your verification requires additional action, you will be notified via email with clear instructions on next steps.',
  },
];

export default function Help() {
  return (
    <CustomerLayout showBackLink>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
          <p className="mt-2 text-slate-500">We're here to help with any questions you may have</p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500/10 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
            <p className="text-sm text-slate-500">Chat with our support team</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal-500/10 mb-4">
              <Mail className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
            <p className="text-sm text-slate-500">support@example.com</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-500/10 mb-4">
              <Phone className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
            <p className="text-sm text-slate-500">+1 (800) 123-4567</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-xl bg-slate-50 border border-slate-100 p-5"
              >
                <h3 className="font-medium text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Can't find what you're looking for?</p>
          <Button 
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all hover:shadow-md"
          >
            Contact Support
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}
