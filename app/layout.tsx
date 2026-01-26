import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import { PostHogProvider } from '../components/providers'

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AndieSay",
  description: "Escuela de comedia musical",
};

/**
 * Root layout component that provides global fonts, analytics context, navigation, and a decorative light-rays background.
 *
 * @param children - The page content to render inside the layout
 * @returns The top-level HTML structure for the application (html > body) that wraps `children` with fonts, a PostHog analytics provider, the `Navbar`, and the `LightRays` background layer
 */
export default function RootLayout({



  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <PostHogProvider>
          <Navbar />

          <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays
              raysOrigin="top-center-offset"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={0.9}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0.0}
              distortion={0.01}
            />
          </div>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
