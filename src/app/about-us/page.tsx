
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function TeamMember({ name, role, seed }: { name: string, role: string, seed: string }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={`https://picsum.photos/seed/${seed}/200/200`} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="About Petopia"
        description="Our mission is to connect loving homes with pets in need."
      />
      <div className="grid gap-8 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Petopia was born from the passion and creativity of a dedicated team of interns as part of the Infosys SpringBoard program. Our goal was to apply our developing skills to a real-world challenge, and we chose to focus on a cause close to our hearts: animal welfare.
            </p>
            <p>
              This platform is the culmination of our internship project, where we explored full-stack web development, UI/UX design, and the power of AI to make a positive impact. We aimed to create a user-friendly application that simplifies the process of pet adoption, reporting lost and found animals, and connecting a community of pet lovers. We are proud to present Petopia as a testament to our learning, collaboration, and dedication.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <TeamMember name="Lead Name" role="Project Lead" seed="lead1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Mentors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TeamMember name="Mentor One" role="Project Mentor" seed="mentor1" />
              <TeamMember name="Mentor Two" role="Technical Mentor" seed="mentor2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TeamMember name="Member One" role="Frontend Developer" seed="member1" />
            <TeamMember name="Member Two" role="Backend Developer" seed="member2" />
            <TeamMember name="Member Three" role="UI/UX Designer" seed="member3" />
            <TeamMember name="Member Four" role="AI Specialist" seed="member4" />
            <TeamMember name="Member Five" role="QA Tester" seed="member5" />
            <TeamMember name="Member Six" role="DevOps Engineer" seed="member6" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
