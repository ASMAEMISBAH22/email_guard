import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Logo = ({ size = 'large', showText = true }) => {
  const { isDarkMode } = useTheme();
  
  const sizes = {
    small: { container: 'h-8', icon: 'w-8 h-8', text: 'text-lg' },
    medium: { container: 'h-10', icon: 'w-10 h-10', text: 'text-xl' },
    large: { container: 'h-12', icon: 'w-12 h-12', text: 'text-2xl' }
  };

  const currentSize = sizes[size] || sizes.large;

  return (
    <div className={`flex items-center space-x-3 ${currentSize.container}`}>
      {/* Logo Icon */}
      <div className="relative">
        <svg 
          className={`${currentSize.icon} drop-shadow-lg`}
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: isDarkMode ? '#60a5fa' : '#3b82f6', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: isDarkMode ? '#3b82f6' : '#1d4ed8', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: isDarkMode ? '#1d4ed8' : '#1e3a8a', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 1}} />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
          </defs>
          
          {/* Shield background */}
          <path 
            d="M32 58s14-6 14-18V16L32 8 18 16v24c0 12 14 18 14 18z" 
            fill="url(#shieldGradient)" 
            filter="url(#shadow)"
            stroke={isDarkMode ? '#1e3a8a' : '#1e3a8a'} 
            strokeWidth="1"
          />
          
          {/* Email icon */}
          <rect 
            x="20" y="24" width="24" height="16" rx="2" 
            fill={isDarkMode ? '#f9fafb' : '#ffffff'} 
            fillOpacity="0.95" 
            stroke="#e5e7eb" 
            strokeWidth="1"
          />
          
          {/* Email fold lines */}
          <path 
            d="M20 26 L32 32 L44 26" 
            stroke="#6b7280" 
            strokeWidth="1.5" 
            fill="none"
          />
          
          {/* Check mark */}
          <path 
            d="M25 34 L29 38 L39 28" 
            stroke="url(#checkGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
          
          {/* AI spark elements */}
          <circle cx="48" cy="20" r="2" fill="#fbbf24" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="16" cy="48" r="1.5" fill="#f59e0b" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="52" cy="44" r="1" fill="#fbbf24" opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${currentSize.text} font-bold leading-none ${
            isDarkMode ? 'text-white' : 'text-white'
          }`}>
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Smart Email Guardian
            </span>
          </h1>
          <p className={`text-xs font-medium leading-none mt-1 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-100'
          }`}>
            AI-Powered Security
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo; 