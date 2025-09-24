import { LandingHeader } from './_components/landing-header';
import { HeroSection } from './_components/hero-section';
import { WhyAdoptSection } from './_components/why-adopt-section';
import { LandingFooter } from './_components/landing-footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <WhyAdoptSection />
      </main>
      <LandingFooter />
    </div>
  );
}
