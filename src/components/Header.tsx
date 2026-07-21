'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Trash2, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartStore = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydration fix for Zustand
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cartStore.getItemsCount() : 0;
  const cartItems = mounted ? cartStore.items : [];
  const cartSubtotal = mounted ? cartStore.getCartSubtotal() : 0;

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { href: '/cilt-bakimi', label: 'Cilt Bakımı' },
    { href: '/makyaj', label: 'Makyaj' },
    { href: '/parfum', label: 'Parfüm' },
  ];

  return (
    <>
      {/* Top Premium Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-[10px] font-semibold tracking-widest uppercase border-b border-primary-foreground/10 flex items-center justify-center gap-4">
        <span>✨ İLK ÜYELİĞE ÖZEL %10 İNDİRİM KODU: <strong className="text-secondary">WELCOME10</strong></span>
        <span className="hidden sm:inline text-primary-foreground/40">|</span>
        <span className="hidden sm:inline">📦 1000 TL ÜZERİ ÜCRETSİZ KARGO</span>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex md:flex-1 lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-secondary" />
              <span className="font-serif text-2xl font-semibold tracking-wider text-primary">CHARME</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-secondary ${
                  pathname === link.href ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end space-x-4 sm:space-x-6">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground/80 hover:text-secondary transition-colors"
              aria-label="Arama"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Profile Menu */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-foreground/80 hover:text-secondary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline text-xs font-medium max-w-[80px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block transition-all z-50">
                  {session.user && (session.user as any).role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Paneli
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profilim & Siparişlerim
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-foreground/80 hover:text-secondary transition-colors"
                aria-label="Giriş Yap"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/profile?tab=wishlist"
              className="text-foreground/80 hover:text-secondary transition-colors relative"
              aria-label="Favoriler"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-foreground/80 hover:text-secondary transition-colors relative"
              aria-label="Sepet"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-foreground/80 hover:text-secondary transition-colors"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background pt-16 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 pb-6 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted ${
                  pathname === link.href ? 'text-secondary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background w-full px-4 py-6 sm:px-6 shadow-xl">
            <div className="mx-auto max-w-3xl flex items-center justify-between">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ürün, marka veya cilt tipi arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted border-none rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-foreground/60 hover:text-foreground p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {searchQuery && (
              <div className="mx-auto max-w-3xl mt-4 divide-y divide-border/60 bg-card rounded-lg p-2 max-h-96 overflow-y-auto">
                {/* Search result helper */}
                <div className="p-3 text-xs text-muted-foreground">
                  Gelişmiş arama sonuçları için enter tuşuna basın veya filtreleri kullanın.
                </div>
                <Link
                  href={`/cilt-bakimi?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="block p-3 text-sm hover:bg-muted rounded-md transition-colors text-primary font-medium"
                >
                  &ldquo;{searchQuery}&rdquo; aramasını katalogda göster
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-background shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-serif font-semibold text-primary">Sepetim ({cartCount})</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-foreground/60 hover:text-foreground p-2 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {cartSubtotal > 0 && (
                <div className="px-6 py-3 bg-secondary/10 border-b border-secondary/20">
                  {cartSubtotal >= 1000 ? (
                    <p className="text-xs text-secondary-foreground font-medium flex items-center gap-1">
                      🎉 Tebrikler! Ücretsiz Kargo avantajından yararlanıyorsunuz.
                    </p>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Ücretsiz kargo için <span className="font-semibold text-primary">{Math.max(0, 1000 - cartSubtotal)} TL</span> daha ekleyin!
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-secondary h-1.5 transition-all duration-300" 
                          style={{ width: `${Math.min(100, (cartSubtotal / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Sepetiniz boş.</p>
                      <p className="text-xs text-muted-foreground mt-1">Hemen alışverişe başlayın ve lüks ürünleri keşfedin!</p>
                    </div>
                    <Link
                      href="/cilt-bakimi"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      Alışverişe Başla
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.variantId} className="flex py-4 border-b border-border/40 gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-primary">
                            <h3 className="line-clamp-1">
                              <Link href={`/product/${item.productSlug}`} onClick={() => setIsCartOpen(false)}>
                                {item.productName}
                              </Link>
                            </h3>
                            <p className="ml-4 font-serif">{item.price * item.quantity} TL</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{item.variantName}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center border border-border rounded-full bg-muted">
                            <button
                              onClick={() => cartStore.updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1 px-2.5 text-foreground/60 hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-1 text-primary font-medium">{item.quantity}</span>
                            <button
                              onClick={() => cartStore.updateQuantity(item.variantId, item.quantity + 1)}
                              className="p-1 px-2.5 text-foreground/60 hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => cartStore.removeItem(item.variantId)}
                            className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 py-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-border px-6 py-6 bg-card space-y-4">
                  <div className="flex justify-between text-base font-medium text-primary">
                    <span>Ara Toplam</span>
                    <span className="font-serif font-semibold">{cartSubtotal} TL</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kargo ve vergi ödeme adımında hesaplanacaktır. 1000 TL üzeri kargo ücretsizdir.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="flex items-center justify-center w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
                    >
                      Siparişi Tamamla
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
