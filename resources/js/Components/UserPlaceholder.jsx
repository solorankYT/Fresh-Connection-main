import { UserIcon } from '@heroicons/react/24/outline';

export default function UserPlaceholder({ 
    className = '',
    size = 'md',
    bgColor = 'bg-gray-100',
    iconColor = 'text-gray-500',
    border = 'border border-gray-300',
    rounded = 'rounded-full'
}) {
    // Define size classes
    const sizeClasses = {
        xs: 'w-8 h-8',
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
        xl: 'w-24 h-24'
    };

    // Define icon size classes
    const iconSizeClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-12 h-12'
    };

    return (
        <div className={`${sizeClasses[size]} ${bgColor} ${border} ${rounded} flex items-center justify-center flex-shrink-0 ${className}`}>
            <UserIcon className={`${iconSizeClasses[size]} ${iconColor}`} />
        </div>
    );
}