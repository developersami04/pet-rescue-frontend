
import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { FeaturedPet } from "./_components/featured-pet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Welcome to Pet-Pal"
          description="Your dashboard for finding a new companion."
        />
        <Button asChild>
          <Link href="/add-pet">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Pet
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
