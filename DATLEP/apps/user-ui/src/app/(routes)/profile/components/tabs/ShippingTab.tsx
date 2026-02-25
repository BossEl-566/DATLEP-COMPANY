'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin,
  Home,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Star,
  Phone,
  User,
} from 'lucide-react'
import axiosInstance from 'apps/user-ui/src/shared/utils/axiosInstance'

// -----------------------------
// Helpers
// -----------------------------
const optionalText = (max: number, message: string) =>
  z
    .string()
    .max(max, message)
    .optional()
    .or(z.literal(''))

// Address validation schema (FIXED: no .catch(new Error(...)))
const addressSchema = z.object({
  label: z.enum(['home', 'work', 'other']),

  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens and apostrophes'
    ),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/,
      'Please enter a valid phone number'
    ),

  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must not exceed 100 characters'),

  state: optionalText(100, 'State/Province must not exceed 100 characters'),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters'),

  area: optionalText(100, 'Area must not exceed 100 characters'),

  addressLine1: z
    .string()
    .min(5, 'Address line 1 must be at least 5 characters')
    .max(200, 'Address line 1 must not exceed 200 characters'),

  addressLine2: optionalText(200, 'Address line 2 must not exceed 200 characters'),

  postalCode: z
    .string()
    .max(20, 'Postal code must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9\s-]*$/,
      'Postal code can only contain letters, numbers, spaces and hyphens'
    )
    .optional()
    .or(z.literal('')),

  addressType: z.enum(['shipping', 'billing']),

  isDefault: z.boolean().default(false),
})

type AddressFormData = z.infer<typeof addressSchema>

interface Address extends AddressFormData {
  _id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ShippingTabProps {
  user: { _id?: string } | null
}

const ShippingTab: React.FC<ShippingTabProps> = ({ user }) => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: {
      label: 'home',
      recipientName: '',
      phone: '',
      country: 'Ghana',
      state: '',
      city: '',
      area: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      addressType: 'shipping',
      isDefault: false,
    },
  } as const)

  useEffect(() => {
    if (!user?._id) {
      setIsLoading(false)
      return
    }
    void fetchAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  const clearFlashLater = () => {
    setTimeout(() => {
      setSuccess(null)
      setError(null)
    }, 3000)
  }

  const normalizePayload = (data: AddressFormData) => ({
    ...data,
    state: data.state?.trim() || '',
    area: data.area?.trim() || '',
    addressLine2: data.addressLine2?.trim() || '',
    postalCode: data.postalCode?.trim() || '',
  })

  const fetchAddresses = async () => {
    if (!user?._id) return
    setIsLoading(true)
    setError(null)

    try {
      // Change this route if your backend uses a different path
      const response = await axiosInstance.get(
  `/user/api/${user._id}/addresses/get-addresses`
)
      setAddresses(response.data.addresses || [])
    } catch (err) {
      setError('Failed to load addresses. Please try again.')
      console.error('Error fetching addresses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: AddressFormData) => {
    if (!user?._id) {
      setError('User not found.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = normalizePayload(data)

      if (editingAddress) {
        await axiosInstance.patch(
  `/user/api/${user._id}/addresses/${editingAddress._id}`,
  payload
)
        setSuccess('Address updated successfully!')
      } else {
        await axiosInstance.post(
  `/user/api/${user._id}/addresses/create-address`,
  payload
)
        setSuccess('Address created successfully!')
      }

      await fetchAddresses()

      reset({
        label: 'home',
        recipientName: '',
        phone: '',
        country: 'Ghana',
        state: '',
        city: '',
        area: '',
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        addressType: 'shipping',
        isDefault: false,
      })

      setShowForm(false)
      setEditingAddress(null)
      clearFlashLater()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save address. Please try again.')
      console.error('Error saving address:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setError(null)
    setSuccess(null)

    reset({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      country: address.country,
      state: address.state || '',
      city: address.city,
      area: address.area || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      postalCode: address.postalCode || '',
      addressType: address.addressType,
      isDefault: address.isDefault,
    })

    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!user?._id) {
      setError('User not found.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await axiosInstance.delete(
  `/user/api/${user._id}/addresses/${addressId}`
)
      await fetchAddresses()
      setSuccess('Address deleted successfully!')
      setDeleteConfirm(null)
      clearFlashLater()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to delete address. Please try again.')
      console.error('Error deleting address:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (address: Address) => {
    if (!user?._id || address.isDefault) return

    setIsSubmitting(true)
    setError(null)

    try {
      await axiosInstance.patch(
  `/user/api/${user._id}/addresses/${address._id}`,
  {
    isDefault: true,
  }
)
      await fetchAddresses()
      setSuccess('Default address updated!')
      clearFlashLater()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to update default address.')
      console.error('Error setting default:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset({
      label: 'home',
      recipientName: '',
      phone: '',
      country: 'Ghana',
      state: '',
      city: '',
      area: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      addressType: 'shipping',
      isDefault: false,
    })
    setShowForm(false)
    setEditingAddress(null)
    setDeleteConfirm(null)
    setError(null)
  }

  const getLabelIcon = (label: Address['label']) => {
    switch (label) {
      case 'home':
        return <Home size={16} className="text-purple-600" />
      case 'work':
        return <Briefcase size={16} className="text-blue-600" />
      default:
        return <MapPin size={16} className="text-gray-600" />
    }
  }

  const getLabelColor = (label: Address['label']) => {
    switch (label) {
      case 'home':
        return 'bg-purple-100 text-purple-700'
      case 'work':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>

        {!showForm && (
          <button
            onClick={() => {
              setEditingAddress(null)
              setError(null)
              setSuccess(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus size={18} />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {success && (
        <div className="mb-4 flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle size={18} className="text-green-600" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle size={18} className="text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Label */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address Label <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('label')}
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.label ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
                {errors.label && (
                  <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
                )}
              </div>

              {/* Address Type */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('addressType')}
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.addressType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="shipping">Shipping</option>
                  <option value="billing">Billing</option>
                </select>
                {errors.addressType && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressType.message}</p>
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('recipientName')}
                  placeholder="John Doe"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.recipientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.recipientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipientName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+233241234567"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('country')}
                  placeholder="Ghana"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">State/Province</label>
                <input
                  type="text"
                  {...register('state')}
                  placeholder="Greater Accra"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="Accra"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Area/District</label>
                <input
                  type="text"
                  {...register('area')}
                  placeholder="Madina"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('addressLine1')}
                  placeholder="House No. 12, Medina Estate"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  {...register('addressLine2')}
                  placeholder="Landmark / Apartment / Floor"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.addressLine2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.addressLine2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressLine2.message}</p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  {...register('postalCode')}
                  placeholder="GA-123-4567"
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>

              {/* Default checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isDefault')}
                  id="isDefault"
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
                className={`rounded-lg px-6 py-2 text-white transition-colors ${
                  !isDirty || !isValid || isSubmitting
                    ? 'cursor-not-allowed bg-purple-600 opacity-50'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </span>
                ) : editingAddress ? (
                  'Update Address'
                ) : (
                  'Save Address'
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No addresses yet</h3>
          <p className="mb-4 text-gray-600">Add your first shipping address to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus size={18} />
            <span>Add Address</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`rounded-lg border p-5 transition-all ${
                address.isDefault
                  ? 'border-purple-300 bg-purple-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {deleteConfirm === address._id && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="mb-3 text-sm text-red-700">
                    Are you sure you want to delete this address?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(address._id)}
                      disabled={isSubmitting}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium ${getLabelColor(
                        address.label
                      )}`}
                    >
                      {getLabelIcon(address.label)}
                      <span className="capitalize">{address.label}</span>
                    </span>

                    <span className="inline-flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <MapPin size={12} />
                      <span className="capitalize">{address.addressType}</span>
                    </span>

                    {address.isDefault && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        <Star size={12} />
                        <span>Default</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium">{address.recipientName}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-600">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{[address.city, address.state, address.area].filter(Boolean).join(', ')}</p>
                        <p>{[address.country, address.postalCode].filter(Boolean).join(' - ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span>{address.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address)}
                      disabled={isSubmitting}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                      title="Set as default"
                    >
                      <Star size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(address)}
                    disabled={isSubmitting}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    title="Edit address"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirm((prev) => (prev === address._id ? null : address._id))
                    }
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    title="Delete address"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShippingTab