'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Activity, Stethoscope, TrendingUp, Users, MapPin, Clock, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import KeyReportsOverview from '../../../components/info-desk/KeyReportsOverview';

const subMenuItems = [
    { path: '/info-desk', name: 'Dashboard', icon: BarChart3 },
    { path: '/info-desk/ambulance', name: 'Ambulance Reports', icon: Activity },
    { path: '/info-desk/medical-service', name: 'Medical Service Reports', icon: Stethoscope },
];

export default function InfoDeskPage() {
    const pathname = usePathname();

    const handleRefresh = async () => {
        // Simulate refresh delay
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-app-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-app-foreground">Info Desk Dashboard</h1>
                            <p className="text-neutral-600 mt-1">Comprehensive healthcare analytics and reporting</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b border-app-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4">
                        {subMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-neutral-600 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Hospitals</p>
                                <p className="text-3xl font-bold">1,247</p>
                                <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
                            </div>
                            <Stethoscope className="w-12 h-12 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Active Ambulances</p>
                                <p className="text-3xl font-bold">892</p>
                                <p className="text-red-100 text-xs mt-1">+8% from last month</p>
                            </div>
                            <Activity className="w-12 h-12 text-red-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Beds</p>
                                <p className="text-3xl font-bold">15,432</p>
                                <p className="text-green-100 text-xs mt-1">+5% from last month</p>
                            </div>
                            <Users className="w-12 h-12 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Coverage</p>
                                <p className="text-3xl font-bold">94%</p>
                                <p className="text-purple-100 text-xs mt-1">National coverage</p>
                            </div>
                            <MapPin className="w-12 h-12 text-purple-200" />
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6">
                                <h3 className="text-lg font-semibold text-app-foreground mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/info-desk/medical-service"
                                        className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Stethoscope className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-app-foreground">Medical Services</p>
                                                <p className="text-sm text-neutral-600">Hospital analytics</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <Link
                                        href="/info-desk/ambulance"
                                        className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-6 h-6 text-red-600" />
                                            <div>
                                                <p className="font-medium text-app-foreground">Ambulance Services</p>
                                                <p className="text-sm text-neutral-600">Emergency response</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Alerts */}
                            <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6">
                                <h3 className="text-lg font-semibold text-app-foreground mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    Recent Alerts
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-medium text-app-foreground">Low Ambulance Availability</p>
                                            <p className="text-xs text-neutral-600">Addis Ababa region</p>
                                            <p className="text-xs text-orange-600">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-medium text-app-foreground">New Hospital Added</p>
                                            <p className="text-xs text-neutral-600">Dire Dawa region</p>
                                            <p className="text-xs text-green-600">4 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Reports Overview */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-app-foreground">Key Reports Overview</h2>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Clock className="w-4 h-4" />
                                    Last updated: 2 minutes ago
                                </div>
                            </div>
                            <KeyReportsOverview />
                        </div>
                    </div>
                </div>

                {/* Additional Reports Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-app-foreground mb-6">Additional Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Performance Metrics */}
                        <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-app-foreground">Performance Metrics</h3>
                            </div>
                            <p className="text-neutral-600 text-sm mb-4">Track key performance indicators and trends</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Response Time</span>
                                    <span className="text-sm font-medium text-green-600">↓ 15%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Coverage Rate</span>
                                    <span className="text-sm font-medium text-green-600">↑ 8%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Efficiency</span>
                                    <span className="text-sm font-medium text-blue-600">↑ 12%</span>
                                </div>
                            </div>
                        </div>

                        {/* Regional Analysis */}
                        <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-app-foreground">Regional Analysis</h3>
                            </div>
                            <p className="text-neutral-600 text-sm mb-4">Comprehensive regional healthcare analysis</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Total Regions</span>
                                    <span className="text-sm font-medium text-app-foreground">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Covered Areas</span>
                                    <span className="text-sm font-medium text-green-600">94%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Active Services</span>
                                    <span className="text-sm font-medium text-blue-600">1,247</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Response */}
                        <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-app-foreground">Emergency Response</h3>
                            </div>
                            <p className="text-neutral-600 text-sm mb-4">Real-time emergency response metrics</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Active Calls</span>
                                    <span className="text-sm font-medium text-red-600">23</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Response Time</span>
                                    <span className="text-sm font-medium text-green-600">8.5 min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600">Success Rate</span>
                                    <span className="text-sm font-medium text-green-600">96%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}