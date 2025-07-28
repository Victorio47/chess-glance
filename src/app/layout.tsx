import { Geist, Geist_Mono } from "next/font/google";
import '@/styles/globals.css';
import { GrandmastersProvider } from '@/features/players/context/GrandmastersContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chess Glance",
  description: "Quick view of Chess.com grandmasters and their profiles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GrandmastersProvider>
          {children}
        </GrandmastersProvider>
      </body>
    </html>
  );
} 