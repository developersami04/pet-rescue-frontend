
import { FeaturedPetsSection } from './landing/_components/featured-pets-section';
import { HeroSection } from './landing/_components/hero-section';
import { StoryMarquee } from './landing/_components/story-marquee';
import { SuccessStoriesSection } from './landing/_components/success-stories-section';
import { WhyAdoptSection } from './landing/_components/why-adopt-section';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StoryMarquee />
      <FeaturedPetsSection />
      <WhyAdoptSection />
      <SuccessStoriesSection />
    </>
  );
}
