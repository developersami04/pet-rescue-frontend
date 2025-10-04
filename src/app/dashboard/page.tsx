
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DashboardClient } from "./_components/dashboard-client";


export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Welcome to Petopia"
          description="Your dashboard for finding a new companion."
          className="pb-0"
        />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/submit-request">
            <PlusCircle className="mr-2 h-4 w-4" />
            Pet Request Form
          </Link>
        </Button>
      </div>
      
      <DashboardClient />
    </div>
  );
}
