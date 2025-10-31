'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BarChart3, Activity, Stethoscope, TrendingUp, Users, MapPin, Clock, AlertTriangle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import KeyReportsOverview from '../../../components/info-desk/KeyReportsOverview';
import { medicalServiceAPI } from '../../../services/medicalService';
import { RegionalAmbulanceDashboardDto } from '../../../types/medical-service';

const subMenuItems = [
    { path: '/info-desk', name: 'Dashboard', icon: BarChart3 },
    { path: '/info-desk/ambulance', name: 'Ambulance Reports', icon: Activity },
    { path: '/info-desk/medical-service', name: 'Medical Service Reports', icon: Stethoscope },
];

export default function InfoDeskPage() {
    const pathname = usePathname();
    const [dashboardData, setDashboardData] = useState<RegionalAmbulanceDashboardDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await medicalServiceAPI.getRegionalAmbulanceDashboard();
            setDashboardData(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRefresh = async () => {
        await fetchDashboardData();
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
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {loading ? 'Loading...' : 'Refresh Data'}
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
            <div className="mx-auto py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-lg text-neutral-600">Loading dashboard data...</span>
                    </div>
                ) : (
                    <>
                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {dashboardData?.cards.map((card, index) => {
                                // Fix: add opacity to bg colors using correct Tailwind color classes
                                const gradientClasses = [
                                    'bg-gradient-to-r from-blue-900/80 to-blue-900/60',    // vibrant blue with opacity
                                    'bg-gradient-to-r from-yellow-900/80 to-yellow-900/60', // yellow
                                    'bg-gradient-to-r from-green-900/80 to-green-900/60',   // green
                                    'bg-gradient-to-r from-purple-900/80 to-purple-900/60'  // purple
                                ];
                                const iconClasses = [
                                    'text-blue-200',
                                    'text-yellow-200',
                                    'text-green-200',
                                    'text-purple-200'
                                ];
                                const textClasses = [
                                    'text-blue-100',
                                    'text-yellow-100',
                                    'text-green-100',
                                    'text-purple-100'
                                ];
                                const icons = [Stethoscope, Activity, Users, MapPin];

                                const Icon = icons[index % icons.length];
                                const gradientClass = gradientClasses[index % gradientClasses.length];
                                const iconClass = iconClasses[index % iconClasses.length];
                                const textClass = textClasses[index % textClasses.length];

                                return (
                                    <div key={card.title} className={`${gradientClass} rounded-xl p-6 text-white shadow-lg`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`${textClass} text-sm font-medium`}>{card.title}</p>
                                                <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
                                                {card.change && (
                                                    <p className={`${textClass} text-xs mt-1`}>
                                                        {card.change} from last month
                                                    </p>
                                                )}
                                            </div>
                                            <Icon className={`w-12 h-12 ${iconClass}`} />
                                        </div>
                                    </div>
                                );
                            })}
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

                                    {/* Regional Statistics */}
                                    <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6">
                                        <h3 className="text-lg font-semibold text-app-foreground mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Regional Ambulance Statistics
                                        </h3>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {dashboardData?.regionStats.slice(0, 5).map((region, index) => (
                                                <div key={region.region} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-app-foreground">{region.region}</p>
                                                        <div className="flex justify-between text-xs text-neutral-600 mt-1">
                                                            <span>Functional: {region.functionalAmbulances}</span>
                                                            <span>Rate: {region.functionalityRate.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
                                            Last updated: {lastUpdated.toLocaleTimeString()}
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
                                {/* Ambulance Type Statistics */}
                                <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Activity className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-app-foreground">Ambulance Types</h3>
                                    </div>
                                    <p className="text-neutral-600 text-sm mb-4">Distribution of ambulance types</p>
                                    <div className="space-y-2">
                                        {dashboardData?.ambulanceTypeStats.map((type, index) => (
                                            <div key={type.type} className="flex justify-between items-center">
                                                <span className="text-sm text-neutral-600">{type.type}</span>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-app-foreground">{type.count.toLocaleString()}</span>
                                                    <span className="text-xs text-neutral-500 ml-2">({type.percentage.toFixed(1)}%)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Paramedic Statistics */}
                                <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-app-foreground">Paramedic Utilization</h3>
                                    </div>
                                    <p className="text-neutral-600 text-sm mb-4">{dashboardData?.paramedicStats.title}</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-neutral-600">Total Paramedics</span>
                                            <span className="text-sm font-medium text-app-foreground">{dashboardData?.paramedicStats.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-neutral-600">Working on Ambulance</span>
                                            <span className="text-sm font-medium text-green-600">{dashboardData?.paramedicStats.workingOnAmbulance.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-neutral-600">Utilization Rate</span>
                                            <span className="text-sm font-medium text-blue-600">{dashboardData?.paramedicStats.utilizationRate.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Infrastructure Statistics */}
                                <div className="bg-white rounded-xl shadow-sm border border-app-secondary p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <MapPin className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-app-foreground">Infrastructure</h3>
                                    </div>
                                    <p className="text-neutral-600 text-sm mb-4">Supporting infrastructure facilities</p>
                                    <div className="space-y-2">
                                        {dashboardData?.infrastructureStats.map((facility, index) => (
                                            <div key={facility.facility} className="flex justify-between items-center">
                                                <span className="text-sm text-neutral-600">{facility.facility}</span>
                                                <span className={`text-sm font-medium ${facility.colorClass}`}>{facility.count.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}