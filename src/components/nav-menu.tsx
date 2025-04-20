"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/spy", label: "Home" },
  { href: "/spy/game", label: "Game" },
  { href: "/spy/customize", label: "Customize" },
  { href: "/spy/training", label: "Training" },
  { href: "/spy/museum", label: "Museum" },
  { href: "/spy/AI", label: "AI Interface" },
  { href: "/spy/faq", label: "FAQ" },
];

export function NavMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [seed] = useState(Math.random() * 1000);

  return (
    <div className="relative">
      {/* Hamburger button for mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop menu */}
      <nav className="hidden items-center space-x-4 lg:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap p-2 text-sm transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}

        {/* Session-based links */}
        {session ? (
          <>
            <Link
              href="/spy/profile"
              className="whitespace-nowrap text-sm transition-colors hover:text-primary"
            >
              {"Profile - " + session.user.username}
            </Link>
            <Link
              href="/api/auth/signout"
              className="whitespace-nowrap text-sm transition-colors hover:text-red-500"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/api/auth/signin"
              className="whitespace-nowrap text-sm transition-colors hover:text-green-500"
            >
              Login
            </Link>
            <Link
              href="/spy/register"
              className="whitespace-nowrap text-sm transition-colors hover:text-green-500"
            >
              Register
            </Link>
          </>
        )}
      </nav>

      {/* Mobile menu */}
      <div className="relative z-50">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="fixed right-2 z-50 mr-2 mt-2 w-fit translate-y-0 transform rounded-md border bg-black bg-opacity-100 py-1 opacity-100 shadow-lg transition-all duration-200 ease-in-out lg:hidden"
            style={{
              transition:
                "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
            }}
          >
            <nav className="z-30 flex flex-col rounded-md bg-black bg-opacity-100">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm transition-colors hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/spy/profile"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm transition-colors hover:text-red-500"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <Link
                  href="/api/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm transition-colors hover:text-green-500"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
