
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompanyStats } from '@/types';

const QuickStats = () => {
  const { currentCompany } = useAuth();

  if (!currentCompany) return null;

  const stats = getCompanyStats(currentCompany.stats);

  return (
    <div className="hidden md:flex items-center gap-6 text-sm">
      <div className="text-center">
        <div className="font-semibold text-primary">{stats.totalSurplus}</div>
        <div className="text-xs text-muted-foreground">Surplus</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-green-600">{stats.co2Saved}kg</div>
        <div className="text-xs text-muted-foreground">CO₂ économisé</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-blue-600">{currentCompany.rseScore || 0}/100</div>
        <div className="text-xs text-muted-foreground">Score RSE</div>
      </div>
    </div>
  );
};

export default QuickStats;
