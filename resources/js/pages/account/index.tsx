import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import useImports from '@/hooks/use-imports';
import { AccountPageProps } from '@/types/account';
import { Order } from '@/types/order';

import AccountHeader from './components/account-header';
import AccountStats from './components/account-stats';
import AccountProfileTab from './components/account-profile-tab';
import AccountPasswordTab from './components/account-password-tab';
import AccountOrdersTab from './components/account-orders-tab';
import AccountOrderDetailsModal from './components/account-order-details-modal';

export default function AccountPage({
    user,
    orders,
    orderStats,
    categories,
}: AccountPageProps) {
    const { t } = useImports();

    // Default to 'orders' tab or read from query parameter if provided
    const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'security'>('orders');

    // Selected order for details dialog
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam === 'profile' || tabParam === 'security' || tabParam === 'orders') {
            setActiveTab(tabParam);
        }
    }, []);

    const handleTabChange = (tab: 'orders' | 'profile' | 'security') => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setDetailsModalOpen(true);
    };

    return (
        <UserLayout categories={categories}>
            <Head title={`${t('account_page.title', 'My Account')} — Shopella`} />

            <div className="bg-muted/15 min-h-[calc(100vh-200px)] py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Customer Profile Header */}
                    <AccountHeader
                        user={user}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        ordersCount={orders?.total || 0}
                    />

                    {/* Account Overview Stats */}
                    {orderStats && <AccountStats stats={orderStats} />}

                    {/* Active Tab Body */}
                    <div className="transition-all duration-200">
                        {activeTab === 'orders' && (
                            <AccountOrdersTab
                                orders={orders}
                                onViewOrder={handleViewOrder}
                            />
                        )}

                        {activeTab === 'profile' && (
                            <AccountProfileTab user={user} />
                        )}

                        {activeTab === 'security' && (
                            <AccountPasswordTab />
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Dialog */}
            <AccountOrderDetailsModal
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                order={selectedOrder}
            />
        </UserLayout>
    );
}
