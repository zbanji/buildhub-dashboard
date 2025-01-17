import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordDialog } from "./auth/ChangePasswordDialog";

interface UserMenuProps {
  user: User | null;
  userName: string | null;
  onSignOut: () => void;
}

export function UserMenu({ user, userName, onSignOut }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-purple-50 transition-colors"
        >
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{userName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/80 backdrop-blur-md">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:bg-purple-50">
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <ChangePasswordDialog />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="hover:bg-purple-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}