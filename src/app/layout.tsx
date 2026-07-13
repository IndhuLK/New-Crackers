import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Providers from '@/context/Providers';
import { Toaster } from 'react-hot-toast';
import FloatingActions from '@/components/FloatingActions';
import type { Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Dheeran Crackers',
  description: 'Premium fireworks for your special celebrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden w-full`}>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Header />
            <CartDrawer />
            <main className="grow pt-16">
              {children}
            </main>
            <Footer />
            <FloatingActions />
          </Providers>
        </div>
      </body>
    </html>
  );
}
