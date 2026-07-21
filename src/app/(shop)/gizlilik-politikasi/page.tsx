import React from 'react';
import { ShieldCheck, EyeOff, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Bilgi Güvenliği</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">Gizlilik Politikası</h1>
        <p className="text-xs text-muted-foreground mt-2">Kişisel verilerinizin gizliliğini korumak bizim en temel prensibimizdir.</p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <Lock className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">SSL Şifreleme</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sitemiz üzerinden gerçekleştirdiğiniz tüm işlemler 256-bit SSL sertifikasıyla şifrelenmektedir.
          </p>
        </div>
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <ShieldCheck className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">Veri Paylaşımı Yok</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kişisel bilgileriniz, yasal zorunluluklar hariç üçüncü şahıslarla asla paylaşılmaz.
          </p>
        </div>
        <div className="bg-card border border-border/40 p-6 rounded-xl space-y-3">
          <EyeOff className="h-6 w-6 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">Çerez Kontrolü</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Çerez tercihlerini dilediğiniz zaman tarayıcı ayarlarınız üzerinden değiştirebilirsiniz.
          </p>
        </div>
      </div>

      {/* Details text */}
      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6 text-xs sm:text-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">1. Toplanan Kişisel Veriler</h2>
          <p>
            Platformumuza üye olurken, bültene kaydolurken veya sipariş oluştururken verdiğiniz ad, soyad, e-posta adresi, telefon numarası, teslimat ve fatura adresleri gibi kişisel verileriniz veri tabanımızda güvenli bir şekilde saklanır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">2. Verilerin Kullanım Amacı</h2>
          <p>
            Toplanan veriler; siparişlerinizin teslimatı, ödeme işlemlerinin doğrulanması, üyelik kayıt işlemlerinin yapılması, kampanya ve indirim bildirimlerinin tarafınıza iletilmesi ve platform deneyiminizin iyileştirilmesi amacıyla işlenmektedir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">3. Kredi Kartı Güvenliği</h2>
          <p>
            Kredi kartı bilgileriniz doğrudan anlaşmalı ödeme aracı kurumumuz (Izyco / PayTR) sunucularına şifreli SSL protokolü ile iletilir. Charme veritabanında kredi kartı numaranız, son kullanma tarihiniz veya güvenlik kodunuz (CVV) <strong>asla saklanmaz veya kaydedilmez</strong>.
          </p>
        </section>
      </div>

    </div>
  );
}
