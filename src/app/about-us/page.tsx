
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { aboutUsStory, mentorsData, leadData, membersData, type TeamMemberData, techStackData } from "@/lib/page-data/about-us";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        <AvatarImage src={member.imageUrl} alt={member.name} />
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 1.6 3.6 0 5.4-2.2 2.7-4.2 4.3-8.2 4.3-2 0-4.5-.5-7.2-2.3 2.5.2 4.1-.7 5.4-2.2-1.4 0-2.2.6-3.2 2.1 1-.2 1.9-.6 2.6-1.3-.8.2-1.6.4-2.8 1.1C2.5 14.5 2 13 2 11.5c.8.4 1.5.6 2.3.6-1-1.3-1-3.1.2-4.5 1.5 2.3 3.6 3.6 6.7 3.6 0-.6.3-2.1 2.1-3.6 1.1-.9 2.5-1.1 3.8-1 .9.1 1.7.5 2.3 1.1.8-.1 1.7-.5 2.5-1-.2.7-.8 1.3-1.6 1.8.7-.1 1.4-.3 2.1-.5z" /></svg>
          </SocialLink>
        )}
      </div>
    </div>
  )
}

function TechCategory({ title, techs }: { title: string, techs: { name: string }[] }) {
    return (
        <div>
            <h4 className="font-semibold text-md mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                    <Badge key={tech.name} variant="secondary">{tech.name}</Badge>
                ))}
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
            <CardTitle>Our Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TechCategory title="Frontend" techs={techStackData.frontend} />
            <TechCategory title="Backend" techs={techStackData.backend} />
            <TechCategory title="Database" techs={techStackData.database} />
            <TechCategory title="Media & Deployment" techs={techStackData.mediaAndDeployment} />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Meet the Team</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="mentors" className="w-full">
                    <AccordionItem value="mentors">
                        <AccordionTrigger className="text-lg font-semibold">Our Mentors</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {mentorsData.map((mentor) => (
                                    <TeamMember key={mentor.name} member={mentor} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="lead">
                        <AccordionTrigger className="text-lg font-semibold">Team Lead</AccordionTrigger>
                        <AccordionContent className="pt-4 flex justify-center">
                            <div className="w-full max-w-xs">
                                <TeamMember member={leadData} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="members">
                        <AccordionTrigger className="text-lg font-semibold">Team Members</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {membersData.map((member) => (
                                    <TeamMember key={member.name} member={member} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
