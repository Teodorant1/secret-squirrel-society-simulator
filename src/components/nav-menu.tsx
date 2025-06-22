"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/spy", label: "Home" },
  { href: "/spy/game", label: "Game" },
  // { href: "/spy/customize", label: "Customize" },
  // { href: "/spy/training", label: "Training" },
  { href: "/spy/museum", label: "Museum" },
  { href: "/spy/AI", label: "AI Interface" },
  { href: "/spy/faq", label: "FAQ" },
  {
    href: "https://multiversal-mishaps.vercel.app/about-creator",
    label: "About creator (leads to different website)",
  },
];

export function NavMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-start">
      {/* Hamburger button (shown on small screens) */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-2 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Responsive nav */}
      <nav
        className={`flex flex-col space-y-2 ${isOpen ? "block" : "hidden"} lg:flex lg:flex-row lg:space-x-4 lg:space-y-0`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap p-2 text-sm transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}

        {session ? (
          <>
            <Link
              href="/api/auth/signout"
              className="whitespace-nowrap p-2 text-sm transition-colors hover:text-red-500"
            >
              Logout - {session.user.username}
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/api/auth/signin"
              className="whitespace-nowrap p-2 text-sm transition-colors hover:text-green-500"
            >
              Login
            </Link>
            <Link
              href="/spy/register"
              className="whitespace-nowrap p-2 text-sm transition-colors hover:text-green-500"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
