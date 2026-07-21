import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Müşteri Deneyimi</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">Kargo ve Teslimat Politikamız</h1>
        <p className="text-xs text-muted-foreground mt-2">Siparişlerinizin size en güvenli ve hızlı şekilde ulaşması bizim önceliğimizdir.</p>
      </div>

      {/* Info Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <Truck className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">Ücretsiz Kargo</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            1000 TL ve üzeri tüm alışverişlerinizde kargo ücreti tamamen Charme tarafından karşılanır.
          </p>
        </div>
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <Clock className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">Hızlı Teslimat</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hafta içi saat 14:00'e kadar verilen siparişler aynı gün kargoya teslim edilmektedir.
          </p>
        </div>
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <ShieldCheck className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">Güvenli Paketleme</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tüm cam ve likit kozmetik ürünleri, kırılmayı önleyen özel koruyucu ambalajlarla paketlenir.
          </p>
        </div>
      </div>

      {/* Details text */}
      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6 text-xs sm:text-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">1. Teslimat Süreleri</h2>
          <p>
            Siparişleriniz kargoya verildikten sonra kargo firmasının yoğunluğuna ve teslimat adresinizin mesafesine bağlı olarak <strong>1 ila 3 iş günü</strong> içerisinde teslim edilir. Mobil bölgelerde (il merkezine uzak ilçeler veya köyler) bu süre kargo firmasının haftalık dağıtım günlerine göre değişiklik gösterebilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">2. Kargo Firmaları</h2>
          <p>
            Charme olarak gönderilerimizi Türkiye'nin en prestijli kargo firmalarından biri olan <strong>Yurtiçi Kargo</strong> ile gerçekleştirmekteyiz. Siparişiniz kargoya verildiğinde size SMS ve e-posta yoluyla kargo takip numarası iletilecektir. Takip numaranız ile kargonuzun durumunu kolayca izleyebilirsiniz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">3. Hasarlı Kargolar</h2>
          <p>
            Kargonuzu teslim alırken pakette herhangi bir yırtılma, ezilme veya ıslaklık görüyorsanız lütfen kargo görevlisinin önünde paketi açın ve ürünlerin hasar alıp almadığını kontrol edin. Hasar durumunda kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturarak paketi teslim almadan iade edin ve durumu hemen destek ekibimize bildirin.
          </p>
        </section>
      </div>

    </div>
  );
}
