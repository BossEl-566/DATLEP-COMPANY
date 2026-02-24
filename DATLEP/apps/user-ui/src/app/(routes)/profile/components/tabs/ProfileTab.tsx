// app/profile/components/tabs/ProfileTab.tsx
'use client'

import React, { useState } from 'react'
import { Edit2, Phone, MapPin, MessageCircle, Mail, BellRing } from 'lucide-react'

interface ProfileTabProps {
  user: any
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    preferredCommunicationMode: user?.preferredCommunicationMode || 'in-app',
    userType: user?.userType || 'customer',
    location: {
      country: user?.location?.country || '',
      city: user?.location?.city || ''
    }
  })

  const communicationModes = [
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'sms', label: 'SMS', icon: MessageCircle },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'in-app', label: 'In-App Notifications', icon: BellRing },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add update logic here
    console.log('Updating profile:', formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Location</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Communication Mode
              </label>
              <select
                name="preferredCommunicationMode"
                value={formData.preferredCommunicationMode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {communicationModes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="bespoke">Bespoke Professional</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
        >
          <Edit2 size={18} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 font-medium">{user?.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mobile Number
              </label>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-900">{user?.mobileNumber || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Member Since
              </label>
              <p className="text-gray-900">
                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Location Card */}
        {(user?.location?.country || user?.location?.city) && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
            <div className="flex items-start space-x-2">
              <MapPin size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-gray-900">
                  {[user?.location?.city, user?.location?.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Account Type
              </label>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                user?.userType === 'customer' ? 'bg-blue-100 text-blue-700' :
                user?.userType === 'seller' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Preferred Communication
              </label>
              <div className="flex items-center space-x-2">
                {user?.preferredCommunicationMode && 
                  (() => {
                    const mode = communicationModes.find(m => m.value === user.preferredCommunicationMode)
                    const Icon = mode?.icon || MessageCircle
                    return (
                      <>
                        <Icon size={16} className="text-gray-400" />
                        <span className="text-gray-900">{mode?.label || user.preferredCommunicationMode}</span>
                      </>
                    )
                  })()
                }
              </div>
            </div>
          </div>
        </div>

        {/* Following Stats */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Connections</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">{user?.following?.length || 0}</span>
            <span className="text-gray-600">Following</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab