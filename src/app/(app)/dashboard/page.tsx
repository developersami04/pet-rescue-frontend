

import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { FeaturedPet } from "./_components/featured-pet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Welcome to Pet-Pal"
          description="Your dashboard for finding a new companion."
          className="pb-0"
        />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/submit-request">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit a Request
          </Link>
        </Button>
      </div>
      <DashboardStats />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Featured Pet
        </h2>
        <FeaturedPet />
      </div>
    </div>
  );
}
