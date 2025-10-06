
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="About Petopia"
        description="Our mission is to connect loving homes with pets in need."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Petopia was founded in 2024 with a simple goal: to make pet adoption easier and more accessible for everyone. We saw countless animals in shelters waiting for a second chance and passionate people looking for a companion. We knew technology could bridge that gap.
            </p>
            <p>
              We are a team of animal lovers, developers, and designers dedicated to creating a platform that serves both pets and people. By partnering with rescue organizations and leveraging the power of AI, we help create perfect matches and support families throughout their adoption journey.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={"https://picsum.photos/seed/team1/200/200"} alt="Team member" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Jane Doe</h3>
                <p className="text-sm text-muted-foreground">Founder & CEO</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={"https://picsum.photos/seed/team2/200/200"} alt="Team member" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">John Smith</h3>
                <p className="text-sm text-muted-foreground">Lead Developer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
