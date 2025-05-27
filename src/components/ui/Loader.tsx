import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  fullScreen = false,
  text
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-light-400 dark:border-dark-100 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-light-200 dark:bg-dark-400 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;