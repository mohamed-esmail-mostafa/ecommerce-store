import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import { Pagination } from '@/types/pagination';
import { Product } from '@/types/product';

interface ProductPaginationProps {
    products: Pagination<Product>;
}

export default function ProductPagination({ products }: ProductPaginationProps) {
    const { t } = useImports();

    if (!products.data || products.data.length === 0) {
        return null;
    }

    const changePage = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="flex items-center justify-center gap-3 mt-8">
            <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={!products.prev_page_url}
                onClick={() => changePage(products.prev_page_url)}
            >
                <ChevronLeft className="w-4 h-4" />
                {t('common.previous', 'Previous')}
            </Button>
            <span className="text-xs text-muted-foreground">
                Page {products.current_page} of {products.last_page}
            </span>
            <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={!products.next_page_url}
                onClick={() => changePage(products.next_page_url)}
            >
                {t('common.next', 'Next')}
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
