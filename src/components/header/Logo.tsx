
import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/dashboard" className="flex items-center space-x-3">
      <div className="relative">
        <Recycle className="h-8 w-8 text-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
      </div>
      <div>
        <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Surplus360
        </span>
        <div className="text-xs text-muted-foreground">
          Plateforme B2B
        </div>
      </div>
    </Link>
  );
};

export default Logo;
