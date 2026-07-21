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

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { ingredients: { contains: search, mode: 'insensitive' } },
    ];
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
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
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
