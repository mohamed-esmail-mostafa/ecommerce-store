import React from 'react';
import { LayoutGrid, List, RotateCcw, Search, X } from 'lucide-react';
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
import { SupplierFilters } from '@/types/supplier';

interface SupplierFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: 'all' | 'active' | 'inactive';
    onStatusChange: (status: 'all' | 'active' | 'inactive') => void;
    viewMode: 'grid' | 'table';
    onViewModeChange: (mode: 'grid' | 'table') => void;
    onReset: () => void;
    hasActiveFilters: boolean;
}

export default function SupplierFiltersComponent({
    search,
    onSearchChange,
    status,
    onStatusChange,
    viewMode,
    onViewModeChange,
    onReset,
    hasActiveFilters,
}: SupplierFiltersProps) {
    const { t } = useImports();

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 bg-card p-3 rounded-lg border border-border/70 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('suppliers.search_placeholder', 'Search suppliers by name, phone, or address...')}
                    className="pl-9 pr-8 h-9 text-sm w-full"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Status Filter & View Mode Controls */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-36 sm:w-40">
                    <Select value={status} onValueChange={(val: any) => onStatusChange(val)}>
                        <SelectTrigger className="h-9 text-xs w-full">
                            <SelectValue placeholder={t('suppliers.status', 'Status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('suppliers.all_status', 'All Statuses')}</SelectItem>
                            <SelectItem value="active">{t('suppliers.active', 'Active Only')}</SelectItem>
                            <SelectItem value="inactive">{t('suppliers.inactive', 'Inactive Only')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-border rounded-md p-0.5 bg-muted/30">
                    <Button
                        type="button"
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onViewModeChange('grid')}
                        title={t('suppliers.grid_view', 'Grid View')}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onViewModeChange('table')}
                        title={t('suppliers.table_view', 'Table View')}
                    >
                        <List className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
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
