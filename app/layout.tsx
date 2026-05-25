import type { Metadata } from 'next';
<<<<<<< HEAD
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
=======
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
>>>>>>> ea3da3f4bccdb84663326d1d73f0772260b0b102
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Ceylon Curry Pot – Authentic Sri Lankan Cuisine',
  description:
    'Experience the rich heritage of Sri Lankan cuisine, delivered fresh to your doorstep. Handcrafted recipes, bold spices, and authentic flavors.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
=======
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.payhere.lk/lib/payhere.js"
          strategy="beforeInteractive"
        />
        <Providers>
          {children}
        </Providers>
>>>>>>> ea3da3f4bccdb84663326d1d73f0772260b0b102
      </body>
    </html>
  );
}
