import React from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="border-b border-border pb-5 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Müşteri Güvencesi</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary mt-1">İade ve Değişim Koşulları</h1>
        <p className="text-xs text-muted-foreground mt-2">Satın aldığınız ürünlerden memnun kalmamanız durumunda yanınızdayız.</p>
      </div>

      {/* Warnings & Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-amber-50 border border-amber-200/40 p-5 rounded-xl text-xs text-amber-800 leading-relaxed">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Hijyen Kuralları:</strong> Tüketici Kanunu gereği; açılmış, denenmiş, koruma bandı veya ambalajı zarar görmüş kozmetik ve cilt bakım ürünlerinin iadesi hijyenik nedenlerle <strong>kabul edilmemektedir</strong>.
          </span>
        </div>
        <div className="flex gap-2">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>14 Gün İade Hakkı:</strong> Ambalajı açılmamış, satılabilirlik özelliğini yitirmemiş ürünleri teslim aldığınız tarihten itibaren <strong>14 gün</strong> içerisinde iade edebilirsiniz.
          </span>
        </div>
      </div>

      {/* Details text */}
      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6 text-xs sm:text-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">1. Nasıl İade Ederim?</h2>
          <p>
            İade sürecini başlatmak için profilinizdeki <strong>Sipariş Geçmişim</strong> sekmesine gidip ilgili sipariş için iade talebi oluşturabilir veya <strong>support@charme.com</strong> adresine sipariş numaranızla birlikte e-posta atabilirsiniz. İade onaylandığında kargo gönderi kodu tarafınıza iletilecektir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">2. İade Kargo Ücreti</h2>
          <p>
            Anlaşmalı kargo firmamız olan <strong>Yurtiçi Kargo</strong> ile size verilen iade gönderi kodunu kullanarak yapacağınız gönderimlerde kargo ücreti <strong>tamamen ücretsizdir</strong>. Farklı kargo firmalarıyla karşı ödemeli gönderilen iadeler kabul edilmeyecektir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">3. Geri Ödeme Süreci</h2>
          <p>
            İade ettiğiniz ürünler Charme depolarına ulaştıktan sonra kalite kontrol ekiplerimiz tarafından incelenir. İade şartlarına uygunluğu onaylanan ürünlerin tutarı, <strong>3 ila 7 iş günü</strong> içerisinde satın alım yaparken kullandığınız kredi/banka kartına iade edilir. Tutarın ekstrenize yansıma süresi bankanıza göre değişiklik gösterebilir.
          </p>
        </section>
      </div>

    </div>
  );
}
