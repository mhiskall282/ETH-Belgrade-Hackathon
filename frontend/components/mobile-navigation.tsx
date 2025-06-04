'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  ArrowRightLeft, 
  MessageSquare, 
  ShieldCheck, 
  Leaf, 
  Vote, 
  Sparkles 
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function MobileNavigation() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutGrid size={20} />,
    },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: <ArrowRightLeft size={20} />,
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: <MessageSquare size={20} />,
    },
    {
      label: 'Verify',
      href: '/verify',
      icon: <ShieldCheck size={20} />,
    },
    {
      label: 'Yield',
      href: '/yield',
      icon: <Leaf size={20} />,
    },
    {
      label: 'Vote',
      href: '/vote',
      icon: <Vote size={20} />,
    },
    {
      label: 'Lite',
      href: '/lite',
      icon: <Sparkles size={20} />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-lg">
      <nav className="flex items-center justify-between rounded-full border border-border/40 bg-background/80 p-1 shadow-lg backdrop-blur-md">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center rounded-full p-2 text-xs transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.icon}
            <span className="mt-1 text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}