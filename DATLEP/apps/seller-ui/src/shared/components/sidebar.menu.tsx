import React from 'react'

interface Props {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    isExpanded?: boolean;
    onToggle?: () => void;
}

function SidebarMenu({title, children, icon, isExpanded, onToggle}: Props) {
  return (
    <div className='block mb-4'>
        <div 
            className="flex items-center justify-between px-4 mb-2 cursor-pointer hover:bg-gray-50 rounded-lg py-2"
            onClick={onToggle}
        >
            <div className="flex items-center gap-2">
                {icon && <span className="text-gray-400">{icon}</span>}
                <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{title}</h3>
            </div>
        </div>
        {isExpanded && (
            <div className="ml-4 border-l border-gray-200 pl-2">
                {children}
            </div>
        )}
    </div>
  )
}

export default SidebarMenu