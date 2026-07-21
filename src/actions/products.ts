'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from './auth';

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getProducts(options: {
  categorySlug?: string;
  brandIds?: string[];
  skinTypes?: string[];
  skinConcerns?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
} = {}) {
  const { categorySlug, brandIds, skinTypes, skinConcerns, minPrice, maxPrice, search } = options;

  const where: any = {};

  // Category filter
  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  // Brand filter
  if (brandIds && brandIds.length > 0) {
    where.brandId = {
      in: brandIds,
    };
  }

  // Skin Type filter (overlap checked using hasSome)
  if (skinTypes && skinTypes.length > 0) {
    where.skinTypes = {
      hasSome: skinTypes,
    };
  }

  // Skin Concern filter
  if (skinConcerns && skinConcerns.length > 0) {
    where.skinConcerns = {
      hasSome: skinConcerns,
    };
  }

  // Price range filter (considers actual base price)
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!search) {
      return products;
    }

    // Apply fuzzy search scoring and sorting
    const scoredProducts = products
      .map((p) => {
        const score = getFuzzyScore(
          search,
          p.name,
          p.description,
          p.brand?.name || '',
          p.category?.name || ''
        );
        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    return scoredProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Helper to normalize Turkish characters and clean strings
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .trim();
}

// Calculate similarity score between search query and target fields
function getFuzzyScore(query: string, productName: string, description: string, brandName: string, categoryName: string): number {
  const normQuery = normalizeString(query);
  const normName = normalizeString(productName);
  const normDesc = normalizeString(description);
  const normBrand = normalizeString(brandName);
  const normCat = normalizeString(categoryName);

  let score = 0;

  // 1. Exact string matches
  if (normName.includes(normQuery)) {
    score += 100;
  }
  if (normBrand.includes(normQuery)) {
    score += 50;
  }
  if (normCat.includes(normQuery)) {
    score += 30;
  }
  if (normDesc.includes(normQuery)) {
    score += 20;
  }

  // 2. Token/Word overlaps (Fuzzy word matching)
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  const nameTokens = normName.split(/\s+/).filter(Boolean);

  let tokenMatchCount = 0;
  queryTokens.forEach((qToken) => {
    const exactMatch = nameTokens.some((nToken) => nToken.includes(qToken) || qToken.includes(nToken));
    if (exactMatch) {
      tokenMatchCount++;
    } else {
      // Check character similarity (Edit distance)
      nameTokens.forEach((nToken) => {
        const similarity = getCharacterSimilarity(qToken, nToken);
        if (similarity > 0.7) {
          score += similarity * 25;
        }
      });
    }
  });

  if (queryTokens.length > 0) {
    score += (tokenMatchCount / queryTokens.length) * 50;
  }

  return score;
}

// Simple edit overlap similarity (number of overlapping characters)
function getCharacterSimilarity(str1: string, str2: string): number {
  const s1 = str1.length < str2.length ? str1 : str2;
  const s2 = str1.length < str2.length ? str2 : str1;
  
  let matches = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s2.includes(s1[i])) {
      matches++;
    }
  }
  return matches / s2.length;
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: {
          orderBy: { name: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return null;

    // Calculate dynamic rating averages
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 5.0;

    return {
      ...product,
      averageRating,
      ratingCount: product.reviews.length,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getComplementaryProducts(productId: string, categoryId: string) {
  try {
    // Fetch up to 4 products from the same category, excluding current product
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
      },
      include: {
        brand: true,
        variants: true,
      },
      take: 4,
    });
  } catch (error) {
    console.error('Error fetching complementary products:', error);
    return [];
  }
}

export async function submitStockNotification(data: {
  email: string;
  productId: string;
  productVariantId?: string;
}) {
  const { email, productId, productVariantId } = data;

  try {
    const exists = await prisma.stockNotification.findFirst({
      where: {
        email,
        productId,
        productVariantId,
        notified: false,
      },
    });

    if (exists) {
      return { success: true, message: 'Bu ürün için zaten bildirim talebiniz bulunuyor.' };
    }

    await prisma.stockNotification.create({
      data: {
        email,
        productId,
        productVariantId,
      },
    });

    return { success: true, message: 'Ürün stoğu güncellendiğinde sizi e-posta ile bilgilendireceğiz.' };
  } catch (error) {
    console.error('Error creating stock notification:', error);
    return { success: false, error: 'Talebiniz kaydedilemedi. Lütfen tekrar deneyin.' };
  }
}

export async function submitProductReview(data: {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: 'Yorum yapmak için giriş yapmalısınız.' };
  }

  const { productId, rating, comment, images = [] } = data;

  try {
    // Check if user has already reviewed this product
    const existingReview = await prisma.productReview.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    if (existingReview) {
      return { success: false, error: 'Bu ürüne zaten yorum yaptınız.' };
    }

    // Check if user has purchased the product to set verifiedPurchase
    const purchased = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        items: {
          some: {
            productVariant: {
              productId,
            },
          },
        },
      },
    });

    await prisma.productReview.create({
      data: {
        userId: user.id,
        productId,
        rating,
        comment,
        images,
        verifiedPurchase: !!purchased,
      },
    });

    return { success: true, message: 'Değerlendirmeniz başarıyla eklendi.' };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Değerlendirmeniz kaydedilemedi.' };
  }
}
