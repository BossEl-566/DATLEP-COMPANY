// app/profile/components/tabs/OrdersTab.tsx
import React from 'react'

const OrdersTab: React.FC<{ user: any }> = ({ user }) => {
  // Sample orders data
  const orders = [
    { id: 'ORD001', date: '2026-01-15', status: 'In Production', total: 249.99 },
    { id: 'ORD002', date: '2026-01-10', status: 'Shipped', total: 189.50 },
    { id: 'ORD003', date: '2026-01-05', status: 'Delivered', total: 329.99 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order #{order.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{new Date(order.date).toLocaleDateString()}</span>
              <span className="font-medium">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersTab