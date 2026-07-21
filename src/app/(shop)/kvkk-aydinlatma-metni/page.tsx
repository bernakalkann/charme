import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function KVKKPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Kişisel Verilerin Korunması Kanunu</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">KVKK Aydınlatma Metni</h1>
        <p className="text-xs text-muted-foreground mt-2">6698 sayılı Kanun uyarınca kişisel verilerinizin işlenme amaçları ve haklarınız hakkında bilgilendirme.</p>
      </div>

      {/* Info box */}
      <div className="bg-card border border-border/40 p-5 rounded-xl flex gap-3 text-xs leading-relaxed text-foreground/80">
        <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
        <span>
          Bu aydınlatma metni, veri sorumlusu sıfatıyla **Charme Kozmetik ve Ticaret A.Ş.** tarafından, sitemizi ziyaret eden ve hizmetlerimizden yararlanan kullanıcıları bilgilendirmek amacıyla hazırlanmıştır.
        </span>
      </div>

      {/* Details text */}
      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6 text-xs sm:text-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">1. Kişisel Verilerin Hangi Amaçla İşleneceği</h2>
          <p>
            Kişisel verileriniz; fatura düzenlenmesi, siparişlerin kargo ile teslimatı, üyelik haklarının kullandırılması, müşteri talep ve şikayetlerinin takibi, yasal mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">2. İşlenen Kişisel Verilerin Aktarılması</h2>
          <p>
            Toplanan kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, kargo teslimatı için kargo şirketleriyle, fatura ve ödeme onayı için bankalarla/ödeme aracı kuruluşlarıyla ve yasal bildirimler kapsamında yetkili kamu kurum ve kuruluşlarıyla paylaşılmaktadır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">3. Kanun Kapsamındaki Haklarınız</h2>
          <p>
            KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını sorgulama ve hatalı işlenmişse düzeltilmesini talep etme haklarına sahipsiniz. Taleplerinizi <strong>kvkk@charme.com</strong> adresine iletebilirsiniz.
          </p>
        </section>
      </div>

    </div>
  );
}
