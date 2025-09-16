"use client";

import * as React from "react";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { File, FileSpreadsheet, X } from "lucide-react";
import { toast } from "sonner";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
                outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    }
);

interface ButtonProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                data-slot="button"
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card"
            className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)}
            {...props}
        />
    );
}

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> { }

function Progress({ className, value, ...props }: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full flex-1 transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

interface EnhancedFileUploadProps {
    onUpload: () => void;
    uploadFunction: (file: File) => Promise<void>;
    acceptedFileTypes?: string[];
    maxFileSize?: number; // in MB
    title?: string;
}

export default function EnhancedFileUpload({
    onUpload,
    uploadFunction,
    acceptedFileTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"],
    maxFileSize = 10,
    title = "File Upload"
}: EnhancedFileUploadProps) {
    const [uploadState, setUploadState] = useState<{
        file: File | null;
        progress: number;
        uploading: boolean;
    }>({
        file: null,
        progress: 0,
        uploading: false,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File | undefined) => {
        if (!file) return;

        // Validate file type
        if (!acceptedFileTypes.includes(file.type)) {
            toast.error("Please upload a valid file type.", {
                position: "bottom-right",
                duration: 3000,
            });
            return;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxFileSize}MB.`, {
                position: "bottom-right",
                duration: 3000,
            });
            return;
        }

        setUploadState({ file, progress: 0, uploading: true });

        try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadState(prev => {
                    const newProgress = Math.min(prev.progress + 10, 90);
                    return { ...prev, progress: newProgress };
                });
            }, 200);

            // Actual upload
            await uploadFunction(file);

            clearInterval(progressInterval);
            setUploadState(prev => ({ ...prev, progress: 100, uploading: false }));

            toast.success("File uploaded successfully!", {
                position: "bottom-right",
                duration: 3000,
            });

            // Call the callback after successful upload
            setTimeout(() => {
                onUpload();
                resetFile();
            }, 1000);

        } catch (error) {
            setUploadState(prev => ({ ...prev, uploading: false }));
            toast.error("Failed to upload file. Please try again.", {
                position: "bottom-right",
                duration: 3000,
            });
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFile(event.target.files?.[0]);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFile(event.dataTransfer.files?.[0]);
    };

    const resetFile = () => {
        setUploadState({ file: null, progress: 0, uploading: false });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getFileIcon = () => {
        if (!uploadState.file) return <File />;
        const fileExt = uploadState.file.name.split(".").pop()?.toLowerCase() || "";
        return ["csv", "xlsx", "xls"].includes(fileExt) ? (
            <FileSpreadsheet className="h-5 w-5 text-foreground" />
        ) : (
            <File className="h-5 w-5 text-foreground" />
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getAcceptString = () => {
        const extensions = [];
        if (acceptedFileTypes.includes("text/plain")) extensions.push(".txt");
        if (acceptedFileTypes.includes("application/pdf")) extensions.push(".pdf");
        if (acceptedFileTypes.includes("text/csv")) extensions.push(".csv");
        if (acceptedFileTypes.includes("application/vnd.ms-excel")) extensions.push(".xls");
        if (acceptedFileTypes.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) extensions.push(".xlsx");
        return extensions.join(", ");
    };

    const { file, progress, uploading } = uploadState;

    return (
        <div className="w-full ">
            <form className="w-full " onSubmit={(e) => e.preventDefault()}>
                <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>

                <div
                    className="flex justify-center rounded-md border border-dashed border-input px-6 py-12"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className="text-center">
                        <File className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden={true} />
                        <div className="flex text-sm leading-6 text-muted-foreground">
                            <p>Drag and drop or</p>
                            <label
                                htmlFor="file-upload-enhanced"
                                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
                            >
                                <span>choose file</span>
                                <input
                                    id="file-upload-enhanced"
                                    name="file-upload-enhanced"
                                    type="file"
                                    className="sr-only"
                                    accept={getAcceptString()}
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                />
                            </label>
                            <p className="pl-1">to upload</p>
                        </div>
                    </div>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
                    <span>Accepted: {getAcceptString()}</span>
                    <span className="pl-1 sm:pl-0">Max. size: {maxFileSize}MB</span>
                </p>

                {file && (
                    <Card className="relative mt-8 bg-muted p-4 gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label="Remove"
                            onClick={resetFile}
                            disabled={uploading}
                        >
                            <X className="h-5 w-5 shrink-0" aria-hidden={true} />
                        </Button>

                        <div className="flex items-center space-x-2.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                                {getFileIcon()}
                            </span>
                            <div>
                                <p className="text-xs font-medium text-foreground">{file?.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {file && formatFileSize(file.size)}
                                </p>
                            </div>
                        </div>

                        {uploading && (
                            <div className="flex items-center space-x-3">
                                <Progress value={progress} className="h-1.5" />
                                <span className="text-xs text-muted-foreground">{progress}%</span>
                            </div>
                        )}
                    </Card>
                )}
            </form>
        </div>
    );
} 