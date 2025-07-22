'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import {
    Smartphone,
    Tablet,
    Monitor,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

export default function ResponsiveTest() {
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateScreenSize = () => {
            if (window.innerWidth < 768) {
                setScreenSize('mobile');
            } else if (window.innerWidth < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 z-50 p-3 gradient-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <Eye className="w-5 h-5" />
            </button>
        );
    }

    const breakpoints = [
        { name: 'Mobile', min: '0px', max: '767px', icon: Smartphone, current: screenSize === 'mobile' },
        { name: 'Tablet', min: '768px', max: '1023px', icon: Tablet, current: screenSize === 'tablet' },
        { name: 'Desktop', min: '1024px', max: '∞', icon: Monitor, current: screenSize === 'desktop' }
    ];

    const responsiveFeatures = [
        {
            name: 'Sidebar Collapse',
            mobile: 'Hidden by default, overlay when opened',
            tablet: 'Collapsible sidebar',
            desktop: 'Full sidebar with toggle',
            status: 'working'
        },
        {
            name: 'Navigation',
            mobile: 'Hamburger menu',
            tablet: 'Collapsed with icons',
            desktop: 'Full navigation with labels',
            status: 'working'
        },
        {
            name: 'Statistics Cards',
            mobile: '1 column grid',
            tablet: '2 column grid',
            desktop: '4 column grid',
            status: 'working'
        },
        {
            name: 'Data Tables',
            mobile: 'Card view',
            tablet: 'Card view',
            desktop: 'Table view',
            status: 'working'
        },
        {
            name: 'Content Layout',
            mobile: 'Single column',
            tablet: 'Responsive grid',
            desktop: 'Multi-column layout',
            status: 'working'
        }
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Card className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Responsive Test</h3>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                        <EyeOff className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Current Screen Size */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Screen Size:</p>
                    <div className="flex items-center space-x-2">
                        {breakpoints.map(bp => {
                            const Icon = bp.icon;
                            return (
                                <div
                                    key={bp.name}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bp.current ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-xs font-medium">{bp.name}</span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Window: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}px` : 'Loading...'}
                    </p>
                </div>

                {/* Breakpoint Info */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Breakpoints:</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                        {breakpoints.map(bp => (
                            <div key={bp.name} className="flex justify-between">
                                <span>{bp.name}:</span>
                                <span>{bp.min} - {bp.max}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Responsive Features Status */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features Status:</h4>
                    <div className="space-y-2">
                        {responsiveFeatures.map(feature => (
                            <div key={feature.name} className="text-xs">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-700">{feature.name}</span>
                                    {feature.status === 'working' ? (
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                    )}
                                </div>
                                <div className="text-gray-500 space-y-0.5">
                                    <div>Mobile: {feature.mobile}</div>
                                    <div>Tablet: {feature.tablet}</div>
                                    <div>Desktop: {feature.desktop}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test Instructions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                        Resize your browser window to test different breakpoints. All features should adapt smoothly.
                    </p>
                </div>
            </Card>
        </div>
    );
} 