// app/profile/components/ProfileRightSidebar.tsx
'use client'

import React from 'react'
import { Gift, Award, Settings, CreditCard, ChevronRight, TrendingUp} from 'lucide-react'

interface ProfileRightSidebarProps {
  user: any
}

const ProfileRightSidebar: React.FC<ProfileRightSidebarProps> = ({ user }) => {
  const referralLink = `https://datlep.com/ref/${user?._id || 'user123'}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    // You can add a toast notification here
    alert('Referral link copied!')
  }

  // Conditional content based on user type
  const renderUserTypeSpecificContent = () => {
    switch(user?.userType) {
      case 'seller':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">Seller Dashboard</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <span className="font-bold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sales This Month</span>
                  <span className="font-bold text-green-600">$1,245</span>
                </div>
                <button className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Manage Store
                </button>
              </div>
            </div>
          </div>
        )
      
      case 'bespoke':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="text-purple-600" size={20} />
                <h3 className="font-semibold text-gray-900">Bespoke Professional</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Orders</span>
                  <span className="font-bold text-gray-900">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
                <button className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  View Orders
                </button>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 sticky top-4">
      {/* User Type Specific Content */}
      {renderUserTypeSpecificContent()}

      {/* Referral Program Card - For all users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">Invite Friend, Earn Points</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Share DATLEP with friends and earn 500 points when they make their first custom order!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Your referral link</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-gray-700 truncate flex-1">
                {referralLink}
              </p>
              <button 
                onClick={handleCopyLink}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 ml-2 whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Your points balance:</span>
            <span className="font-bold text-purple-600">2,500 pts</span>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Referrals:</span>
              <span className="font-medium text-gray-900">8 friends</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Award className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-900">Your Badges</h3>
            </div>
            <button className="text-purple-600 text-sm hover:text-purple-700 flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <Award className="text-white" size={24} />
                </div>
                <p className="text-xs font-medium text-gray-700">Early Bird</p>
                <p className="text-xs text-gray-500">2024</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-center text-sm text-purple-600 hover:text-purple-700">
            View achievements earned
          </button>
        </div>
      </div>

      {/* Account Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">Account Settings</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Manage your preferences and security
          </p>
          
          <button className="text-purple-600 text-sm hover:text-purple-700 flex items-center">
            Go to settings <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Billing History Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">Billing History</h3>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-900">Custom Dress Order</p>
                  <p className="text-xs text-gray-500">Jan {item}, 2026</p>
                </div>
                <span className="font-medium">$149.99</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-center text-sm text-purple-600 hover:text-purple-700">
            View all payments
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileRightSidebar