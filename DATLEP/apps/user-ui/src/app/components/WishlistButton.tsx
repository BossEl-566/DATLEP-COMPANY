'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface WishlistButtonProps {
  productId: string;
  isWishlisted?: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  isWishlisted: initialIsWishlisted = false,
  onToggle,
  size = 'md'
}) => {
  const [localWishlisted, setLocalWishlisted] = useState(initialIsWishlisted);
  const queryClient = useQueryClient();

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/wishlist/toggle', {
        productId
      });
      return response.data;
    },
    onMutate: async () => {
      // Optimistically update the UI
      const previousState = localWishlisted;
      setLocalWishlisted(!previousState);
      
      if (onToggle) {
        onToggle();
      }

      return { previousState };
    },
    onError: (err, variables, context) => {
      // Revert on error
      setLocalWishlisted(context?.previousState || false);
      console.error('Wishlist toggle failed:', err);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlistMutation.mutate();
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ${
        localWishlisted 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-700 hover:text-red-500'
      }`}
      title={localWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={wishlistMutation.isPending}
    >
      <Heart 
        className={`${iconSizes[size]} transition-all duration-300 ${
          localWishlisted ? 'fill-current animate-pulse-scale' : ''
        }`}
      />
    </button>
  );
};

export default WishlistButton;