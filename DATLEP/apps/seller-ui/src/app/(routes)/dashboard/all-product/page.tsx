'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Eye,
  Edit2,
  BarChart3,
  Trash2,
  Undo,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  MoreVertical,
  Package,
} from 'lucide-react';
import Image from 'next/image';
import axiosInstance from '../../../../utils/axiosInstance';
import Link from 'next/link';


// product.types.ts
export interface Product {
  _id: string;
  title: string;
  slug: string;
  status: 'active' | 'draft' | 'pending' | 'inactive';
  featured: boolean;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  sizes?: { available: boolean }[];
  colors?: { available: boolean }[];
  ratings?: {
    average: number;
    count: number;
  };
  views: number;
  createdAt: string;
  isDeleted: boolean;
  image?: any;
  gallery?: any[];
}



interface ProductWithImage extends Omit<Product, 'image' | 'gallery'> {
  image?: {
    url: string;
    fileId: string;
  };
  gallery?: Array<{
    url: string;
    fileId: string;
  }>;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-blue-100 text-blue-800',
  inactive: 'bg-red-100 text-red-800',
};

export default function ProductsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch products
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ProductWithImage[]>({
    queryKey: ['shopProducts'],
    queryFn: async () => {
      const response = await axiosInstance.get('/product/api/get-shop-product', {
        withCredentials: true,
      });
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/product/api/delete-product/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    },
  });

  // Restore product mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/product/api/restore-product/${id}`, {}, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      setShowRestoreModal(false);
    },
    onError: (error: any) => {
      console.error('Restore error:', error);
      alert(error.response?.data?.message || 'Failed to restore product');
    },
  });

  // Define columns
  const columns: ColumnDef<ProductWithImage>[] = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {product.image?.url ? (
                <Image
                  src={product.image.url}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center p-1">
                  No Image
                </div>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: 'Product Name',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="max-w-xs">
              <div className="font-medium text-gray-900 truncate">
                {product.title}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {product.slug}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[product.status] || 'bg-gray-100 text-gray-800'}`}>
                  {product.status}
                </span>
                {product.featured && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">{row.getValue('category')}</span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                {formatPrice(product.regularPrice)}
              </div>
              {product.salePrice && product.salePrice < product.regularPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
                    {Math.round((1 - product.salePrice / product.regularPrice) * 100)}% off
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
          const product = row.original;
          const totalStock = product.stock || 0;
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">{totalStock}</div>
              {product.sizes && product.sizes.length > 0 && (
                <div className="text-xs text-gray-500">
                  {product.sizes.filter(s => s.available).length} sizes
                </div>
              )}
              {product.colors && product.colors.length > 0 && (
                <div className="text-xs text-gray-500">
                  {product.colors.filter(c => c.available).length} colors
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'ratings',
        header: 'Rating',
        cell: ({ row }) => {
          const ratings = row.original.ratings;
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(ratings?.average || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium text-gray-900">
                  {ratings?.average?.toFixed(1) || '0.0'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {ratings?.count || 0} reviews
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">{row.getValue('views')}</div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">
            {formatDate(row.getValue('createdAt'))}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const product = row.original;
          const [showActions, setShowActions] = useState(false);

          return (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowActions(false)}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Link>
                      <Link
                        href={`/dashboard/products/edit/${product._id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowActions(false)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/products/analytics/${product._id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowActions(false)}
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </Link>
                      
                      {product.isDeleted ? (
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowRestoreModal(true);
                            setShowActions(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                        >
                          <Undo className="w-4 h-4" />
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                            setShowActions(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  // Filter products based on status filter
  const filteredProducts = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter(product => {
      if (statusFilter === 'active') return product.status === 'active' && !product.isDeleted;
      if (statusFilter === 'deleted') return product.isDeleted;
      if (statusFilter === 'draft') return product.status === 'draft';
      if (statusFilter === 'pending') return product.status === 'pending';
      return true;
    });
  }, [products, statusFilter]);

  // Create table instance
  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct._id);
    }
  };

  const handleRestore = () => {
    if (selectedProduct) {
      restoreMutation.mutate(selectedProduct._id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">
                Error Loading Products
              </h2>
            </div>
            <p className="text-red-700 mb-4">
              Failed to load products. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Management
            </h1>
            <p className="text-gray-600">
              Manage all your products in one place
            </p>
          </div>
          <Link
            href="/dashboard/products/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {products.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {products.filter(p => p.status === 'active' && !p.isDeleted).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {products.filter(p => p.stock < 10).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {products.filter(p => p.featured).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {statusFilter !== 'all' && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      1
                    </span>
                  )}
                </button>

                {isFilterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-2 py-1">
                          Status
                        </div>
                        {['all', 'active', 'deleted', 'draft', 'pending'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsFilterOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded ${
                              statusFilter === status
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="capitalize">{status}</span>
                            {statusFilter === status && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        row.original.isDeleted ? 'bg-red-50' : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No products found</p>
                        <p className="text-gray-400">
                          {statusFilter !== 'all'
                            ? `No ${statusFilter} products available`
                            : 'Get started by adding your first product'}
                        </p>
                        {products.length === 0 && (
                          <Link
                            href="/dashboard/products/create"
                            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Your First Product
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      filteredProducts.length
                    )}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, table.getPageCount()) }).map((_, i) => {
                      const pageIndex = table.getPageCount() <= 5
                        ? i
                        : Math.max(0, Math.min(table.getPageCount() - 5, table.getState().pagination.pageIndex - 2)) + i;
                      
                      if (pageIndex >= table.getPageCount()) return null;
                      
                      return (
                        <button
                          key={pageIndex}
                          onClick={() => table.setPageIndex(pageIndex)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            table.getState().pagination.pageIndex === pageIndex
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageIndex + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Product
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{selectedProduct.title}"</span>?
                This product will be moved to trash and permanently deleted after 24 hours.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> This product has:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                  <li>{selectedProduct.stock || 0} items in stock</li>
                  <li>{selectedProduct.ratings?.count || 0} customer reviews</li>
                  <li>{selectedProduct.views || 0} views</li>
                  {selectedProduct.featured && (
                    <li className="font-semibold">Featured product</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Undo className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Restore Product
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to restore <span className="font-semibold">"{selectedProduct.title}"</span>?
                This product will be returned to active status and will be visible to customers.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestore}
                  disabled={restoreMutation.isPending}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {restoreMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Undo className="w-4 h-4" />
                      Restore Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}