import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CreditLens — AI Credit Analysis Platform",
  description: "Production-grade multi-agent banking credit analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-body">
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-foreground !text-background !border-0 !rounded-none font-body",
            duration: 4000,
          }}
        />
        {children}
      </body>
    </html>
  );
}
