import React from 'react';

export type BadgeVariant =
  | 'WAITING'
  | 'SERVING'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'CANCELLED'
  | 'ACTIVE'
  | 'IDLE'
  | 'CLOSED'
  | 'NORMAL'
  | 'HIGH'
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export interface BadgeProps {
  variant: BadgeVariant | string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const getStyle = (v: string): string => {
    switch (v.toUpperCase()) {
      case 'SERVING':
      case 'ACTIVE':
      case 'CHECKED_IN':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WAITING':
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'CLOSED':
      case 'DANGER':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SKIPPED':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200 font-semibold';
      case 'SCHEDULED':
      case 'INFO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
      case 'IDLE':
      case 'NORMAL':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle(
        variant
      )} ${className}`}
    >
      {children}
    </span>
  );
};
