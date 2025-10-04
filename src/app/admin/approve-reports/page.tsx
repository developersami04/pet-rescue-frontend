
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApproveReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Approve Reports"
        description="Review and approve pet reports from users."
      />
      <Card>
        <CardHeader>
          <CardTitle>Pending Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is where you will see reports pending approval. Functionality coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    