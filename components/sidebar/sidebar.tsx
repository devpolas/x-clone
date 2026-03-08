"use client";
import { authClient } from "@/lib/actions/client/auth-client";
import { Home, LogOut, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { NotificationBadge } from "../notification/notification";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/actions/server/auth-actions";

function getNavigation(username?: string) {
  return [
    { name: "Home", href: "/", icon: Home },
    { name: "Notifications", href: "/notifications", icon: "notification" },
    { name: "Profile", href: `/profile/${username}`, icon: User },
  ];
}

export default function Sidebar() {
  const pathname = usePathname();
  const session = authClient.useSession();
  const username = session.data?.user?.username ?? "";
  const navigation = getNavigation(username);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className='flex flex-col bg-background border-border border-r w-64 h-screen'>
      <div className='p-4'>
        <div className='flex justify-center items-center bg-primary rounded-full w-8 h-8'>
          <span className='font-bold text-primary-foreground text-lg'>X</span>
        </div>
      </div>

      {/* navigation */}
      <nav className='flex-1 space-y-1 px-4'>
        {navigation.map((item, key) => {
          const isActive =
            item.name === "Profile"
              ? pathname.startsWith("/profile")
              : item.href === pathname;
          const Icon = item.icon;
          return (
            <Link className='cursor-pointer' href={item.href} key={key}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className='justify-start px-4 w-full h-12'
              >
                {item.icon === "notification" ? (
                  <NotificationBadge />
                ) : (
                  <Icon className='mr-4 w-5 h-5' />
                )}
                <span className='ml-4 text-lg'>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* profile section  */}
      <div className='p-4 border-border border-t'>
        <div className='flex justify-between items-center space-x-3 hover:bg-muted p-4 rounded-md'>
          <Link
            className='flex flex-row justify-center gap-2 cursor-pointer'
            href={`/profile/${username}`}
          >
            <Avatar className='w-10 h-10'>
              <AvatarImage src={session.data?.user?.avatar ?? ""} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
              <p className='font-medium text-foreground text-sm truncate'>
                {session.data?.user?.name}
              </p>
              <p className='text-muted-foreground text-sm truncate'>
                @{username}
              </p>
            </div>
          </Link>

          {/* logout logic  */}
          <div className='relative' ref={dropdownRef}>
            <Button
              className='hover:bg-muted/50 p-1 rounded-full transition-colors'
              variant={"ghost"}
              onClick={() => setIsDropdownOpen((pre) => !pre)}
            >
              <MoreHorizontal className='w-5 h-5 text-muted-foreground' />
            </Button>
            {isDropdownOpen && (
              <div className='bottom-full left-0 z-50 absolute bg-background mb-2 border border-border rounded-lg w-48'>
                <Button
                  variant={"ghost"}
                  className='flex items-center space-x-2 hover:bg-muted/50 px-4 py-2 w-full text-red-500 text-sm text-left'
                  onClick={() => signOut()}
                >
                  <LogOut />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
