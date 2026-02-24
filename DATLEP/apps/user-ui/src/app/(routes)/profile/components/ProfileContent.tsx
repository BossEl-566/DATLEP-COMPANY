// app/profile/components/ProfileContent.tsx
'use client'

import React from 'react'
import ProfileTab from './tabs/ProfileTab'
import OrdersTab from './tabs/OrdersTab'
import InboxTab from './tabs/InboxTab'
import NotificationsTab from './tabs/NotificationsTab'
import ShippingTab from './tabs/ShippingTab'
import ChangePasswordTab from './tabs/ChangePasswordTab'

interface ProfileContentProps {
  activeTab: string
  user: any
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, user }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} />
      case 'orders':
        return <OrdersTab user={user} />
      case 'inbox':
        return <InboxTab user={user} />
      case 'notifications':
        return <NotificationsTab user={user} />
      case 'shipping':
        return <ShippingTab user={user} />
      case 'change-password':
        return <ChangePasswordTab user={user} />
      default:
        return <ProfileTab user={user} />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {renderContent()}
    </div>
  )
}

export default ProfileContent