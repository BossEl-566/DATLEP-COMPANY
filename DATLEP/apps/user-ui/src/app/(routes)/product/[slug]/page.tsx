// app/product/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';
import ProductDetailsPage from './ProductDetailsPage';

type ProductParams = Promise<{ slug: string }>;

async function fetchProductDetails(slug: string) {
  try {
    const response = await axiosInstance.get(`/product/api/get-product/${slug}`);
    return response.data?.product ?? null;
  } catch (error: any) {
    console.error(
      'fetchProductDetails error:',
      error?.response?.status,
      error?.response?.data || error?.message
    );
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: ProductParams }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductDetails(slug);

  if (!product) {
    return {
      title: 'Product Not Found | DATLEP Africa',
      description:
        'The requested fashion product could not be found. Explore thousands of African fashion items on DATLEP.',
      robots: {
        index: false,
        follow: true
      }
    };
  }

  // Handle both naming styles safely
  const productTitle = product.title;
  const brand = product.brand || 'African Designer';
  const category = product.category || 'Fashion';
  const price = product.salePrice || product.regularPrice;
  const currency = 'GHS';
  const availability = product.stock > 0 ? 'InStock' : 'OutOfStock';

  const seoDescription =
    product.shortDescription ||
    product.short_description ||
    `Shop authentic ${productTitle} by ${brand} on DATLEP. Premium quality African fashion, secure payments, and fast delivery across Africa.`;

  const keywords = [
    productTitle,
    brand,
    'African fashion',
    'African clothing',
    'African designer',
    `${category} Africa`,
    'Ghana fashion',
    'Nigeria fashion',
    'Kenya fashion',
    'South Africa fashion',
    'African prints',
    'Ankara',
    'Kente',
    'Dashiki',
    'African streetwear',
    'modern African fashion',
    'African luxury fashion',
    'pan-african clothing',
    'African fashion online',
    'buy African clothes',
    'African fashion marketplace',
    'African clothing store',
    'African fashion brands',
    'African fashion designers',
    'traditional African wear',
    'contemporary African fashion'
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://datlep.com';
  const url = `${baseUrl}/product/${product.slug}`;

  // Backend returns product.image and product.gallery (not product.images)
  const images = [
    product.image?.url,
    ...(product.gallery?.map((img: any) => img?.url) || [])
  ].filter(Boolean);

  return {
    title: {
      absolute: `${productTitle} | ${brand} | Buy African Fashion Online | DATLEP Africa`,
      template: `%s | African Fashion Marketplace`
    },
    description: seoDescription,
    keywords: keywords.join(', '),

    applicationName: 'DATLEP Africa',
    authors: [
      {
        name: brand,
        url: product.shopId?.slug ? `${baseUrl}/shop/${product.shopId.slug}` : baseUrl
      }
    ],
    creator: brand,
    publisher: 'DATLEP Africa',

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },

    alternates: {
      canonical: url
    },

    openGraph: {
      type: 'website',
      locale: 'en_US', // safer than en_AF
      siteName: 'DATLEP Africa',
      url,
      title: `${productTitle} - Authentic African Fashion by ${brand}`,
      description: seoDescription,
      images: images.map((img: string, index: number) => ({
        url: img,
        width: index === 0 ? 1200 : 800,
        height: index === 0 ? 630 : 800,
        alt: `${productTitle} - ${brand} African Fashion`
      })),
      ...(product.videoUrl
        ? {
            videos: [
              {
                url: product.videoUrl,
                type: 'video/mp4'
              }
            ]
          }
        : {})
    },

    twitter: {
      card: 'summary_large_image',
      site: '@datlep',
      creator: '@datlep',
      title: `${productTitle} by ${brand} | African Fashion`,
      description: seoDescription,
      images
    },

    // keep only stable metadata fields
    category: 'Fashion',
    other: {
      'product:brand': brand,
      'product:category': category,
      'product:availability': availability,
      'product:price:amount': price?.toString(),
      'product:price:currency': currency,
      'business:country': 'GH',
      'market:region': 'Africa'
    }
  };
}

export default async function Page({ params }: { params: ProductParams }) {
  const { slug } = await params;

  const product = await fetchProductDetails(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}