import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { FeaturedPet } from "./_components/featured-pet";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Welcome to Pet-Pal"
        description="Your dashboard for finding a new companion."
      />
      <DashboardStats />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Featured Pet</h2>
        <FeaturedPet />
      </div>
    </div>
  );
}
