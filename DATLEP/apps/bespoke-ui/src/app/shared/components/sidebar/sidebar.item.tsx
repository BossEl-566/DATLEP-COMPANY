import Link from 'next/link'
import React from 'react'

interface Props {
    icon: React.ReactNode
    title: string
    isActive: boolean
    href: string
    className?: string
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    collapsed?: boolean
}

function SidebarItem({icon, title, isActive, href, className = '', onMouseEnter, onMouseLeave, collapsed = false}: Props) {
  return (
     <Link 
        href={href} 
        className='block'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
     >
        <div className={`flex items-center gap-3 h-10 px-3 rounded-lg cursor-pointer transition-all duration-200 ${className} ${isActive ? 'shadow-sm' : ''}`}>
            <div className="flex items-center justify-center w-5">
                {icon}
            </div>
            {title && !collapsed && (
                <span className='text-sm font-medium flex-1 truncate'>{title}</span>
            )}
            {isActive && !collapsed && (
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            )}
        </div>
     </Link>
  )
}

export default SidebarItem