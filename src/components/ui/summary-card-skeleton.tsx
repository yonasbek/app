"use client"

export function SummaryCardSkeleton() {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="rounded-full w-8 h-8 bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
    )
}

export function RecentUploadsSkeleton() {
    return (
        <div className="col-span-full">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-200 rounded-lg p-2 w-9 h-9 animate-pulse"></div>
                            <div className="flex-1 min-w-0">
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
