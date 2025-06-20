
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import FloatingParticles from "@/components/hero/FloatingParticles";

export const metadata: Metadata = {
  title: 'CouroComencia - Dynamic',
  description: 'Projetos que geram resultados reais.',
  icons: {
    icon: '/imgs/favicon.png', // Updated path to the favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FloatingParticles />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
