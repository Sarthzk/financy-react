import { Wallet } from 'lucide-react';

export default function Logo({ size = 'medium', showText = true, onClick = null }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
    xl: 32
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-2xl'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      aria-label="Financy Logo"
    >
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Wallet size={iconSizes[size]} className="text-white" />
      </div>
      {showText && (
        <span className={`font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap ${textSizes[size]}`}>
          Financy
        </span>
      )}
    </button>
  );
}
