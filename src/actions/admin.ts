'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from './auth';
import { OrderStatus, DiscountType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { sendShippingUpdateEmail, sendStockNotificationEmail } from '@/lib/email';

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim. Yönetici girişi gereklidir.');
  }
}

// 1. Dashboard Stats
export async function getAdminStats() {
  await requireAdmin();

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          notIn: ['CANCELLED', 'RETURNED'],
        },
      },
    });

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;

    // Low stock alert (stock < 10)
    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: {
          lt: 10,
        },
      },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: { stock: 'asc' },
    });

    // Best Sellers (mock aggregation from order items)
    const bestSellers = await prisma.product.findMany({
      take: 5,
      include: {
        brand: true,
        variants: true,
        reviews: true,
      },
    });

    return {
      totalSales,
      totalOrders,
      lowStockCount: lowStockVariants.length,
      lowStockVariants: lowStockVariants.map((v) => ({
        id: v.id,
        variantName: v.name,
        productName: v.product.name,
        brandName: v.product.brand.name,
        stock: v.stock,
      })),
      bestSellers: bestSellers.map((p) => ({
        id: p.id,
        name: p.name,
        brandName: p.brand.name,
        price: p.price,
        salesCount: Math.floor(Math.random() * 50) + 10, // Mock sales count for analytics visualization
      })),
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalSales: 0,
      totalOrders: 0,
      lowStockCount: 0,
      lowStockVariants: [],
      bestSellers: [],
    };
  }
}

// 2. Orders CRUD
export async function getAdminOrders() {
  await requireAdmin();

  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingCode?: string) {
  await requireAdmin();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingCode: trackingCode || undefined,
      },
      include: {
        user: true,
      },
    });

    if (status === 'SHIPPED' && updatedOrder.user?.email) {
      sendShippingUpdateEmail(updatedOrder.user.email, updatedOrder, updatedOrder.trackingCode || '').catch((err) =>
        console.error('[SHIPPING EMAIL TRIGGER FAILED]', err)
      );
    }

    revalidatePath('/admin');
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Sipariş güncellenemedi.' };
  }
}

// 3. Products CRUD
export async function getAdminProducts() {
  await requireAdmin();

  return await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku: string;
  images: string[];
  brandId: string;
  categoryId: string;
  skinTypes: string[];
  skinConcerns: string[];
  ingredients: string;
  badges: string[];
  usageRoutine?: string;
  variants: { name: string; type: string; priceAdjustment: number; stock: number; sku: string }[];
}) {
  await requireAdmin();

  const { variants, discountPrice, usageRoutine, ...prodData } = data;

  try {
    await prisma.product.create({
      data: {
        ...prodData,
        discountPrice: discountPrice || null,
        usageRoutine: usageRoutine || null,
        variants: {
          create: variants,
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/cilt-bakimi');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Ürün oluşturulamadı.' };
  }
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/');
    revalidatePath('/cilt-bakimi');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Ürün silinemedi.' };
  }
}

// 4. Coupons CRUD
export async function getAdminCoupons() {
  await requireAdmin();

  return await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCoupon(data: {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  expiryDate: Date;
}) {
  await requireAdmin();

  try {
    await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchase: data.minPurchase,
        expiryDate: data.expiryDate,
      },
    });

    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, error: 'Kupon kodu oluşturulamadı.' };
  }
}

export async function toggleCouponActive(couponId: string, active: boolean) {
  await requireAdmin();

  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { active },
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return { success: false, error: 'Kupon durumu güncellenemedi.' };
  }
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'Dosya yüklenemedi.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.name);
    const filename = `${uniqueSuffix}${originalExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file
    await writeFile(filePath, buffer);
    const imageUrl = `/uploads/${filename}`;

    return { success: true, url: imageUrl };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { success: false, error: error.message || 'Dosya sunucuya yazılamadı.' };
  }
}

export async function updateVariantStock(variantId: string, newStock: number) {
  await requireAdmin();

  try {
    // 1. Fetch variant and product details
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return { success: false, error: 'Ürün varyantı bulunamadı.' };
    }

    const oldStock = variant.stock;

    // 2. Update stock in database
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
    });

    // 3. If stock went from 0 to > 0, trigger stock notification emails!
    if (oldStock === 0 && newStock > 0) {
      const notifications = await prisma.stockNotification.findMany({
        where: {
          productId: variant.productId,
          notified: false,
        },
      });

      if (notifications.length > 0) {
        // Send email to each user asynchronously
        const productUrl = `http://localhost:3001/product/${variant.product.slug}`;
        
        notifications.forEach((n) => {
          sendStockNotificationEmail(n.email, variant.product.name, productUrl)
            .then(async () => {
              // Update notified status
              await prisma.stockNotification.update({
                where: { id: n.id },
                data: { notified: true },
              });
            })
            .catch((err) => console.error('[STOCK NOTIFICATION SEND ERROR]', err));
        });
      }
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating variant stock:', error);
    return { success: false, error: error.message || 'Stok güncellenemedi.' };
  }
}
