import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Sparkles, ArrowRight, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';

export default async function HomePage() {
  // Query 3 featured products
  const products = await prisma.product.findMany({
    take: 3,
    include: {
      brand: true,
      variants: true,
    },
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-black overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0 opacity-55">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury Cosmetics"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent z-0" />

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-white space-y-6 relative w-full">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-secondary uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Güzelliğin Saf Hali
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-wide leading-tight">
              Cildiniz İçin <br /> Lüks Dokunuşlar
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg">
              Premium kozmetik markaları ve bilimsel olarak kanıtlanmış temiz içerikli ürünlerimizle, doğal ışıltınızı ve güzelliğinizi taçlandırın.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/cilt-bakimi"
              className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground px-8 py-3.5 text-xs font-semibold hover:bg-secondary/90 transition-colors uppercase tracking-widest font-sans"
            >
              Koleksiyonu Keşfet <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Directories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-primary">Kategorileri Keşfedin</h2>
          <p className="text-xs text-muted-foreground">Kişisel bakım rutininiz için her ayrıntıyı düşündük.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative h-80 rounded-2xl overflow-hidden border border-border/40 shadow-xs cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop" 
              alt="Cilt Bakımı" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 space-y-2">
              <h3 className="font-serif text-lg font-bold">Cilt Bakımı</h3>
              <p className="text-[11px] text-gray-300">Nemlendiriciler, Serumlar ve Maskeler</p>
              <Link href="/cilt-bakimi" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                İncele <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="group relative h-80 rounded-2xl overflow-hidden border border-border/40 shadow-xs cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop" 
              alt="Makyaj" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 space-y-2">
              <h3 className="font-serif text-lg font-bold">Makyaj</h3>
              <p className="text-[11px] text-gray-300">Rujlar, Fondötenler ve Allıklar</p>
              <Link href="/makyaj" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                İncele <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="group relative h-80 rounded-2xl overflow-hidden border border-border/40 shadow-xs cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" 
              alt="Parfüm" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 space-y-2">
              <h3 className="font-serif text-lg font-bold">Parfüm</h3>
              <p className="text-[11px] text-gray-300">Lüks Kadın & Erkek Parfümleri</p>
              <Link href="/parfum" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                İncele <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/40 pb-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-primary">Sizin İçin Seçtiklerimiz</h2>
            <p className="text-xs text-muted-foreground mt-1">Bu sezon en popüler lüks ürünleri inceleyin.</p>
          </div>
          <Link href="/cilt-bakimi" className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1">
            Tüm Ürünleri Gör <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {products.map((p) => {
            const hasDiscount = p.discountPrice !== null;
            const price = p.price;
            const discountPrice = p.discountPrice;
            const isOutOfStock = p.variants.every((v) => v.stock === 0);

            return (
              <div 
                key={p.id} 
                className="group relative flex flex-col rounded-xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div className="aspect-h-1 aspect-w-1 w-full bg-muted overflow-hidden relative min-h-[250px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="bg-white/95 text-primary text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase rounded">
                        Tükendi
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">{p.brand.name}</p>
                    <h3 className="text-sm font-semibold text-primary mt-1 line-clamp-1">
                      <Link href={`/product/${p.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {p.name}
                      </Link>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-baseline space-x-2">
                      {hasDiscount ? (
                        <>
                          <span className="font-serif text-sm font-semibold text-primary">{discountPrice} TL</span>
                          <span className="font-serif text-xs text-muted-foreground line-through">{price} TL</span>
                        </>
                      ) : (
                        <span className="font-serif text-sm font-semibold text-primary">{price} TL</span>
                      )}
                    </div>
                    <div className="text-secondary group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Promotional banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border/40 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] bg-secondary/10 text-secondary font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              Yeni Üyelik Bonusu
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-primary">Kozmetik Alışverişinizde %10 İndirim</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Charme dünyasına adım atın. İlk alışverişinizde geçerli %10 indirim kodunu sepetinizde kullanabilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-muted/40 p-4 border border-border/60 rounded-xl">
            <div>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Kupon Kodu</span>
              <span className="font-mono font-bold text-sm text-primary block mt-0.5">WELCOME10</span>
            </div>
            <Link
              href="/cilt-bakimi"
              className="bg-primary text-primary-foreground text-xs font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors uppercase tracking-wider"
            >
              Kullan
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
