import React from 'react';
import { TrendingUp } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`text-primary-500 ${className}`}>
      <TrendingUp size={32} strokeWidth={2} />
    </div>
  );
};

export default Logo;