import React from 'react';
import {
    Building2,
    Edit2,
    Eye,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import NoDataFound from '@/components/no-data-found';
import useImports from '@/hooks/use-imports';
import { Supplier } from '@/types/supplier';

interface SuppliersGridProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onView: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
    onToggleStatus: (supplier: Supplier) => void;
    onAddSupplier: () => void;
}

export default function SuppliersGrid({
    suppliers,
    onEdit,
    onView,
    onDelete,
    onToggleStatus,
    onAddSupplier,
}: SuppliersGridProps) {
    const { t } = useImports();

    const getInitials = (name: string) => {
        if (!name) return 'SP';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const cleanPhoneForWa = (num: string) => num.replace(/[^0-9]/g, '');

    if (!suppliers || suppliers.length === 0) {
        return (
            <div className="py-12 bg-card border border-border/70 rounded-xl shadow-xs">
                <NoDataFound>
                    <div className="mt-4">
                        <Button onClick={onAddSupplier} className="gap-2">
                            <Plus className="w-4 h-4" />
                            {t('suppliers.add_supplier', 'Add Supplier')}
                        </Button>
                    </div>
                </NoDataFound>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {suppliers.map((supplier) => {
                const isActive = supplier.is_active !== false;
                return (
                    <Card
                        key={supplier.id}
                        className="overflow-hidden border border-border/70 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group p-0 gap-0 bg-card"
                    >
                        <div>
                            {/* Card Header with Avatar, Name, Status Badge */}
                            <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between gap-2 border-b border-border/40 bg-muted/20">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="h-10 w-10 ring-1 ring-border shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                            {getInitials(supplier.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <h3
                                            className="font-bold text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                                            onClick={() => onView(supplier)}
                                            title={supplier.name}
                                        >
                                            {supplier.name}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground truncate">{supplier.slug}</p>
                                    </div>
                                </div>

                                <Badge
                                    variant={isActive ? 'default' : 'outline'}
                                    onClick={() => onToggleStatus(supplier)}
                                    className={`text-[10px] px-2 py-0.5 cursor-pointer shrink-0 transition-all ${
                                        isActive
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'text-amber-600 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20'
                                    }`}
                                    title="Click to toggle status"
                                >
                                    {isActive ? t('suppliers.active', 'Active') : t('suppliers.inactive', 'Inactive')}
                                </Badge>
                            </CardHeader>

                            {/* Contact Details Body */}
                            <CardContent className="p-4 space-y-2.5 text-xs">
                                {/* Phone Button / Link */}
                                {supplier.phone ? (
                                    <a
                                        href={`tel:${supplier.phone}`}
                                        className="flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 -mx-1.5"
                                    >
                                        <div className="p-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                            <Phone className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium truncate" dir="ltr">
                                            {supplier.phone}
                                        </span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground/50 italic p-1.5 -mx-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{t('common.no_phone', 'No phone listed')}</span>
                                    </div>
                                )}

                                {/* WhatsApp Link */}
                                {supplier.whatsup ? (
                                    <a
                                        href={`https://wa.me/${cleanPhoneForWa(supplier.whatsup)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-foreground/90 hover:text-emerald-600 transition-colors p-1.5 rounded-md hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 -mx-1.5"
                                    >
                                        <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium truncate text-emerald-700 dark:text-emerald-400" dir="ltr">
                                            {supplier.whatsup}
                                        </span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground/50 italic p-1.5 -mx-1.5">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>{t('common.no_whatsapp', 'No WhatsApp listed')}</span>
                                    </div>
                                )}

                                {/* Address */}
                                {supplier.address ? (
                                    <div
                                        className="flex items-start gap-2 text-muted-foreground p-1.5 -mx-1.5"
                                        title={supplier.address}
                                    >
                                        <div className="p-1 rounded-md bg-muted text-muted-foreground shrink-0 mt-0.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="line-clamp-2 leading-relaxed">{supplier.address}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground/50 italic p-1.5 -mx-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{t('common.no_address', 'No address listed')}</span>
                                    </div>
                                )}
                            </CardContent>
                        </div>

                        {/* Card Footer Actions */}
                        <CardFooter className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 text-xs gap-1.5"
                                onClick={() => onView(supplier)}
                            >
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{t('suppliers.view_details', 'View')}</span>
                            </Button>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 text-xs gap-1"
                                    onClick={() => onEdit(supplier)}
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>{t('common.edit', 'Edit')}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                    onClick={() => onDelete(supplier)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
