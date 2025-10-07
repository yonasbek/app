"use client"

export function FileCardSkeleton() {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]">
            <div className="flex flex-col space-y-3 w-full">
                {/* File icon skeleton */}
                <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-lg bg-gray-100 animate-pulse mb-2 h-12 w-12"></div>
                    {/* File name skeleton */}
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* File details skeleton */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex justify-center gap-2">
                        <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
                        <div className="w-3 h-3 bg-gray-100 rounded animate-pulse"></div>
                        <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                    <div className="w-20 h-5 bg-gray-100 rounded-full animate-pulse"></div>
                </div>

                {/* Action buttons skeleton */}
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-full h-8 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-100 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
