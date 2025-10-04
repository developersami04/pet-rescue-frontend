
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Admin Dashboard"
        description="Welcome to the admin control center."
      />
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the admin dashboard. You can manage users, pets, and reports from here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
