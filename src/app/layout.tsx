import type { Metadata } from 'next';
import { Rajdhani, Manrope, Inter } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SERVE Builder · Infraestructura de Soporte de Élite',
  description: 'Configura y despliega portales operativos de soporte en Whop.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${rajdhani.variable} ${manrope.variable} ${inter.variable}`}>
      <body className="bg-[#0B0A09] text-[#E8E1D4] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}