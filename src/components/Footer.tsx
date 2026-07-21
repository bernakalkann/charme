import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* Top Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-primary-foreground/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-foreground/5 rounded-full text-secondary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">Dermatolojik Test</h4>
              <p className="mt-1 text-xs text-muted-foreground text-gray-300">Tüm ürünlerimiz hassas ciltler için dermatolojik olarak test edilmiştir.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-foreground/5 rounded-full text-secondary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">Cruelty-Free & Vegan</h4>
              <p className="mt-1 text-xs text-muted-foreground text-gray-300">Hayvanlar üzerinde test edilmeyen temiz ve vegan bileşenler kullanıyoruz.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-foreground/5 rounded-full text-secondary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">%100 Orijinal Ürün</h4>
              <p className="mt-1 text-xs text-muted-foreground text-gray-300">Resmi distribütör onaylı orijinal lüks kozmetik garantisi sunuyoruz.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-secondary" />
              <span className="font-serif text-2xl font-semibold tracking-wider text-white">CHARME</span>
            </Link>
            <p className="text-sm text-gray-300 max-w-md">
              Güzelliğinizi taçlandıran, lüks kozmetik markalarının ve temiz cilt bakım formüllerinin dijital buluşma noktası.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/bernakalkann/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.instagram.com/bernakalkann/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">Koleksiyonlar</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <Link href="/cilt-bakimi" className="text-sm text-gray-300 hover:text-white transition-colors">Cilt Bakımı</Link>
                  </li>
                  <li>
                    <Link href="/makyaj" className="text-sm text-gray-300 hover:text-white transition-colors">Makyaj</Link>
                  </li>
                  <li>
                    <Link href="/parfum" className="text-sm text-gray-300 hover:text-white transition-colors">Parfüm</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">Müşteri İlişkileri</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <Link href="/kargo-ve-teslimat" className="text-sm text-gray-300 hover:text-white transition-colors">Kargo & Teslimat</Link>
                  </li>
                  <li>
                    <Link href="/iade-kosullari" className="text-sm text-gray-300 hover:text-white transition-colors">İade Koşulları</Link>
                  </li>
                  <li>
                    <Link href="/sss" className="text-sm text-gray-300 hover:text-white transition-colors">Sıkça Sorulan Sorular</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-secondary uppercase font-sans">Bize Ulaşın</h3>
              <p className="mt-4 text-sm text-gray-300">
                E-posta: support@charme.com <br />
                Telefon: +90 212 555 55 55
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Çalışma Saatleri: Hafta içi 09:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CHARME Cosmetics. Tüm Hakları Saklıdır.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link>
            <Link href="/kvkk-aydinlatma-metni" className="hover:underline">KVKK Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
