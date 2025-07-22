import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export default function Card({
    children,
    className = '',
    hover = true,
    gradient = false,
    padding = 'md',
    onClick
}: CardProps) {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={`
        ${gradient ? 'gradient-card' : 'glass'}
        rounded-lg 
        ${hover ? 'hover:shadow-md' : ''} 
        transition-all duration-200
        ${paddingClasses[padding]}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
} 