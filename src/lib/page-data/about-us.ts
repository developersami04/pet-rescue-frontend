
export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export type TeamMemberData = {
  name: string;
  role: string;
  imageUrl?: string;
  socials: SocialLinks;
};

export const aboutUsStory = {
  title: 'Our Story',
  paragraphs: [
    'Petopia was born from the passion and creativity of a dedicated team of interns as part of the Infosys SpringBoard program. Our goal was to apply our developing skills to a real-world challenge, and we chose to focus on a cause close to our hearts: animal welfare.',
    'The Infosys Springboard Internship 6.0 is a transformative learning experience designed to bridge the gap between academic knowledge and industry expectations. Through this internship, aspiring engineers and developers get the opportunity to explore real-world problems, apply modern technologies, and develop innovative solutions under professional mentorship.',
    'Our project under this program focuses on fostering creativity, collaboration, and technical excellence. With a strong emphasis on hands-on implementation, we explored end-to-end software development processes — from brainstorming ideas and designing prototypes to building, testing, and deploying functional systems.',
    'The internship encouraged participants to think beyond conventional boundaries and embrace a full-stack approach. Every step of the journey was guided by a spirit of innovation and continuous learning.',
    'At its core, the Petopia project aims to empower young minds to turn ideas into impactful digital solutions while nurturing professional ethics, teamwork, and problem-solving skills. It’s more than just an internship — it’s a launchpad into the world of technology and innovation.'
  ],
};

export const techStackData = {
  frontend: [
    { name: 'Next.js' },
    { name: 'React' },
    { name: 'TypeScript' },
    { name: 'Tailwind CSS' },
    { name: 'ShadCN UI' },
  ],
  backend: [
    { name: 'Django' },
    { name: 'Django REST Framework' },
  ],
  database: [
    { name: 'PostgreSQL' },
  ],
  mediaAndDeployment: [
    { name: 'Cloudinary (CDN)' },
    { name: 'Vercel' },
    { name: 'Render' },
  ]
};

export const mentorsData: TeamMemberData[] = [
  { 
    name: "Mentor One", 
    role: "Project Mentor", 
    socials: { 
      linkedin: "#", 
      twitter: "#" 
    } 
  },
  { 
    name: "Mentor Two", 
    role: "Technical Mentor", 
    socials: { 
      github: "#", 
      linkedin: "#" 
    } 
  },
];

export const leadData: TeamMemberData = {
  name: "Supriya Khanra",
  role: "Lead Developer, Frontend, Backend, API Intrigation",
  imageUrl: "https://github.com/supriyakhanra.png",
  socials: { 
    github: "https://github.com/supriyakhanra", 
    linkedin: "#", 
    twitter: "#" 
  }
};

export const membersData: TeamMemberData[] = [
  { name: "Member One", role: "Frontend Developer", socials: { github: "#", linkedin: "#", twitter: "#" } },
  { name: "Member Two", role: "Backend Developer", socials: { github: "#", linkedin: "#" } },
  { name: "Member Three", role: "UI/UX Designer", socials: { linkedin: "#", twitter: "#" } },
  { name: "Member Four", role: "AI Specialist", socials: { github: "#", linkedin: "#" } },
  { name: "Member Five", role: "QA Tester", socials: { linkedin: "#" } },
  { name: "Member Six", role: "DevOps Engineer", socials: { github: "#", linkedin: "#", twitter: "#" } },
];
