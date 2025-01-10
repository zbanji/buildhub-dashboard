import { Navigation } from "./Navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">{children}</main>
    </div>
  );
}