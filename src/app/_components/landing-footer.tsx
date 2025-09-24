export function LandingFooter() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-6 px-4 md:px-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Pet-Pal. All rights reserved.</p>
      </div>
    </footer>
  );
}
