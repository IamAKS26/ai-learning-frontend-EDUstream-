import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalNotesWrapper } from "@/components/GlobalNotesWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter", // mapped to same CSS var for backwards compatibility
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduStream — Educational Platform",
  description: "Personalized AI learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background-dark text-slate-900 antialiased selection:bg-primary/20 selection:text-primary">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            {children}
            <GlobalNotesWrapper />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
