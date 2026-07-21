import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailContent from './ProductDetailContent';
import { getProductBySlug, getComplementaryProducts } from '@/actions/products';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const complementary = await getComplementaryProducts(product.id, product.categoryId);

  return (
    <ProductDetailContent
      product={product as any}
      complementary={complementary}
    />
  );
}
