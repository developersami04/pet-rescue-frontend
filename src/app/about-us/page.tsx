

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { aboutUsStory, mentorsData, leadData, membersData, type TeamMemberData } from "@/lib/page-data/about-us";

function SocialLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    </Button>
  );
}

function TeamMember({ member }: { member: TeamMemberData }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow">
      <Avatar className="h-24 w-24">
        <AvatarImage src={`https://picsum.photos/seed/${member.seed}/200/200`} alt={member.name} />
        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-lg">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </div>
      <div className="flex gap-2">
        {member.socials.github && (
          <SocialLink href={member.socials.github}>
            <Github className="h-5 w-5" />
          </SocialLink>
        )}
        {member.socials.linkedin && (
          <SocialLink href={member.socials.linkedin}>
            <Linkedin className="h-5 w-5" />
          </SocialLink>
        )}
        {member.socials.twitter && (
          <SocialLink href={member.socials.twitter}>
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
            <CardTitle>{aboutUsStory.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            {aboutUsStory.paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Mentors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mentorsData.map((mentor) => (
                <TeamMember key={mentor.seed} member={mentor} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Lead</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
              <div className="w-full max-w-xs">
                <TeamMember member={leadData} />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {membersData.map((member) => (
                <TeamMember key={member.seed} member={member} />
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
