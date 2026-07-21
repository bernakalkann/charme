import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Charme | Lüks Kozmetik & Cilt Bakımı Mağazası',
  description: 'Premium cilt bakımı, makyaj ve parfüm koleksiyonları. Temiz içerik, Cruelty-Free ve vegan formüllerle cildinizi şımartın.',
  keywords: ['kozmetik', 'cilt bakımı', 'lüks makyaj', 'parfüm', 'temiz içerik', 'cruelty-free', 'vegan kozmetik'],
  authors: [{ name: 'Charme Beauty' }],
  openGraph: {
    title: 'Charme | Lüks Kozmetik & Cilt Bakımı Mağazası',
    description: 'Premium cilt bakımı, makyaj ve parfüm koleksiyonları.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://charme-cosmetics.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
