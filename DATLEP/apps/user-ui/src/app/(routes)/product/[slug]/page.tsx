import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';
import type { Metadata } from 'next';

async function fetchProductDetails(slug: string) {
  try {
    const response = await axiosInstance.get(
      `/products/api/get-product/${slug}`
    );

    return response.data.product ?? null;
  } catch (error) {
    // ❌ DO NOT console.error here (breaks Turbopack)
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug?: string } }) {
  if (!params?.slug) {
    return { title: 'Product | DATLEP' };
  }

  const product = await fetchProductDetails(params.slug);

  if (!product) {
    return { title: 'Product Not Found | DATLEP' };
  }

  return {
    title: `${product.title} | DATLEP`,
    description: product.short_description || `Buy ${product.title} at DATLEP.`
  };
}

const Product = async ({ params }: { params: { slug?: string } }) => {
  if (!params?.slug) {
    return <div>Invalid product</div>;
  }

  const product = await fetchProductDetails(params.slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <div>{product.title}</div>;
};

export default Product;