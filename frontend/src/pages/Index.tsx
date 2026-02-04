import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CapabilitiesSection } from '@/components/CapabilitiesSection';
import { ProblemSection } from '@/components/ProblemSection';
import { SolutionSection } from '@/components/SolutionSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { WhoItsForSection } from '@/components/WhoItsForSection';
import { WhyEKYCenseSection } from '@/components/WhyEKYCenseSection';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CapabilitiesSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhoItsForSection />
        <WhyEKYCenseSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
