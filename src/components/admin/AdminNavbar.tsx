"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AdminNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Derive title from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentSegment = segments[1] || "dashboard";
  const title = currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4 shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-brand-green-dark border-none">
          <AdminSidebar onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="font-playfair text-xl font-bold text-brand-green-dark capitalize">
        {title.replace("-", " ")}
      </h1>
      
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute 1 top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New Order #1042</DropdownMenuItem>
            <DropdownMenuItem>Low Stock: Arabica Coffee</DropdownMenuItem>
            <DropdownMenuItem className="text-brand-green-dark font-medium justify-center">
              View all
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-brand-green-light/20">
                <AvatarFallback className="bg-brand-green-dark text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
