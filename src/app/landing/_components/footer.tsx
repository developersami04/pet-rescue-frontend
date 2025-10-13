
'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const footerNav = [
    {
        title: "Pets",
        links: [
            { label: "Find a Pet", href: "/pets" },
            { label: "Categories", href: "/pet-categories" },
            { label: "Success Stories", href: "/stories" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ]
    }
];

export function Footer() {
    return (
        <footer className="bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <Logo />
                        <p className="text-muted-foreground text-sm">
                            Our mission is to connect loving homes with pets in need, making the world a better place one adoption at a time.
                        </p>
                         <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="#" aria-label="Github"><Github className="h-5 w-5" /></Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
                            </Button>
                             <Button variant="ghost" size="icon" asChild>
                                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
                            </Button>
                        </div>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {footerNav.map((section) => (
                            <div key={section.title}>
                                <h4 className="font-semibold mb-3">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 pt-6 border-t">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Pet Rescue. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
