import { PageHeader } from "@/components/page-header";
import { PetMatching } from "./_components/pet-matching";

export default function PetMatchingPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="AI-Powered Pet Matching"
        description="Tell us about yourself, and our AI will find the perfect pet for you."
      />
      <PetMatching />
    </div>
  );
}
