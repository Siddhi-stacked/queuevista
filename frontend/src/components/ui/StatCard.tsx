import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-[#0F172A] mt-1.5">{value}</h4>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-[#F8FAFC] flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-[#64748B]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
