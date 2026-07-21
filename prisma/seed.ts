import { PrismaClient, Role, OrderStatus, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.coupon.deleteMany();
  await prisma.stockNotification.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Charme Admin',
      email: 'admin@charme.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Ayşe Yılmaz',
      email: 'user@charme.com',
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  // 2. Create Address
  const customerAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      title: 'Evim',
      fullName: 'Ayşe Yılmaz',
      phone: '+905555555555',
      addressLine: 'Akatlar Mah. Gül Sokak No: 12 Daire: 4',
      city: 'İstanbul',
      state: 'Beşiktaş',
      postalCode: '34335',
      isDefault: true,
    },
  });

  // 3. Create Brands
  const brandGlow = await prisma.brand.create({
    data: { name: 'Glow Recipe', slug: 'glow-recipe', description: 'Meyve özleri ve klinik aktiflerle formüle edilmiş parlatıcı cilt bakımı.' }
  });
  const brandEstee = await prisma.brand.create({
    data: { name: 'Estée Lauder', slug: 'estee-lauder', description: 'Cilt bakımında dünya lideri, yaşlanma karşıtı lüks formüller.' }
  });
  const brandChanel = await prisma.brand.create({
    data: { name: 'Chanel Beauty', slug: 'chanel-beauty', description: 'Lüks ve zarafetin makyaj ve parfümdeki imzası.' }
  });
  const brandDior = await prisma.brand.create({
    data: { name: 'Dior Beauty', slug: 'dior-beauty', description: 'Couture esintili yüksek performanslı güzellik ürünleri.' }
  });

  // 4. Create Categories
  const catSkincare = await prisma.category.create({
    data: { name: 'Cilt Bakımı', slug: 'cilt-bakimi', description: 'Serumlar, nemlendiriciler, tonikler ve temizleyiciler.' }
  });
  const catMakeup = await prisma.category.create({
    data: { name: 'Makyaj', slug: 'makyaj', description: 'Rujlar, fondötenler, maskaralar ve allıklar.' }
  });
  const catFragrance = await prisma.category.create({
    data: { name: 'Parfüm', slug: 'parfum', description: 'Lüks ve kalıcı kadın, erkek ve unisex parfümler.' }
  });

  // 5. Create Products & Variants
  // Product 1: Glow Recipe Watermelon Glow AHA
  const prodGlowAha = await prisma.product.create({
    data: {
      name: 'Watermelon Glow AHA Night Treatment',
      slug: 'watermelon-glow-aha-night-treatment',
      description: 'Cildinizi gece boyunca nazikçe yenileyen, gözenekleri sıkılaştıran ve aydınlık bir görünüm kazandıran AHA içerikli gece maskesi.',
      price: 1200.0,
      discountPrice: 1050.0,
      sku: 'GLOW-AHA-PARENT',
      images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop'],
      brandId: brandGlow.id,
      categoryId: catSkincare.id,
      skinTypes: ['Oily', 'Combination', 'Normal', 'Dry'],
      skinConcerns: ['Dullness', 'Uneven Texture', 'Pores'],
      ingredients: 'Water/Aqua/Eau, Glycerin, Methylpropanediol, Niacinamide, Watermelon Fruit Extract, Glycolic Acid, Lactic Acid, Sodium Hyaluronate...',
      badges: ['Cruelty-Free', 'Vegan', 'Dermatologically Tested'],
      usageRoutine: 'Akşam cilt bakım rutininizin son adımı olarak cildinize eşit miktarda uygulayın. Hafifçe vurarak emilmesini sağlayın ve sabah ılık suyla durulayın.',
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prodGlowAha.id, name: '25ml Travel', type: 'VOLUME', priceAdjustment: -300.0, stock: 20, sku: 'GLOW-AHA-25' },
      { productId: prodGlowAha.id, name: '50ml Standard', type: 'VOLUME', priceAdjustment: 0.0, stock: 35, sku: 'GLOW-AHA-50' },
    ]
  });

  // Product 2: Estee Lauder ANR
  const prodEsteeAnr = await prisma.product.create({
    data: {
      name: 'Advanced Night Repair Synchronized Multi-Recovery Complex',
      slug: 'advanced-night-repair-serum',
      description: 'Hızlı yenileme gücü ve yaşlanma karşıtı etkisiyle cildin doğal onarım sürecini destekleyen efsanevi yüz serumu.',
      price: 2450.0,
      discountPrice: 2200.0,
      sku: 'ESTEE-ANR-PARENT',
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'],
      brandId: brandEstee.id,
      categoryId: catSkincare.id,
      skinTypes: ['Dry', 'Normal', 'Combination', 'Sensitive'],
      skinConcerns: ['Aging', 'Wrinkles', 'Dryness'],
      ingredients: 'Water\\Aqua\\Eau, Bifida Ferment Lysate, Peg-8, Propanediol, Bis-Peg-18 Methyl Ether Dimethyl Silane, Methyl Gluceth-20, Tripeptide-32, Sodium Hyaluronate...',
      badges: ['Dermatologically Tested', 'Fragrance-Free', 'Non-Comedogenic'],
      usageRoutine: 'Temizlenmiş yüz ve boyun bölgesine nemlendiriciden önce, sabah ve akşam olmak üzere günde iki kez birkaç damla uygulayın.',
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prodEsteeAnr.id, name: '30ml', type: 'VOLUME', priceAdjustment: 0.0, stock: 45, sku: 'ESTEE-ANR-30' },
      { productId: prodEsteeAnr.id, name: '50ml', type: 'VOLUME', priceAdjustment: 900.0, stock: 25, sku: 'ESTEE-ANR-50' },
      { productId: prodEsteeAnr.id, name: '75ml', type: 'VOLUME', priceAdjustment: 1600.0, stock: 15, sku: 'ESTEE-ANR-75' },
    ]
  });

  // Product 3: Chanel Lip Color
  const prodChanelLip = await prisma.product.create({
    data: {
      name: 'Rouge Allure Luminous Intense Lip Colour',
      slug: 'rouge-allure-lipstick',
      description: 'Yoğun renk pigmenti ve saten bitişiyle dudakları kurutmadan gün boyu kalıcılık ve lüks bir his sunan ikonik ruj.',
      price: 1800.0,
      sku: 'CHANEL-LIP-PARENT',
      images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop'],
      brandId: brandChanel.id,
      categoryId: catMakeup.id,
      skinTypes: ['Normal', 'Dry', 'Combination'],
      skinConcerns: ['Dryness'],
      ingredients: 'Pentaerythrityl Adipate/Caprate/Caprylate/Heptanoate, Octyldodecanol, Synthetic Wax, Polybutene, Polyglyceryl-2 Triisostearate...',
      badges: ['Dermatologically Tested'],
      usageRoutine: 'Dudağın merkezinden başlayarak dış köşelere doğru doğrudan uygulayın. Daha net çizgiler için dudak kalemi kullanabilirsiniz.',
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prodChanelLip.id, name: '99 - Pirate (Derin Kırmızı)', type: 'SHADE', priceAdjustment: 0.0, stock: 15, sku: 'CHANEL-LIP-99' },
      { productId: prodChanelLip.id, name: '102 - Palpitante (Klasik Kırmızı)', type: 'SHADE', priceAdjustment: 0.0, stock: 12, sku: 'CHANEL-LIP-102' },
      { productId: prodChanelLip.id, name: '136 - Mélodieuse (Şeftali Pembe)', type: 'SHADE', priceAdjustment: 0.0, stock: 0, sku: 'CHANEL-LIP-136' }, // Out of stock to test alerts!
    ]
  });

  // Product 4: Dior Forever Foundation
  const prodDiorFound = await prisma.product.create({
    data: {
      name: 'Forever Skin Glow Foundation SPF 20',
      slug: 'dior-forever-skin-glow-foundation',
      description: 'Cilde 24 saat boyunca nemli, ışıltılı ve pürüzsüz bir görünüm kazandıran, çiçek özleriyle zenginleştirilmiş temiz formüllü fondöten.',
      price: 2200.0,
      sku: 'DIOR-FOREVER-PARENT',
      images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop'],
      brandId: brandDior.id,
      categoryId: catMakeup.id,
      skinTypes: ['Dry', 'Normal', 'Combination', 'Sensitive'],
      skinConcerns: ['Uneven Texture', 'Dullness'],
      ingredients: 'Aqua (Water), Alcohol, Methyl Trimethicone, Isododecane, Glycerin, Acrylates/Dimethicone Copolymer, Silica, Viola Tricolor Extract...',
      badges: ['Dermatologically Tested', 'SPF 20'],
      usageRoutine: 'Parmak uçlarınızla, makyaj süngeriyle veya fondöten fırçasıyla yüzünüzün ortasından dışa doğru dağıtarak uygulayın.',
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prodDiorFound.id, name: '1N - Light Neutral', type: 'SHADE', priceAdjustment: 0.0, stock: 20, sku: 'DIOR-GLOW-1N' },
      { productId: prodDiorFound.id, name: '2N - Light Medium Neutral', type: 'SHADE', priceAdjustment: 0.0, stock: 18, sku: 'DIOR-GLOW-2N' },
      { productId: prodDiorFound.id, name: '3N - Medium Neutral', type: 'SHADE', priceAdjustment: 0.0, stock: 10, sku: 'DIOR-GLOW-3N' },
    ]
  });

  // Product 5: Bleu de Chanel Perfume
  const prodBleuChanel = await prisma.product.create({
    data: {
      name: 'Bleu de Chanel Eau de Parfum',
      slug: 'bleu-de-chanel-edp',
      description: 'Narenciye tazeliği ile odunsu sedir notalarının asil ve şehvetli buluşması. Karizmatik ve modern erkeğin kokusu.',
      price: 3500.0,
      discountPrice: 3150.0,
      sku: 'BLEU-EDP-PARENT',
      images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'],
      brandId: brandChanel.id,
      categoryId: catFragrance.id,
      skinTypes: ['Normal'],
      skinConcerns: [],
      ingredients: 'Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Coumarin, Citral...',
      badges: ['Long Lasting'],
      usageRoutine: 'Temiz tene veya kıyafete 15-20 cm mesafeden sıkın. Özellikle boyun, bilekler ve göğüs bölgesi gibi nabız noktalarında kalıcılığı artar.',
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prodBleuChanel.id, name: '50ml', type: 'VOLUME', priceAdjustment: 0.0, stock: 15, sku: 'BLEU-EDP-50' },
      { productId: prodBleuChanel.id, name: '100ml', type: 'VOLUME', priceAdjustment: 1400.0, stock: 8, sku: 'BLEU-EDP-100' },
    ]
  });

  // 6. Create Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', discountType: DiscountType.PERCENTAGE, discountValue: 10, minPurchase: 500, expiryDate: new Date('2027-12-31'), active: true },
      { code: 'CHARME150', discountType: DiscountType.FIXED, discountValue: 150, minPurchase: 1500, expiryDate: new Date('2027-12-31'), active: true },
    ]
  });

  // 7. Create Reviews
  await prisma.productReview.create({
    data: {
      userId: customer.id,
      productId: prodEsteeAnr.id,
      rating: 5,
      comment: 'Harika bir serum! 2 haftadır kullanıyorum, cildimdeki kuruluk tamamen geçti ve inanılmaz canlı görünüyor. Kesinlikle parasını hak ediyor.',
      verifiedPurchase: true,
      images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'],
    }
  });

  await prisma.productReview.create({
    data: {
      userId: customer.id,
      productId: prodGlowAha.id,
      rating: 4,
      comment: 'Karpuz kokusu muhteşem. Akşam sürüp sabah kalktığımda yumuşacık bir cilt ile uyanıyorum. Tek puanı fiyatından dolayı kırdım.',
      verifiedPurchase: true,
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
