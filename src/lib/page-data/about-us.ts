
export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export type TeamMemberData = {
  name: string;
  role: string;
  imageUrl: string;
  socials: SocialLinks;
};

export const aboutUsStory = {
  title: 'Our Story',
  paragraphs: [
    'Petopia was born from the passion and creativity of a dedicated team of interns as part of the Infosys SpringBoard program. Our goal was to apply our developing skills to a real-world challenge, and we chose to focus on a cause close to our hearts: animal welfare.',
    'This platform is the culmination of our internship project, where we explored full-stack web development, UI/UX design, and the power of AI to make a positive impact. We aimed to create a user-friendly application that simplifies the process of pet adoption, reporting lost and found animals, and connecting a community of pet lovers. We are proud to present Petopia as a testament to our learning, collaboration, and dedication.',
  ],
};

export const mentorsData: TeamMemberData[] = [
  { 
    name: "Mentor One", 
    role: "Project Mentor", 
    imageUrl: "https://picsum.photos/seed/mentor1/200/200", 
    socials: { 
      linkedin: "#", 
      twitter: "#" 
    } 
  },
  { 
    name: "Mentor Two", 
    role: "Technical Mentor", 
    imageUrl: "https://picsum.photos/seed/mentor2/200/200", 
    socials: { 
      github: "#", 
      linkedin: "#" 
    } 
  },
];

export const leadData: TeamMemberData = {
  name: "Supriya Khanra",
  role: "Lead Developer, Frontend, Backend, API Intrigation",
  imageUrl: "https://picsum.photos/seed/lead1/200/200",
  socials: { 
    github: "https://github.com/supriyakhanra", 
    linkedin: "#", 
    twitter: "#" 
  }
};

export const membersData: TeamMemberData[] = [
  { name: "Member One", role: "Frontend Developer", imageUrl: "https://picsum.photos/seed/member1/200/200", socials: { github: "#", linkedin: "#", twitter: "#" } },
  { name: "Member Two", role: "Backend Developer", imageUrl: "https://picsum.photos/seed/member2/200/200", socials: { github: "#", linkedin: "#" } },
  { name: "Member Three", role: "UI/UX Designer", imageUrl: "https://picsum.photos/seed/member3/200/200", socials: { linkedin: "#", twitter: "#" } },
  { name: "Member Four", role: "AI Specialist", imageUrl: "https://picsum.photos/seed/member4/200/200", socials: { github: "#", linkedin: "#" } },
  { name: "Member Five", role: "QA Tester", imageUrl: "https://picsum.photos/seed/member5/200/200", socials: { linkedin: "#" } },
  { name: "Member Six", role: "DevOps Engineer", imageUrl: "https://picsum.photos/seed/member6/200/200", socials: { github: "#", linkedin: "#", twitter: "#" } },
];
