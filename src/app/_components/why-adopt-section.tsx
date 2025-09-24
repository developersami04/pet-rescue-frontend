import { PawPrint } from "lucide-react";

export function WhyAdoptSection() {
  return (
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m21 17-3.4-1.4c-.4-.2-.8-.2-1.2 0L14 17" /><path d="M15 18H9a2 2 0 1 1 0-4h8a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L7 11" /><path d="m17 11-3.4-1.4c-.4-.2-.8-.2-1.2 0L10 11" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Fight Puppy Mills</h3>
            <p className="text-muted-foreground">Choosing adoption helps stop the cycle of pet overpopulation and cruelty.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12a10 10 0 0 0 10 10V12H12z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Cost-Effective</h3>
            <p className="text-muted-foreground">Adoption fees are much lower than buying from a breeder and often include vaccinations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
