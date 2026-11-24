
import { usePage } from '@inertiajs/react';
import React from 'react';
import DashboardHeader from './dashboard/dashboard-header';
import DashboardSidebar from '@/layouts/dashboard/dashboard-desktop-sidebar';
import DashboardNavigationBottom from './dashboard/dashboard-navigation-bottom';



export default function DashboardLayout({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const { url } = usePage();

    const isCurrent = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

    return (
        <div className="flex min-h-screen lg:h-screen lg:overflow-hidden w-full bg-background text-foreground">
            {/* Desktop Sidebar */}
            <DashboardSidebar isCurrent={isCurrent} />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
                {/* Admin Header */}
                <DashboardHeader url={url} />

                {/* Page Content */}
                <main className={`flex-1 p-2 md:p-2 pb-20 lg:pb-6 container w-full mx-auto ${className}`}>
                    {children}
                </main>
            </div>

            <DashboardNavigationBottom />
        </div>
    );
}
