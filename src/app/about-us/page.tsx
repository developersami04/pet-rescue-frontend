
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SocialLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    </Button>
  );
}

function TeamMember({ 
  name, 
  role, 
  seed,
  github,
  linkedin,
  twitter
}: { 
  name: string, 
  role: string, 
  seed: string,
  github?: string,
  linkedin?: string,
  twitter?: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow">
      <Avatar className="h-24 w-24">
        <AvatarImage src={`https://picsum.photos/seed/${seed}/200/200`} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      <div className="flex gap-2">
        {github && (
          <SocialLink href={github}>
            <Github className="h-5 w-5" />
          </SocialLink>
        )}
        {linkedin && (
          <SocialLink href={linkedin}>
            <Linkedin className="h-5 w-5" />
          </SocialLink>
        )}
        {twitter && (
          <SocialLink href={twitter}>
            <X className="h-5 w-5" />
          </SocialLink>
        )}
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
        
        <Card>
          <CardHeader>
            <CardTitle>Our Mentors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TeamMember name="Mentor One" role="Project Mentor" seed="mentor1" linkedin="#" twitter="#" />
            <TeamMember name="Mentor Two" role="Technical Mentor" seed="mentor2" github="#" linkedin="#" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Lead</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
              <div className="w-full max-w-xs">
                <TeamMember name="Lead Name" role="Project Lead" seed="lead1" github="#" linkedin="#" twitter="#" />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TeamMember name="Member One" role="Frontend Developer" seed="member1" github="#" linkedin="#" twitter="#" />
            <TeamMember name="Member Two" role="Backend Developer" seed="member2" github="#" linkedin="#" />
            <TeamMember name="Member Three" role="UI/UX Designer" seed="member3" linkedin="#" twitter="#" />
            <TeamMember name="Member Four" role="AI Specialist" seed="member4" github="#" linkedin="#" />
            <TeamMember name="Member Five" role="QA Tester" seed="member5" linkedin="#" />
            <TeamMember name="Member Six" role="DevOps Engineer" seed="member6" github="#" linkedin="#" twitter="#" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
