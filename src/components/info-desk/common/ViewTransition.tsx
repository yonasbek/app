'use client';

import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';

interface ViewTransitionProps {
    viewType: 'table' | 'charts';
    children: React.ReactNode;
    className?: string;
}

export default function ViewTransition({ 
    viewType, 
    children, 
    className = '' 
}: ViewTransitionProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentView, setCurrentView] = useState(viewType);

    useEffect(() => {
        if (currentView !== viewType) {
            setIsTransitioning(true);
            
            // Scroll to top to show the transition
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Show loading state for a brief moment to give visual feedback
            const timer = setTimeout(() => {
                setCurrentView(viewType);
                setIsTransitioning(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [viewType, currentView]);

    if (isTransitioning) {
        return (
            <div className={`space-y-4 ${className}`}>
                {/* Transition indicator */}
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-lg">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-blue-700 font-medium">
                            Switching to {viewType === 'table' ? 'Table' : 'Chart'} view...
                        </span>
                    </div>
                </div>
                
                {/* Skeleton loader */}
                <SkeletonLoader type={viewType} />
            </div>
        );
    }

    return <div className={className}>{children}</div>;
}
