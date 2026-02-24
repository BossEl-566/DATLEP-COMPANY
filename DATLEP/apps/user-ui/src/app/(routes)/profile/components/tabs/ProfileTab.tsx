// app/profile/components/tabs/ProfileTab.tsx
import React from 'react'

interface ProfileTabProps {
  user: any
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default ProfileTab