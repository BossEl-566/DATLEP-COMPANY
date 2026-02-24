// app/profile/components/ProfileSidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { 
  User, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  MapPin, 
  Key, 
  LogOut,
  ChevronRight
} from 'lucide-react'

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tab: any) => void
  user: any
}

const menuItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'inbox', label: 'Inbox', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shipping', label: 'Shipping Address', icon: MapPin },
  { id: 'change-password', label: 'Change Password', icon: Key },
]

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  onTabChange,
  user 
}) => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* User Info Summary */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={isActive ? 'text-purple-600' : 'text-gray-300'} 
                  />
                </button>
              </li>
            )
          })}
          
          {/* Logout Button */}
          <li className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default ProfileSidebar