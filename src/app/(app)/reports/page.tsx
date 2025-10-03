
import { PageHeader } from "@/components/page-header";
import { ReportsClient } from "./_components/reports-client";

export default function ReportsPage() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader
                title="Pet Reports"
                description="Browse reports for lost, found, and adoptable pets."
            />
            <ReportsClient />
        </div>
    )
}
