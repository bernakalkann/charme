'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from './auth';

export async function getUserAddresses() {
  const user = await getSessionUser();
  if (!user) return [];

  return await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAddress(data: {
  title: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Giriş yapmalısınız.' };

  try {
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        ...data,
      },
    });
    return { success: true, address };
  } catch (error) {
    console.error('Error creating address:', error);
    return { success: false, error: 'Adres kaydedilemedi.' };
  }
}

export async function checkCoupon(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.active) {
      return { success: false, error: 'Geçersiz veya aktif olmayan kupon kodu.' };
    }

    if (new Date() > coupon.expiryDate) {
      return { success: false, error: 'Kupon kodunun süresi dolmuş.' };
    }

    if (subtotal < coupon.minPurchase) {
      return { success: false, error: `Bu kupon en az ${coupon.minPurchase} TL tutarında sepetlerde geçerlidir.` };
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, error: 'Bu kuponun kullanım limiti dolmuştur.' };
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
      },
    };
  } catch (error) {
    console.error('Error checking coupon:', error);
    return { success: false, error: 'Kupon kontrol edilemedi.' };
  }
}

export async function createOrder(data: {
  items: { variantId: string; quantity: number }[];
  shippingAddressId: string;
  billingAddressId: string;
  giftWrap: boolean;
  giftNote?: string;
  selectedTesterId?: string;
  couponCode?: string;
}) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Sipariş oluşturmak için giriş yapmalısınız.' };

  const { items, shippingAddressId, billingAddressId, giftWrap, giftNote, selectedTesterId, couponCode } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Calculate actual price and check stock
      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error('Ürün varyantı bulunamadı.');
        }

        if (variant.stock < item.quantity) {
          throw new Error(`${variant.product.name} (${variant.name}) stokta kalmadı veya yetersiz stok.`);
        }

        // Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        const itemPrice = variant.product.discountPrice ?? variant.product.price;
        const finalPrice = itemPrice + variant.priceAdjustment;
        subtotal += finalPrice * item.quantity;

        orderItemsToCreate.push({
          productVariantId: variant.id,
          price: finalPrice,
          quantity: item.quantity,
        });
      }

      // 2. Process coupon if provided
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (coupon && coupon.active && new Date() <= coupon.expiryDate && subtotal >= coupon.minPurchase) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
          } else {
            discountAmount = Math.min(coupon.discountValue, subtotal);
          }

          // Increment coupon usage
          await tx.coupon.update({
            where: { id: coupon.id },
            data: {
              usageCount: {
                increment: 1,
              },
            },
          });
        }
      }

      // 3. Final calculations
      const giftWrapFee = giftWrap ? 50 : 0;
      const shippingFee = subtotal - discountAmount >= 1000 ? 0 : 75;
      const totalAmount = subtotal - discountAmount + giftWrapFee + shippingFee;

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          status: 'PENDING',
          totalAmount,
          shippingAddressId,
          billingAddressId,
          giftWrap,
          giftNote,
          selectedTesterId,
          items: {
            create: orderItemsToCreate,
          },
        },
      });

      return { success: true, orderId: order.id };
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return { success: false, error: error.message || 'Sipariş oluşturulurken bir hata oluştu.' };
  }
}

export async function getUserOrders() {
  const user = await getSessionUser();
  if (!user) return [];

  return await prisma.order.findMany({
    where: { userId: user.id },
    include: {
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

export async function getUserWishlist() {
  const user = await getSessionUser();
  if (!user) return [];

  return await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          brand: true,
          variants: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function toggleWishlist(productId: string) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Giriş yapmalısınız.' };

  try {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { success: true, added: false };
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId,
        },
      });
      return { success: true, added: true };
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return { success: false, error: 'İşlem gerçekleştirilemedi.' };
  }
}
