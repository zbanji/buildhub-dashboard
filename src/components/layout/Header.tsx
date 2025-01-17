import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserMenu } from "../UserMenu";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
  userName: string | null;
  onSignOut: () => void;
}

export function Header({ user, userName, onSignOut }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-purple-50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            BuildHub
          </h1>
          <div className="flex items-center gap-4">
            {user && <UserMenu user={user} userName={userName} onSignOut={onSignOut} />}
          </div>
        </div>
      </div>
    </header>
  );
}