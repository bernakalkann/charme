import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Yasal Metinler</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">Kullanım Koşulları</h1>
        <p className="text-xs text-muted-foreground mt-2">Charme platformunu kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.</p>
      </div>

      {/* Warning box */}
      <div className="bg-muted p-4.5 border border-border/40 rounded-xl flex gap-2 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
        <span>
          Lütfen bu kullanım koşullarını dikkatle okuyunuz. Sitemize giriş yapmanız veya sitemiz üzerinden herhangi bir hizmet almanız, bu koşulları kayıtsız şartsız kabul ettiğiniz anlamına gelir.
        </span>
      </div>

      {/* Details text */}
      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6 text-xs sm:text-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">1. Hizmetlerin Tanımı</h2>
          <p>
            Charme, premium ve lüks kozmetik markalarının ve cilt bakım ürünlerinin tanıtımını, listelenmesini ve güvenli e-ticaret altyapısı ile satışını gerçekleştiren bir dijital mağazadır. Firmamız, sitemizde sunduğu hizmetlerin kapsamını, fiyatlarını ve özelliklerini dilediği zaman değiştirme hakkını saklı tutar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">2. Fikri Mülkiyet Hakları</h2>
          <p>
            Sitede yer alan tüm tasarım, yazılım, kodlar, logolar, grafikler, metinler, görseller ve ürün açıklamaları Charme mülkiyetindedir ve yasal olarak korunmaktadır. Yazılı izin olmaksızın kopyalanması, çoğaltılması veya başka platformlarda kullanılması durumunda hukuki süreç başlatılacaktır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">3. Kullanıcı Sorumlulukları</h2>
          <p>
            Kullanıcılar, üyelik oluştururken verdikleri bilgilerin doğruluğunu taarüt ederler. Şifrenizin ve hesap bilgilerinizin güvenliğinden tamamen siz sorumlusunuzdur. Sitede yer alan servisleri yalnızca meşru alışveriş ve kişisel bilgi edinme amaçlarıyla kullanmayı taahhüt edersiniz.
          </p>
        </section>
      </div>

    </div>
  );
}
