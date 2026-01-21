'use client'

import React, { useEffect, useState } from 'react'
import useSidebar from '../../hooks/useSidebar'
import { usePathname } from 'next/navigation'
import useSeller from '../../hooks/useSeller'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  MessageSquare,
  Settings, 
  Bell, 
  Tag, 
  LogOut,
  PlusCircle,
  List,
  Inbox,
  Percent,
  Store,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react'
import SidebarItem from './sidebar.item'
import { motion, AnimatePresence } from 'framer-motion'


function SidebarWrapper() {
    const {activeSidebar, setActiveSidebar} = useSidebar()
    const pathName = usePathname()
    const {seller} = useSeller()
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        products: false,
        events: false,
        communications: false,
        extras: false
    })
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    console.log(seller)

    useEffect(() => {
        const pathSegments = pathName.split('/')
        const currentRoute = pathSegments[pathSegments.length - 1] || 'dashboard'
        setActiveSidebar(currentRoute)
    }, [pathName, setActiveSidebar])

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }))
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const getIconColor = (route: string) => 
        activeSidebar === route ? 'text-white' : 'text-gray-500'

    const getItemClass = (route: string) => 
        activeSidebar === route 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            href: '/seller/dashboard'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            href: '/dashboard/analytics'
        }
    ]

    const productItems = [
        {
            id: 'create-product',
            title: 'Create Product',
            icon: <PlusCircle className="w-5 h-5" />,
            href: '/dashboard/create-product'
        },
        {
            id: 'products',
            title: 'All Products',
            icon: <List className="w-5 h-5" />,
            href: '/dashboard/products'
        },
        {
            id: 'inventory',
            title: 'Inventory',
            icon: <Package className="w-5 h-5" />,
            href: '/dashboard/inventory'
        },
        {
            id: 'categories',
            title: 'Categories',
            icon: <Tag className="w-5 h-5" />,
            href: '/dashboard/categories'
        }
    ]

    const salesItems = [
        {
            id: 'orders',
            title: 'Orders',
            icon: <ShoppingCart className="w-5 h-5" />,
            href: '/dashboard/orders'
        },
        {
            id: 'payments',
            title: 'Payments',
            icon: <CreditCard className="w-5 h-5" />,
            href: '/dashboard/payments'
        },
        {
            id: 'customers',
            title: 'Customers',
            icon: <Users className="w-5 h-5" />,
            href: '/dashboard/customers'
        }
    ]

    const eventItems = [
        {
            id: 'create-event',
            title: 'Create Event',
            icon: <PlusCircle className="w-5 h-5" />,
            href: '/dashboard/events/create'
        },
        {
            id: 'events',
            title: 'All Events',
            icon: <Calendar className="w-5 h-5" />,
            href: '/dashboard/events'
        }
    ]

    const communicationItems = [
        {
            id: 'inbox',
            title: 'Inbox',
            icon: <Inbox className="w-5 h-5" />,
            href: '/seller/inbox'
        },
        {
            id: 'messages',
            title: 'Messages',
            icon: <MessageSquare className="w-5 h-5" />,
            href: '/seller/messages'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: <Bell className="w-5 h-5" />,
            href: '/seller/notifications'
        }
    ]

    const extraItems = [
        {
            id: 'discount-code',
            title: 'Discounts',
            icon: <Tag className="w-5 h-5" />,
            href: '/dashboard/discount-code'
        },
        {
            id: 'promotions',
            title: 'Promotions',
            icon: <Percent className="w-5 h-5" />,
            href: '/dashboard/promotions'
        },
        {
            id: 'reports',
            title: 'Reports',
            icon: <FileText className="w-5 h-5" />,
            href: '/dashboard/reports'
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            href: '/dashboard/settings'
        }
    ]

    return (
        <div className={`h-screen flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            {!sidebarCollapsed && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <AnimatePresence>
                            {!sidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-900 leading-tight">Seller Hub</h2>
                                        <p className="text-xs text-gray-500">Professional Dashboard</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? 
                            <Menu className="w-4 h-4" /> : 
                            <X className="w-4 h-4" />
                        }
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* Main Menu */}
                <div className="mb-6">
                    <div className="px-2 mb-3">
                        {!sidebarCollapsed && (
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Overview
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <div key={item.id} className="relative">
                                <SidebarItem
                                    icon={React.cloneElement(item.icon, { 
                                        className: `w-4 h-4 ${getIconColor(item.id)}`
                                    })}
                                    title={sidebarCollapsed ? '' : item.title}
                                    isActive={activeSidebar === item.id}
                                    href={item.href}
                                    className={getItemClass(item.id)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    collapsed={sidebarCollapsed}
                                />
                                {sidebarCollapsed && hoveredItem === item.id && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                        {item.title}
                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('products')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Products
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.products ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.products) && expandedMenus.products && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {productItems.map((item) => (
                                <div key={item.id} className="relative">
                                    <SidebarItem
                                        icon={React.cloneElement(item.icon, { 
                                            className: `w-4 h-4 ${getIconColor(item.id)}`
                                        })}
                                        title={sidebarCollapsed ? '' : item.title}
                                        isActive={activeSidebar === item.id}
                                        href={item.href}
                                        className={getItemClass(item.id)}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        collapsed={sidebarCollapsed}
                                    />
                                    {sidebarCollapsed && hoveredItem === item.id && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                            {item.title}
                                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Events */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('events')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Events
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.events ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.events) && expandedMenus.events && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {eventItems.map((item) => (
                                <div key={item.id} className="relative">
                                    <SidebarItem
                                        icon={React.cloneElement(item.icon, { 
                                            className: `w-4 h-4 ${getIconColor(item.id)}`
                                        })}
                                        title={sidebarCollapsed ? '' : item.title}
                                        isActive={activeSidebar === item.id}
                                        href={item.href}
                                        className={getItemClass(item.id)}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        collapsed={sidebarCollapsed}
                                    />
                                    {sidebarCollapsed && hoveredItem === item.id && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                            {item.title}
                                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Communications */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('communications')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Communications
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.communications ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.communications) && expandedMenus.communications && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {communicationItems.map((item) => (
                                <div key={item.id} className="relative">
                                    <SidebarItem
                                        icon={React.cloneElement(item.icon, { 
                                            className: `w-4 h-4 ${getIconColor(item.id)}`
                                        })}
                                        title={sidebarCollapsed ? '' : item.title}
                                        isActive={activeSidebar === item.id}
                                        href={item.href}
                                        className={getItemClass(item.id)}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        collapsed={sidebarCollapsed}
                                    />
                                    {sidebarCollapsed && hoveredItem === item.id && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                            {item.title}
                                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Sales */}
                <div className="mb-6">
                    <div className="px-2 mb-3">
                        {!sidebarCollapsed && (
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Sales
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        {salesItems.map((item) => (
                            <div key={item.id} className="relative">
                                <SidebarItem
                                    icon={React.cloneElement(item.icon, { 
                                        className: `w-4 h-4 ${getIconColor(item.id)}`
                                    })}
                                    title={sidebarCollapsed ? '' : item.title}
                                    isActive={activeSidebar === item.id}
                                    href={item.href}
                                    className={getItemClass(item.id)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    collapsed={sidebarCollapsed}
                                />
                                {sidebarCollapsed && hoveredItem === item.id && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                        {item.title}
                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extras */}
                <div className="mb-6">
                    <div className="px-2 mb-3">
                        {!sidebarCollapsed && (
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Management
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        {extraItems.map((item) => (
                            <div key={item.id} className="relative">
                                <SidebarItem
                                    icon={React.cloneElement(item.icon, { 
                                        className: `w-4 h-4 ${getIconColor(item.id)}`
                                    })}
                                    title={sidebarCollapsed ? '' : item.title}
                                    isActive={activeSidebar === item.id}
                                    href={item.href}
                                    className={getItemClass(item.id)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    collapsed={sidebarCollapsed}
                                />
                                {sidebarCollapsed && hoveredItem === item.id && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                        {item.title}
                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Compact and Professional */}
            <div className="border-t border-gray-100 p-4">
                {/* Compact Seller Info */}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onMouseEnter={() => setHoveredItem('logout')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                        onClick={() => {/* Handle logout */}}
                    >
                        <LogOut className="w-4 h-4" />
                        {!sidebarCollapsed && (
                            <span className="text-sm font-medium">Logout</span>
                        )}
                        {sidebarCollapsed && hoveredItem === 'logout' && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                Logout
                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                        )}
                    </button>

                    
                </div>

                {/* Branding - Minimal */}
                {!sidebarCollapsed && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">D</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-900">DATLEP</span>
                                    <span className="text-[10px] text-gray-400 ml-1">PRO</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">v2.1</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SidebarWrapper