// app/profile/components/tabs/NotificationsTab.tsx
import React from 'react'

const NotificationsTab: React.FC<{ user: any }> = ({ user }) => {
  const notifications = [
    { id: 1, message: 'Your order #ORD001 is now in production', time: '2 hours ago', read: false },
    { id: 2, message: 'New message from tailor', time: '1 day ago', read: true },
    { id: 3, message: 'Your referral earned 500 points!', time: '2 days ago', read: true },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-lg border ${notif.read ? 'border-gray-200' : 'border-purple-200 bg-purple-50'}`}
          >
            <p className="text-gray-900">{notif.message}</p>
            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsTab