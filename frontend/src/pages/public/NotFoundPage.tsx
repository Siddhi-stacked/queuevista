import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-2xl mb-4 border border-blue-200">
        404
      </div>
      <h1 className="text-2xl font-bold text-[#0F172A]">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button icon={<Home className="w-4 h-4" />}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};
