import React from 'react';
import CategoryContent from './CategoryContent';
import { getProducts, getBrands } from '@/actions/products';

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const { categorySlug } = params;

  const categoryNames: { [key: string]: string } = {
    'cilt-bakimi': 'Cilt Bakımı',
    'makyaj': 'Makyaj',
    'parfum': 'Parfüm',
  };

  const categoryName = categoryNames[categorySlug] || 'Kozmetik';

  const products = await getProducts({ categorySlug });
  const brands = await getBrands();

  return (
    <CategoryContent
      categoryName={categoryName}
      initialProducts={products as any}
      brands={brands}
    />
  );
}
