'use client'

import { useState } from 'react';
import { Dashboard } from '@/components/dashboard';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';



export default function DashboardPage() {
  const [isLiteMode, setIsLiteMode] = useState(false);
  const router = useRouter();

  const handleGoToLiteMode = () => {
    setIsLiteMode(true);
    router.push('/lite');
  };

  return (
    <div className="container mx-auto max-w-lg p-4 pb-20">
      <div className="mb-6 flex items-center justify-between pt-4">
        <h1 className="text-xl font-bold"></h1>
        <ThemeToggle />
      </div>
      
      <Dashboard onGoToLiteMode={handleGoToLiteMode} />
    </div>
  );
}