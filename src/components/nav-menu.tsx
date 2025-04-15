"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { GlitchText } from "@/components/effects/glitch-text";

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
      {/* <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button> */}

      {/* Desktop menu */}
      <nav className="hidden items-center space-x-4 lg:flex">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap p-2 text-sm transition-colors hover:text-primary"
          >
            {/* <GlitchText text={link.label} /> */}
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
              {/* <GlitchText text={"Profile - " + session.user.username} /> */}
              {"Profile - " + session.user.username}
            </Link>
            <Link
              href="/api/auth/signout"
              className="whitespace-nowrap text-sm transition-colors hover:text-red-500"
            >
              {/* <GlitchText text="Logout" /> */}
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/api/auth/signin"
              className="whitespace-nowrap text-sm transition-colors hover:text-green-500"
            >
              {/* <GlitchText text="Login" /> */}
              Login
            </Link>
            <Link
              href="/spy/register"
              className="whitespace-nowrap text-sm transition-colors hover:text-green-500"
            >
              {/* <GlitchText text="Login" /> */}
              Register
            </Link>
          </>
        )}
      </nav>

      {/* Mobile menu */}
      {/* Wrapper to ensure positioning is relative to this container */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile menu (position now relative) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed right-2 z-30 mr-2 mt-2 w-fit rounded-md border bg-black bg-opacity-100 py-1 shadow-lg lg:hidden"
            >
              <nav className="z-30 flex flex-col rounded-md bg-black bg-opacity-100">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    {/* <GlitchText text={link.label} /> */}
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
                      {/* <GlitchText text="Profile" /> */}
                      Profile
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-sm transition-colors hover:text-red-500"
                    >
                      {/* <GlitchText text="Logout" /> */}
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm transition-colors hover:text-green-500"
                  >
                    {/* <GlitchText text="Login" /> */}
                    Login
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
