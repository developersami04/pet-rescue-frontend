
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
    'The Infosys Springboard Internship 6.0 is a transformative learning experience designed to bridge the gap between academic knowledge and industry expectations. Through this internship, aspiring engineers and developers get the opportunity to explore real-world problems, apply modern technologies, and develop innovative solutions under professional mentorship.',
    
    'Our project under this program focuses on fostering creativity, collaboration, and technical excellence. With a strong emphasis on hands-on implementation, we explored end-to-end software development processes — from brainstorming ideas and designing prototypes to building, testing, and deploying functional systems.',

    'The internship encouraged participants to think beyond conventional boundaries and embrace a full-stack approach. Our technology stack includes a frontend built with Next.js, React, TypeScript, and Tailwind CSS; a backend powered by Django and the Django REST Framework; a PostgreSQL database; and Cloudinary for media management. Every step of the journey was guided by a spirit of innovation and continuous learning.',

    'At its core, the Petopia project aims to empower young minds to turn ideas into impactful digital solutions while nurturing professional ethics, teamwork, and problem-solving skills. It’s more than just an internship — it’s a launchpad into the world of technology and innovation.'
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
  imageUrl: "https://github.com/supriyakhanra.png",
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
