import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Progressively enhanced Todos App",
  description: "A Progressively enhanced Todos App built with Next.js, Drizzle ORM, and PostgreSQL",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
