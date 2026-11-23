import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Filter, RotateCcw, Search, Shield, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useImports from '@/hooks/use-imports';
import { Role } from '@/types/role';
import { UserFilters } from '@/types/user';

interface UserFiltersProps {
    filters?: UserFilters;
    roles: Role[];
}

export default function UserFiltersComponent({ filters, roles }: UserFiltersProps) {
    const { t } = useImports();
    const [search, setSearch] = useState<string>(filters?.search || '');
    const currentRoleId = filters?.role_id !== undefined && filters?.role_id !== null ? String(filters.role_id) : 'all';

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        applyFilters(search, currentRoleId === 'all' ? undefined : currentRoleId);
    };

    const handleRoleChange = (roleValue: string) => {
        applyFilters(search, roleValue === 'all' ? undefined : roleValue);
    };

    const applyFilters = (searchVal: string, roleVal?: string) => {
        const query: Record<string, string | number> = {};
        if (searchVal.trim()) query.search = searchVal.trim();
        if (roleVal !== undefined && roleVal !== 'all') {
            query.role_id = roleVal === 'none' ? 0 : Number(roleVal);
        }

        router.get('/users/page', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/users/page', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(search.trim() || (filters?.role_id !== undefined && filters?.role_id !== null));

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-card p-3 rounded-lg border border-border/70 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('users.search_placeholder', 'Search by name, email, or phone...')}
                        className="pl-9 pr-8 h-9 text-sm w-full"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                applyFilters('', currentRoleId === 'all' ? undefined : currentRoleId);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <Button type="submit" size="sm" variant="secondary" className="h-9 px-3 gap-1.5 shrink-0">
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('common.search', 'Search')}</span>
                </Button>
            </form>

            <div className="flex items-center gap-2 shrink-0">
                <div className="w-full sm:w-48">
                    <Select value={currentRoleId} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-9 text-xs w-full">
                            <div className="flex items-center gap-1.5 truncate">
                                <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <SelectValue placeholder={t('users.filter_role', 'Filter by Role')} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('users.filter_role', 'All Roles')}</SelectItem>
                            <SelectItem value="none">
                                <span className="text-amber-600 dark:text-amber-400">
                                    {t('users.no_role', 'No Role Assigned')}
                                </span>
                            </SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={String(r.id)}>
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                        title={t('common.reset', 'Reset filters')}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('common.reset', 'Reset')}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
