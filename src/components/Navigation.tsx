import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboard, Users, Shield } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const [isAdmin] = useState(true); // TODO: Replace with actual auth logic

  const navItems = [
    {
      title: "Client Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: Building2,
    },
    ...(isAdmin
      ? [
          {
            title: "Admin Dashboard",
            href: "/admin/projects",
            icon: Shield,
          },
          {
            title: "Users",
            href: "/users",
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">BuildTrack</h1>
      </div>
      <div className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}