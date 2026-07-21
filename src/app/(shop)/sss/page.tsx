import React from 'react';
import { HelpCircle, Star, Sparkles, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Ürünleriniz orijinal mi?',
      a: 'Evet. Charme platformunda satışa sunulan tüm ürünler %100 orijinaldir. Ürünlerimiz resmi distribütörlerden veya doğrudan üretici markalardan tedarik edilerek faturalı ve barkodlu olarak depolarımıza giriş yapmaktadır.',
    },
    {
      q: 'Hangi cilt tipine uygun ürün seçmeliyim?',
      a: 'Her ürünümüzün detay sayfasında hangi cilt tipine (yağlı, kuru, karma, hassas) ve hangi cilt kaygısına (akne, leke, yaşlanma) yönelik olduğu belirtilmiştir. Ayrıca sol filtreleme menüsünü kullanarak cilt tipinize en uygun ürünleri saniyeler içinde listeleyebilirsiniz.',
    },
    {
      q: 'Numune/Tester ürün seçimi nasıl çalışır?',
      a: 'Sepetinize ürün ekleyip Güvenli Ödeme (Checkout) sayfasına geçtiğinizde, size özel hazırlanan ücretsiz mini numune listesinden 3 adete kadar dilediğinizi seçebilirsiniz. Seçtiğiniz testerlar siparişinizle birlikte hediye kutunuza eklenir.',
    },
    {
      q: 'Kupon kodunu nasıl kullanabilirim?',
      a: 'Güvenli Ödeme (Checkout) sayfasının sağ tarafında bulunan "Sipariş Özeti" bölümündeki "İndirim Kuponu" alanına kupon kodunuzu (Örn: WELCOME10) yazıp "Uygula" butonuna basarak indirimden anında yararlanabilirsiniz.',
    },
    {
      q: 'Siparişimi nasıl iptal edebilirim?',
      a: 'Siparişiniz kargoya verilmeden önce iptal edilebilir. İptal talebi oluşturmak için profilinizdeki "Siparişlerim" sekmesinden talepte bulunabilir veya müşteri hizmetlerimizle iletişime geçebilirsiniz. Kargolanan siparişler için iade süreci uygulanır.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Destek Merkezi</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">Sıkça Sorulan Sorular (S.S.S)</h1>
        <p className="text-xs text-muted-foreground mt-2">Aklınıza takılan tüm soruların hızlı yanıtlarını burada derledik.</p>
      </div>

      {/* FAQ Grid */}
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-card border border-border/40 p-6 rounded-xl space-y-2">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-primary flex items-start gap-2.5">
              <HelpCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-7.5">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Contact box */}
      <div className="bg-card border border-border/40 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 text-secondary rounded-full">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary">Aradığınız yanıtı bulamadınız mı?</h4>
            <p className="text-xs text-muted-foreground">Müşteri temsilcilerimiz size her konuda yardımcı olmaya hazır.</p>
          </div>
        </div>
        <a
          href="mailto:support@charme.com"
          className="bg-primary text-primary-foreground text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors uppercase tracking-wider"
        >
          Destek Talebi Oluştur
        </a>
      </div>

    </div>
  );
}
