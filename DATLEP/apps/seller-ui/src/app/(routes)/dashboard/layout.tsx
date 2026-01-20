import React from 'react'
import SidebarWrapper from '../../../shared/components/sidebar'

function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-white'>
        {/* Sidebar */}
        <aside className="h-screen sticky top-0">
            <SidebarWrapper />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </div>
        </main>
    </div>
  )
}

export default Layout