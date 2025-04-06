"use client";

import type React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SpyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="container mx-auto p-4"
        >
          {session ? (
            children
          ) : (
            <div className="space-y-4 text-center text-red-500">
              <h2 className="text-2xl font-bold">ACCESS DENIED</h2>
              <Link href="/api/auth/signin" className="text-white underline">
                Go to Login
              </Link>
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
