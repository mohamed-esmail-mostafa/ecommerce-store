import React from 'react';
import { Package, Search, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import useImports from '@/hooks/use-imports';

interface ProductToolbarProps {
    totalProducts: number;
    pageProductsCount: number;
    selectedCount: number;
    allSelected: boolean;
    onToggleSelectAll: () => void;
    onBulkDelete: () => void;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    onSearchSubmit: (e?: React.FormEvent) => void;
    onClearSearch: () => void;
}

export default function ProductToolbar({
    totalProducts,
    pageProductsCount,
    selectedCount,
    allSelected,
    onToggleSelectAll,
    onBulkDelete,
    searchQuery,
    onSearchQueryChange,
    onSearchSubmit,
    onClearSearch,
}: ProductToolbarProps) {
    const { t } = useImports();

    return (
        <div className="container mx-auto px-4 mb-6 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70 shadow-xs">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-xs px-3 py-1.5 gap-1.5">
                        <Package className="w-4 h-4 text-primary" />
                        {t('products.total_products', 'Total Products')}: {totalProducts}
                    </Badge>

                    {pageProductsCount > 0 && (
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onToggleSelectAll}
                                aria-label={t('products.select_all', 'Select all on page')}
                            />
                            <span>{t('products.select_all', 'Select All')}</span>
                        </label>
                    )}

                    {selectedCount > 0 && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onBulkDelete}
                            className="h-8 px-3 text-xs gap-1.5 shadow-xs"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>
                                {t('products.delete_selected', 'Delete Selected')} ({selectedCount})
                            </span>
                        </Button>
                    )}
                </div>

                {/* Backend Search Form */}
                <form onSubmit={onSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t('products.search_placeholder', 'Search products on server...')}
                            value={searchQuery}
                            onChange={(e) => onSearchQueryChange(e.target.value)}
                            className="ps-9 pe-8 h-9 text-xs rounded-lg w-full"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" size="sm" className="h-9 text-xs px-3 shrink-0">
                        {t('common.search', 'Search')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
