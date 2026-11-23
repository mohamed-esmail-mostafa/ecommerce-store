import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, UserCheck, UserX, Users } from 'lucide-react';
import useImports from '@/hooks/use-imports';
import { Role } from '@/types/role';
import { Pagination } from '@/types/pagination';
import { User } from '@/types/user';

interface UserStatsProps {
    users: Pagination<User>;
    roles: Role[];
}

export default function UserStats({ users, roles }: UserStatsProps) {
    const { t } = useImports();

    // Stats calculated from current page data and overall meta
    const totalUsers = users.total ?? users.data.length;
    const usersWithRoleCount = users.data.filter((u) => u.role_id !== null).length;
    const usersWithoutRoleCount = users.data.filter((u) => u.role_id === null).length;

    const stats = [
        {
            title: t('users.total_users', 'Total Users'),
            value: totalUsers.toLocaleString(),
            icon: Users,
            bgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
            description: `${users.per_page} ${t('common.per_page', 'per page')}`,
        },
        {
            title: t('users.with_roles', 'With Assigned Roles'),
            value: `${usersWithRoleCount}`,
            subtitle: `${t('common.on_page', 'on page')}`,
            icon: UserCheck,
            bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
            description: `${Math.round((usersWithRoleCount / (users.data.length || 1)) * 100)}% of current page`,
        },
        {
            title: t('users.without_roles', 'Unassigned Users'),
            value: `${usersWithoutRoleCount}`,
            subtitle: `${t('common.on_page', 'on page')}`,
            icon: UserX,
            bgClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
            description: `${Math.round((usersWithoutRoleCount / (users.data.length || 1)) * 100)}% of current page`,
        },
        {
            title: t('roles.total_roles', 'Defined Roles'),
            value: `${roles.length}`,
            icon: ShieldCheck,
            bgClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
            description: `${t('roles.page_title', 'Roles')}`,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={idx} className="p-4 border border-border/60 shadow-xs hover:border-primary/30 transition-colors">
                        <CardContent className="p-0 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                                    {stat.subtitle && (
                                        <span className="text-[11px] text-muted-foreground font-normal">
                                            {stat.subtitle}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-muted-foreground">{stat.description}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgClass}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
