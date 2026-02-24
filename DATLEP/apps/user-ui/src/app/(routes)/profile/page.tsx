// app/profile/page.tsx
'use client'

import React, { useState } from 'react'
import useUser from 'apps/user-ui/src/configs/hooks/useUser'
import ProfileSidebar from './components/ProfileSidebar'
import ProfileContent from './components/ProfileContent'
import ProfileRightSidebar from './components/ProfileRightSidebar'

type TabType = 'profile' | 'orders' | 'inbox' | 'notifications' | 'shipping' | 'change-password'

function ProfilePage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  console.log(user)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:w-1/4">
            <ProfileSidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              user={user}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/4">
            <ProfileContent activeTab={activeTab} user={user} />
          </div>

          {/* Right Sidebar - Rewards & Info */}
          <div className="lg:w-1/4">
            <ProfileRightSidebar user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage