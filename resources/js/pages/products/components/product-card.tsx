import React from 'react';
import { Link } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import NoImage from '@/components/no-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import useImports from '@/hooks/use-imports';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
    currency: string;
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
    onDelete: (product: Product) => void;
}

export default function ProductCard({
    product,
    currency,
    isSelected,
    onToggleSelect,
    onDelete,
}: ProductCardProps) {
    const { t } = useImports();

    const firstImage =
        typeof product.images?.[0] === 'object' && product.images[0]
            ? product.images[0].image
            : typeof product.images?.[0] === 'string'
              ? product.images[0]
              : null;

    return (
        <Card
            className={`overflow-hidden border transition-all duration-200 flex flex-col justify-between group p-0 gap-0 ${
                isSelected
                    ? 'border-primary ring-2 ring-primary/30 shadow-md'
                    : 'border-border/70 hover:shadow-md'
            }`}
        >
            <div>
                {/* Product Image Header */}
                <CardHeader className="p-0 relative aspect-square bg-muted/30 overflow-hidden">
                    {firstImage ? (
                        <img
                            src={firstImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <NoImage />
                    )}

                    {/* Selection Checkbox Overlay */}
                    <div className="absolute top-2.5 start-2.5 z-10">
                        <div className="bg-background/90 backdrop-blur-sm rounded-md p-1 shadow-xs border border-border/60 flex items-center justify-center">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => onToggleSelect(product.id)}
                                aria-label={`Select ${product.title}`}
                            />
                        </div>
                    </div>

                    {/* Badges Overlay */}
                    <div className="absolute top-2.5 end-2.5 flex flex-col items-end gap-1 pointer-events-none">
                        {product.category && (
                            <Badge
                                variant="secondary"
                                className="bg-black/60 text-white border-white/20 text-[10px] backdrop-blur-md px-1.5 py-0.5"
                            >
                                {product.category.name_ar || product.category.name_en}
                            </Badge>
                        )}
                        {product.brand && (
                            <Badge
                                variant="outline"
                                className="bg-white/85 dark:bg-black/80 text-[10px] px-1.5 py-0.5"
                            >
                                {product.brand}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                {/* Product Content */}
                <CardContent className="p-3.5 space-y-2">
                    <h3
                        className="font-bold text-sm line-clamp-2 text-foreground"
                        title={product.title}
                    >
                        {product.title}
                    </h3>

                    {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.description}
                        </p>
                    )}

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="font-bold text-sm">
                            {product.sale_price ? (
                                <div className="flex items-center gap-1.5">
                                    <span className="line-through text-xs text-muted-foreground font-normal">
                                        {currency}
                                        {product.price}
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                        {currency}
                                        {product.sale_price}
                                    </span>
                                </div>
                            ) : (
                                <span>
                                    {currency}
                                    {product.price}
                                </span>
                            )}
                        </div>

                        <Badge
                            variant={product.stock > 0 ? 'default' : 'destructive'}
                            className={`text-[10px] px-1.5 py-0 ${
                                product.stock > 0 ? 'bg-emerald-600 text-white' : ''
                            }`}
                        >
                            {product.stock > 0
                                ? `${product.stock} in stock`
                                : t('common.stockout', 'Out Of Stock')}
                        </Badge>
                    </div>
                </CardContent>
            </div>

            {/* Action Buttons */}
            <CardFooter className="p-3 pt-2 flex items-center justify-end gap-1.5 border-t border-border/40 bg-muted/10">
                <Link href={`/products/update/${product.slug || product.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                        <Edit2 className="w-3.5 h-3.5" />
                        {t('common.edit', 'Edit')}
                    </Button>
                </Link>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product)}
                    className="h-8 px-2.5 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('common.delete', 'Delete')}
                </Button>
            </CardFooter>
        </Card>
    );
}
