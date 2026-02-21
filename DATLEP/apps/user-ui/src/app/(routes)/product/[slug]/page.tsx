import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance';
import type { Metadata } from 'next';

async function fetchProductDetails(slug: string) {
  const response = await axiosInstance.get(`/products/api/get-product/${slug}`);
  return response.data.product;
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await fetchProductDetails(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | DATLEP',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const image =
    product.images?.[0]?.url ||
    'https://datlep.com/default-product-image.jpg';

  const description =
    product.short_description ||
    `Buy ${product.title} at DATLEP. Best prices, fast delivery, and secure checkout.`;

  const url = `https://datlep.com/products/${product.slug}`;

  return {
    /* ================= BASIC ================= */
    title: `${product.title} | DATLEP`,
    description,

    /* ================= SEO ================= */
    keywords: [
      product.title,
      'DATLEP',
      'Buy online',
      'Best prices',
      'E-commerce Ghana'
    ],
    applicationName: 'DATLEP',
    authors: [{ name: 'DATLEP Team', url: 'https://datlep.com' }],
    creator: 'DATLEP',
    publisher: 'DATLEP',

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    alternates: {
      canonical: url
    },

    /* ================= OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ================= */
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title: `${product.title} | DATLEP`,
      description,
      siteName: 'DATLEP',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title
        }
      ]
    },

    /* ================= TWITTER ================= */
    twitter: {
      card: 'summary_large_image',
      site: '@datlep',
      creator: '@datlep',
      title: `${product.title} | DATLEP`,
      description,
      images: [image]
    },

    /* ================= MOBILE / PWA ================= */
    themeColor: '#0F172A',
    colorScheme: 'light',
    viewport: {
      width: 'device-width',
      initialScale: 1
    },

    /* ================= APP LINKS ================= */
    appLinks: {
      web: {
        url
      }
    },

    /* ================= OTHER ================= */
    category: 'E-commerce'
  };
}

const Product = async ({ params }: { params: { slug: string } }) => {
  const product = await fetchProductDetails(params.slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.short_description}</p>
    </div>
  );
};

export default Product;