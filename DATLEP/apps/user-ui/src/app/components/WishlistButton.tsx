'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../store';
import useUser from '../../configs/hooks/useUser';
import useLocationTracking from '../../configs/hooks/useLocationTracking';
import useDeviceTracking from '../../configs/hooks/useDeviceTracking';

type WishlistProduct = {
  _id: string;
  title: string;
  image?: { url?: string } | string;
  salePrice?: number;
  regularPrice?: number;
  shopId: string | { _id: string };
};

interface WishlistButtonProps {
  product: WishlistProduct;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (isWishlisted: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  onToggle,
}) => {
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const isWishlisted = wishlist.some((p) => p._id === product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shopId =
      typeof product.shopId === 'string' ? product.shopId : product.shopId?._id;

    const image =
      typeof product.image === 'string' ? product.image : product.image?.url || '';

    const price =
      (product.salePrice && product.salePrice > 0
        ? product.salePrice
        : product.regularPrice) ?? 0;

    const productData = {
      _id: product._id,
      title: product.title,
      image,
      price,
      shopId: shopId || '',
      quantity: 1,
    };

    if (isWishlisted) {
      removeFromWishlist(productData as any, product._id, user, location, deviceInfo);
      onToggle?.(false);
    } else {
      addToWishlist(productData as any, user, location, deviceInfo);
      onToggle?.(true);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  } as const;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  } as const;

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ${
        isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-700 hover:text-red-500'
      }`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-300 ${
          isWishlisted ? 'fill-current' : ''
        }`}
      />
    </button>
  );
};

export default WishlistButton;
