import { HeaderNav } from "@/components/header-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
