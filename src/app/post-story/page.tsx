
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateStoryForm } from "./_components/create-story-form";

export default function PostStoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Post a Story"
        description="Share a heartwarming story about a pet."
      />
      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
              <CardTitle>Create Your Story</CardTitle>
              <CardDescription>
                Select a pet and share your experience with the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateStoryForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
