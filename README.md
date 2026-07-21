# 🌟 Charme - Premium Cosmetics & Skincare E-Commerce Platform

Charme, lüks kozmetik markalarının ve temiz cilt bakımı formüllerinin dijital buluşma noktası olan, modern ve güvenli standartlarda geliştirilmiş üretime hazır (Production-Ready) bir e-ticaret platformudur.

Bu proje; **Next.js 14+ (App Router)**, **PostgreSQL (Docker)**, **Prisma ORM**, **Tailwind CSS**, **NextAuth.js**, **Zustand** ve **Stripe** teknolojileri kullanılarak monorepo (tek bir çatı altında hem frontend hem backend) mimarisine uygun olarak geliştirilmiştir.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

*   **Frontend & Backend**: Next.js 14+ (App Router, Server Actions, Route Handlers)
*   **Programlama Dili**: TypeScript
*   **Veritabanı**: PostgreSQL 15 (Docker üzerinde çalıştırılmaktadır)
*   **ORM**: Prisma ORM (v5)
*   **Oturum Yönetimi**: NextAuth.js (JWT ve Rol tabanlı yetkilendirme)
*   **Durum Yönetimi**: Zustand (Persist/Kalıcı sepet hafızası)
*   **Güvenli Ödeme**: Stripe Hosted Checkout (PCI-DSS Uyumlu Yönlendirmeli Ödeme)
*   **Tasarım**: HSL lüks renk paletleri (Soft Rose, Gold, Charcoal Dark) ve Playfair Display tipografisiyle Vanilla Tailwind CSS.

---

## ✨ Temel Özellikler (Features)

1.  **Lüks Arayüz (Premium UI/UX)**: Kozmetik dünyasına özel tasarlanan, tamamen responsive (mobil ve masaüstü uyumlu) tasarım sistemi ve akıcı kullanıcı deneyimi.
2.  **Gelişmiş Ürün Kataloğu**: Cilt Tipi (Skin Type), Cilt Kaygısı (Skin Concern), Marka ve Fiyat aralıklarına göre istemci tarafında anlık süzme yapabilen filtreleme sistemi.
3.  **Çoklu Varyant Yönetimi**: Ürünlerin Hacim (ml) veya Renk/Ton varyasyonlarına göre dinamik fiyat ayarlaması ve stok takibi.
4.  **Güvenli Ödeme (Stripe Hosted Checkout)**: Kart bilgilerinizi sitemizde göstermeden, doğrudan Stripe'ın resmi ödeme sayfasına yönlendiren ve 3D secure destekleyen %100 güvenli ödeme akışı.
5.  **Numune (Tester) Seçimi**: Müşterilerin sipariş verirken sepet tutarına göre en fazla 3 adet ücretsiz deneme boyu numune seçebilmesini sağlayan hediye mekanizması.
6.  **Admin Dashboard (Yönetici Paneli)**:
    *   **Analiz Grafikleri**: Brüt satış cirosu ve düşük stok uyarı logları.
    *   **Ürün CRUD**: Dinamik varyant tablolarıyla yeni ürün oluşturma/silme.
    *   **Sipariş Yönetimi**: Sipariş durumunu değiştirme ve kargo takip numarası ekleme.
    *   **Kupon Yöneticisi**: Kampanya kuponları tanımlama ve aktif etme.
7.  **Profil & Adres Defteri**: Sipariş geçmişi, kargo takibi, favori ürünler (Wishlist) ve çoklu adres yönetimi.

---

## 🚀 Hızlı Başlangıç (Getting Started)

### 1. Gereksinimler
Bilgisayarınızda **Node.js** (v18+) ve **Docker Desktop** kurulu olmalıdır.

### 2. Kurulum ve Çalıştırma

Proje dizinine geçip aşağıdaki adımları sırayla uygulayın:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Veritabanını Docker üzerinde ayağa kaldırın
docker compose up -d

# 3. Prisma şemalarını veritabanına gönderin ve tabloları oluşturun
npx prisma db push

# 4. Hazır premium kozmetik verilerini (Marka, Ürün, Admin vb.) veritabanına ekleyin (Seed)
npx prisma db seed

# 5. Projeyi 3001 portunda başlatın (Diğer projelerinizle çakışmaması için)
npm run dev -- -p 3001
```

Tarayıcınızda **`http://localhost:3001`** adresine giderek sistemi test edebilirsiniz.

---

## 🔑 Hazır Giriş Bilgileri (Test Credentials)

Veritabanı seed edildiğinde sistemde otomatik olarak aşağıdaki test hesapları oluşturulur:

*   **Müşteri Hesabı (USER)**:
    *   **E-posta**: `user@charme.com`
    *   **Şifre**: `user123`
*   **Yönetici Hesabı (ADMIN)**:
    *   **E-posta**: `admin@charme.com`
    *   **Şifre**: `admin123`

---

## 🔒 Güvenlik ve Canlı Mod Kurulumu (.env)

Proje kök dizinindeki `.env` dosyasını kendi anahtarlarınızla güncelleyerek canlı ödeme sistemine geçebilirsiniz:

```env
# Stripe Anahtarları (Bunu eklediğinizde sistem Sandbox modundan çıkarak gerçek ödeme alır)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# NextAuth Yetkilendirme Gizli Anahtarı
NEXTAUTH_SECRET=herhangi_bir_gizli_karakter_dizisi
NEXTAUTH_URL=http://localhost:3001
```
