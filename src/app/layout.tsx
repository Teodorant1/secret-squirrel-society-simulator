import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import AuthProvider from "@/components/auth/provider";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "secret-squirrel-society-simulator",
  description:
    "A game of deception, strategy, and political intrigue. Choose your theme and dive into a world of hidden agendas and shifting alliances.",
  // icons: [{ rel: "icon", url: "/favicon.jpeg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <AuthProvider>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
