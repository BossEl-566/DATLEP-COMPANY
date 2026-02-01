'use client'

import React, { useEffect, useState } from 'react'
import useSidebar from '../../../../hooks/useSidebar'
import { usePathname } from 'next/navigation'
import useBespoke from '../../../../hooks/useBespoke'
import { 
  LayoutDashboard, 
  Scissors,
  Users, 
  CreditCard, 
  Calendar, 
  MessageSquare,
  Settings, 
  Bell, 
  LogOut,
  PlusCircle,
  List,
  Inbox,
  FileText,
  Store,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Package,
  Award,
  Palette,
  Heart,
  Target,
  Briefcase,
  Sparkles,
  Truck,
  Shield,
  Zap,
  ImageDownIcon,
  ImageDown,
} from 'lucide-react'
import SidebarItem from './sidebar.item'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import logo from '../../../assets/images/datlep-logo.png' // Import your logo

function BespokeSidebarWrapper() {
    const {activeSidebar, setActiveSidebar} = useSidebar()
    const pathName = usePathname()
    const {bespoke} = useBespoke()
    console.log(bespoke)
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        projects: false,
        portfolio: false,
        services: false,
        communications: false,
        extras: false
    })
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            href: '/bespoke/dashboard'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            href: '/bespoke/analytics'
        }
    ]

    const projectItems = [
        {
            id: 'create-project',
            title: 'New Project',
            icon: <PlusCircle className="w-5 h-5" />,
            href: '/bespoke/projects/create'
        },
        {
            id: 'active-projects',
            title: 'Active Projects',
            icon: <Zap className="w-5 h-5" />,
            href: '/bespoke/projects/active'
        },
        {
            id: 'completed-projects',
            title: 'Completed',
            icon: <Award className="w-5 h-5" />,
            href: '/bespoke/projects/completed'
        },
        {
            id: 'all-projects',
            title: 'All Projects',
            icon: <List className="w-5 h-5" />,
            href: '/bespoke/projects'
        }
    ]

    const clientItems = [
        {
            id: 'clients',
            title: 'My Clients',
            icon: <Users className="w-5 h-5" />,
            href: '/bespoke/clients'
        },
        {
            id: 'inquiries',
            title: 'New Inquiries',
            icon: <Inbox className="w-5 h-5" />,
            href: '/bespoke/inquiries'
        },
        {
            id: 'appointments',
            title: 'Appointments',
            icon: <Calendar className="w-5 h-5" />,
            href: '/bespoke/appointments'
        },
        {
            id: 'reviews',
            title: 'Reviews',
            icon: <Heart className="w-5 h-5" />,
            href: '/bespoke/reviews'
        }
    ]

    const portfolioItems = [
        {
            id: 'create-portfolio',
            title: 'Add Work',
            icon: <PlusCircle className="w-5 h-5" />,
            href: '/bespoke/portfolio/create'
        },
        {
            id: 'my-portfolio',
            title: 'My Portfolio',
            icon: <ImageDownIcon className="w-5 h-5" />,
            href: '/bespoke/portfolio'
        },
        {
            id: 'categories',
            title: 'Categories',
            icon: <Briefcase className="w-5 h-5" />,
            href: '/bespoke/portfolio/categories'
        }
    ]

    const serviceItems = [
        {
            id: 'services',
            title: 'My Services',
            icon: <Scissors className="w-5 h-5" />,
            href: '/bespoke/services'
        },
        {
            id: 'pricing',
            title: 'Pricing',
            icon: <CreditCard className="w-5 h-5" />,
            href: '/bespoke/pricing'
        },
        {
            id: 'customization',
            title: 'Customization',
            icon: <Palette className="w-5 h-5" />,
            href: '/bespoke/customization'
        },
        {
            id: 'materials',
            title: 'Materials',
            icon: <Package className="w-5 h-5" />,
            href: '/bespoke/materials'
        }
    ]

    const communicationItems = [
        {
            id: 'inbox',
            title: 'Inbox',
            icon: <Inbox className="w-5 h-5" />,
            href: '/bespoke/inbox'
        },
        {
            id: 'messages',
            title: 'Messages',
            icon: <MessageSquare className="w-5 h-5" />,
            href: '/bespoke/messages'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: <Bell className="w-5 h-5" />,
            href: '/bespoke/notifications'
        }
    ]

    const extraItems = [
        {
            id: 'shop',
            title: 'My Shop',
            icon: <Store className="w-5 h-5" />,
            href: '/bespoke/shop'
        },
        {
            id: 'orders',
            title: 'Orders',
            icon: <Package className="w-5 h-5" />,
            href: '/bespoke/orders'
        },
        {
            id: 'payments',
            title: 'Payments',
            icon: <CreditCard className="w-5 h-5" />,
            href: '/bespoke/payments'
        },
        {
            id: 'shipping',
            title: 'Shipping',
            icon: <Truck className="w-5 h-5" />,
            href: '/bespoke/shipping'
        },
        {
            id: 'reports',
            title: 'Reports',
            icon: <FileText className="w-5 h-5" />,
            href: '/bespoke/reports'
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            href: '/bespoke/settings'
        }
    ]

    return (
        <div className={`h-screen flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                                {/* Replace with your logo */}
                                <Image 
                                    src={logo} 
                                    alt="DATLEP Logo" 
                                    width={24} 
                                    height={24}
                                    className="object-contain"
                                />
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
                                        <h2 className="text-sm font-semibold text-gray-900 leading-tight">Creator Studio</h2>
                                        <p className="text-xs text-gray-500">Bespoke Dashboard</p>
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

                {/* Projects */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('projects')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Target className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Projects
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.projects ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.projects) && expandedMenus.projects && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {projectItems.map((item) => (
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

                {/* Portfolio */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('portfolio')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <ImageDown className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Portfolio
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.portfolio ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.portfolio) && expandedMenus.portfolio && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {portfolioItems.map((item) => (
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

                {/* Clients */}
                <div className="mb-6">
                    <div className="px-2 mb-3">
                        {!sidebarCollapsed && (
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Clients
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        {clientItems.map((item) => (
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

                {/* Services */}
                <div className="mb-6">
                    <div 
                        className="flex items-center justify-between px-2 mb-3 cursor-pointer"
                        onClick={() => toggleMenu('services')}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-gray-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Services
                                </p>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            expandedMenus.services ? 
                                <ChevronDown className="w-3 h-3 text-gray-400" /> : 
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                    
                    {(!sidebarCollapsed || expandedMenus.services) && expandedMenus.services && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-2 border-l border-gray-200 pl-2 space-y-1"
                        >
                            {serviceItems.map((item) => (
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

                {/* Management */}
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

            {/* Bottom Section - Creator Info */}
            <div className="border-t border-gray-100 p-4">
                {/* Creator Profile Summary */}
                {bespoke && !sidebarCollapsed && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {bespoke.name?.charAt(0) || 'C'}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Sparkles className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                    {bespoke.name || 'Creator'}
                                </h3>
                                <p className="text-xs text-gray-600 truncate">
                                    {bespoke.creatorType || 'Bespoke Creator'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                            style={{ width: `${bespoke.profileCompletion || 20}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-medium text-purple-600">
                                        {bespoke.profileCompletion || 20}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onMouseEnter={() => setHoveredItem('logout')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/bespoke/login';
                        }}
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

                    {!sidebarCollapsed && (
                        <button 
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            onClick={() => window.open('/bespoke/shop', '_blank')}
                            title="View Your Shop"
                        >
                            <Store className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Branding */}
                {!sidebarCollapsed && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative w-6 h-6">
                                    <Image 
                                        src={logo} 
                                        alt="DATLEP Logo" 
                                        width={24} 
                                        height={24}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-900">DATLEP</span>
                                    <span className="text-[10px] text-purple-600 ml-1">CREATORS</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] text-gray-400 font-mono">v2.1</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BespokeSidebarWrapper