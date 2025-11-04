'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Home,
    Calendar,
    Users,
    BookOpen,
    FileText,
    Clock,
    MapPin,
    Phone,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Upload,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Activity,
    Stethoscope
} from 'lucide-react';
import Image from 'next/image';

const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/plans', name: 'Annual Plans', icon: Calendar },
    { path: '/my-tasks', name: 'My Tasks', icon: Calendar },
    { path: '/budget', name: 'Budget', icon: DollarSign },
    {
        path: '/info-desk',
        name: 'Info Desk',
        icon: BarChart3,
        subItems: [
            { path: '/info-desk', name: 'Dashboard', icon: BarChart3 },
            { path: '/info-desk/ambulance', name: 'Ambulance Reports', icon: Activity },
            { path: '/info-desk/medical-service', name: 'Medical Service Reports', icon: Stethoscope },
        ]
    },
    { path: '/knowledge-base', name: 'Knowledge Base', icon: BookOpen },
    { path: '/memos', name: 'Memos & Proposals', icon: FileText },
    { path: '/attendance', name: 'Attendance', icon: Clock },
    { path: '/rooms', name: 'Meeting Rooms', icon: MapPin },
    { path: '/contacts', name: 'Contacts', icon: Phone },
    { path: '/training', name: 'Training', icon: BookOpen },
    { path: '/users', name: 'Users', icon: Users },
    { path: '/import', name: 'Data Import', icon: Upload },
    { path: '/reports', name: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen?: boolean;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const toggleSubMenu = (menuPath: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuPath)
                ? prev.filter(path => path !== menuPath)
                : [...prev, menuPath]
        );
    };

    const isSubMenuExpanded = (menuPath: string) => {
        return expandedMenus.includes(menuPath);
    };

    const isSubMenuActive = (item: any) => {
        if (item.subItems) {
            return item.subItems.some((subItem: any) =>
                pathname === subItem.path || pathname.startsWith(subItem.path + '/')
            );
        }
        return pathname === item.path || pathname.startsWith(item.path + '/');
    };

    const isSubItemActive = (subItem: any) => {
        return pathname === subItem.path;
    };

    // Auto-expand sub-menus when navigating to their sub-items and close others
    useEffect(() => {
        const shouldExpandMenus: string[] = [];
        menuItems.forEach(item => {
            if (item.subItems) {
                const hasActiveSubItem = item.subItems.some((subItem: any) =>
                    pathname === subItem.path || pathname.startsWith(subItem.path + '/')
                );
                if (hasActiveSubItem) {
                    shouldExpandMenus.push(item.path);
                }
            }
        });

        // Close all sub-menus first, then expand only the ones that should be open
        setExpandedMenus(shouldExpandMenus);
    }, [pathname]);

    const showFullContent = !isCollapsed || isHovered;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out
                    ${/* Mobile: hidden by default, show as overlay when isMobileOpen */ ''}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                    ${/* Desktop: responsive width based on collapsed state */ ''}
                    lg:z-30 ${isCollapsed ? 'lg:w-16 lg:hover:w-64' : 'lg:w-64'}
                    ${/* Fixed width on mobile */ ''}
                    w-64
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="h-full bg-app-card border-r border-app-secondary flex flex-col shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-app-secondary">
                        <div className="flex items-center space-x-3">
                            <div className={`flex items-center justify-center ${(showFullContent || isMobileOpen) ? 'w-8 h-8' : 'w-10 h-10'}`}>
                                <Image
                                    src="/logo.png"
                                    alt="Office Management System Logo"
                                    className="rounded-md bg-white"
                                    width={showFullContent || isMobileOpen ? 36 : 40}
                                    height={showFullContent || isMobileOpen ? 36 : 40}
                                    priority
                                />
                            </div>
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-semibold text-lg text-app-foreground">
                                    Office Management
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onToggle}
                            className="p-1.5 rounded-md hover:bg-app-accent transition-colors"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-neutral-500" />
                            ) : (
                                <ChevronLeft className="w-4 h-4 text-neutral-500" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-1 overflow-y-auto`}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isSubMenuActive(item);
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = isSubMenuExpanded(item.path);

                            return (
                                <div key={item.path}>
                                    {/* Main Menu Item */}
                                    <div
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isActive
                                            ? 'bg-app-accent text-app-foreground border-l-3 border-app-foreground'
                                            : 'text-neutral-600 hover:bg-app-accent hover:text-app-foreground'
                                            }`}
                                        onClick={() => {
                                            if (hasSubItems) {
                                                toggleSubMenu(item.path);
                                            } else {
                                                // Close all sub-menus when clicking on a non-sub-menu item
                                                setExpandedMenus([]);
                                                router.push(item.path);
                                                if (isMobileOpen) {
                                                    onToggle();
                                                }
                                            }
                                        }}
                                    >
                                        {/* Icon - always visible with larger size when collapsed */}
                                        <Icon
                                            className={`transition-colors duration-200 ${isActive ? 'text-neutral-700' : 'text-neutral-500'
                                                } ${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-8 h-8 mx-auto'}`}
                                        />
                                        {/* Text - only visible when expanded or on mobile */}
                                        {(showFullContent || isMobileOpen) && (
                                            <>
                                                <span className="font-medium text-sm flex-1">{item.name}</span>
                                                {hasSubItems && (
                                                    <div className="ml-2">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Sub Menu Items */}
                                    {hasSubItems && (showFullContent || isMobileOpen) && isExpanded && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {item.subItems.map((subItem: any) => {
                                                const SubIcon = subItem.icon;
                                                const isSubActive = isSubItemActive(subItem);

                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        href={subItem.path}
                                                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isSubActive
                                                            ? 'bg-app-accent text-app-foreground'
                                                            : 'text-neutral-500 hover:bg-app-accent hover:text-app-foreground'
                                                            }`}
                                                        onClick={() => {
                                                            if (isMobileOpen) {
                                                                onToggle();
                                                            }
                                                        }}
                                                    >
                                                        <SubIcon className="w-4 h-4 mr-3" />
                                                        <span className="font-medium text-sm">{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    {/* Modern Support Contact Card */}
                    {(showFullContent || isMobileOpen) && (
                        <div className="pt-3 px-3 my-1">
                            <div className="flex items-center gap-3 rounded-lg bg-app-accent px-3 py-2 shadow-sm border border-app-foreground">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-app-accent rounded-full">
                                    <svg className="w-4 h-4 text-app-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12v4a4 4 0 01-8 0v-4m8 0V6a4 4 0 00-8 0v6m8 0H8"></path></svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-app-foreground font-medium leading-tight">

                                        <a
                                            href="mailto:support@jlinkdigital.com"
                                            className="underline hover:text-app-foreground font-semibold transition-colors"
                                        >
                                            Contact support
                                        </a>
                                    </span>
                                    <span className="text-xs text-app-foreground font-mono opacity-80 ml-0.5 select-all">
                                        support@jlinkdigital.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Footer */}
                    <div className="border-t border-app-secondary p-3 space-y-1">
                        <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-app-accent hover:text-app-foreground transition-colors duration-200">
                            {/* Settings Icon - always visible with larger size when collapsed */}
                            <Settings className={`${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-6 h-6 mx-auto'}`} />
                            {/* Settings Text - only visible when expanded or on mobile */}
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-medium text-sm">Settings</span>
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        >
                            {/* Logout Icon - always visible with larger size when collapsed */}
                            <LogOut className={`${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-6 h-6 mx-auto'}`} />
                            {/* Logout Text - only visible when expanded or on mobile */}
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-medium text-sm">Logout</span>
                            )}
                        </button>


                    </div>
                </div>
            </div>
        </>
    );
} 