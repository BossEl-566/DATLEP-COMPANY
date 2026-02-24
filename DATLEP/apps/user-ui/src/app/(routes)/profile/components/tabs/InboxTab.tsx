// app/profile/components/tabs/InboxTab.tsx
import React from 'react'

const InboxTab: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Inbox</h2>
      <p className="text-gray-500 text-center py-8">No messages yet</p>
    </div>
  )
}

export default InboxTab