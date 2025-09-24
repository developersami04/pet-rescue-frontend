
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-wider text-foreground">
              Pet-Pal
            </span>
          </Link>
          <nav className="flex items-center gap-4">
             <Button variant="ghost" asChild>
                <Link href="/dashboard">Home</Link>
             </Button>
            <Button asChild>
              <Link href="/pets">Find a Pet</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline shadow-2xl">
              Find Your Forever Friend
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl shadow-2xl">
              Connecting loving homes with adorable pets in need. Start your journey to find the perfect companion today.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/pets">Browse Pets</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/matching">AI Pet Matcher</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Why Adopt?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                  <PawPrint className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Save a Life</h3>
                <p className="text-muted-foreground">You're giving a deserving animal a second chance at a happy life.</p>
              </div>
              <div className="text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m21 17-3.4-1.4c-.4-.2-.8-.2-1.2 0L14 17"/><path d="M15 18H9a2 2 0 1 1 0-4h8a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L7 11"/><path d="m17 11-3.4-1.4c-.4-.2-.8-.2-1.2 0L10 11"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fight Puppy Mills</h3>
                <p className="text-muted-foreground">Choosing adoption helps stop the cycle of pet overpopulation and cruelty.</p>
              </div>
              <div className="text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12a10 10 0 0 0 10 10V12H12z"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Cost-Effective</h3>
                <p className="text-muted-foreground">Adoption fees are much lower than buying from a breeder and often include vaccinations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary">
        <div className="container mx-auto py-6 px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pet-Pal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
