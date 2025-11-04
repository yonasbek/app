"use client"

import { Star, MessageCircle, UserPlus, FileText, Download, Trash2, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils'

type FileCardProps = {
    id: string
    document_name: string
    document_size: number
    upload_date: string
    module: string
    onDownload: (id: string) => void
    onDelete?: (id: string) => void
    showApproveActions?: boolean
    onApprove?: (id: string) => void
    onReject?: (id: string) => void
}

export function FileCard({ id, document_name, document_size, upload_date, module, onDownload, onDelete, showApproveActions = false, onApprove, onReject }: FileCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]  transition-all duration-300 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.15)] hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex flex-col space-y-3 w-full">
                {/* File icon and name section */}
                <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-110 mb-2">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div className="relative w-full px-2">
                        <h3
                            className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 w-full cursor-pointer"
                            title={document_name}
                        >
                            {document_name}
                        </h3>
                        {/* Show full name on hover in a tooltip-like div */}

                    </div>
                </div>

                {/* File details section */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex flex-wrap justify-center gap-x-2 text-xs text-muted-foreground px-2 text-center">
                        <span>{(document_size / 1024).toFixed(2)} KB</span>
                        <span>•</span>
                        <span>{formatToEthiopianDate(upload_date, 'short')}</span>
                    </div>
                    <Badge variant="outline" className="transition-all duration-300 group-hover:bg-primary/10">
                        {module}
                    </Badge>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center space-x-2 transition-opacity">
                    <Button
                        variant="default"
                        onClick={() => onDownload(id)}
                        className="text-primary w-full hover:text-primary/80 p-2 transition-transform duration-300 hover:scale-110 bg-app-foreground text-white hover:border-app-foreground"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    {showApproveActions && onApprove && onReject ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onApprove(id)}
                                className="text-green-600 w-full hover:text-green-700 p-2 transition-transform duration-300 hover:scale-110 border-green-400 bg-green-50 hover:bg-green-100"
                            >
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onReject(id)}
                                className="text-red-600 w-full hover:text-red-700 p-2 transition-transform duration-300 hover:scale-110 border-red-400 bg-red-50 hover:bg-red-100"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    ) : onDelete ? (
                        <Button
                            variant="outline"
                            onClick={() => onDelete(id)}
                            className="text-destructive w-full hover:text-destructive/80 p-2 transition-transform duration-300 hover:scale-110 border-red-400 text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
    )
}