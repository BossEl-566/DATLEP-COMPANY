// app/profile/components/tabs/ShippingTab.tsx
import React from 'react'

const ShippingTab: React.FC<{ user: any }> = ({ user }) => {
  // Sample addresses
  const addresses = [
    { type: 'Home', address: '123 Main St, New York, NY 10001', default: true },
    { type: 'Work', address: '456 Business Ave, New York, NY 10002', default: false },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Addresses</h2>
      <div className="space-y-4">
        {addresses.map((addr, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold">{addr.type}</span>
                {addr.default && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <button className="text-purple-600 text-sm hover:text-purple-700">Edit</button>
            </div>
            <p className="text-gray-600">{addr.address}</p>
          </div>
        ))}
        <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Add New Address
        </button>
      </div>
    </div>
  )
}

export default ShippingTab