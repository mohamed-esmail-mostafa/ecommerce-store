import React from 'react';
import {
    Building2,
    Edit2,
    Eye,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Phone,
    Plus,
    Power,
    Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NoDataFound from '@/components/no-data-found';
import useImports from '@/hooks/use-imports';
import { Supplier } from '@/types/supplier';

interface SuppliersTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onView: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
    onToggleStatus: (supplier: Supplier) => void;
    onAddSupplier: () => void;
}

export default function SuppliersTable({
    suppliers,
    onEdit,
    onView,
    onDelete,
    onToggleStatus,
    onAddSupplier,
}: SuppliersTableProps) {
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
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right border-collapse">
                    <thead>
                        <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                            <th scope="col" className="px-5 py-3.5">
                                {t('suppliers.name', 'Supplier')}
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                {t('suppliers.phone', 'Phone')}
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                {t('suppliers.whatsup', 'WhatsApp')}
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                {t('suppliers.address', 'Address')}
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                {t('suppliers.status', 'Status')}
                            </th>
                            <th scope="col" className="px-4 py-3.5 text-right rtl:text-left">
                                {t('common.actions', 'Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {suppliers.map((supplier) => {
                            const isActive = supplier.is_active !== false;
                            return (
                                <tr
                                    key={supplier.id}
                                    className="hover:bg-muted/30 transition-colors group"
                                >
                                    {/* Supplier Identity */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 ring-1 ring-border shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                    {getInitials(supplier.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <span className="font-semibold text-foreground truncate block max-w-[200px]">
                                                    {supplier.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                                                    {supplier.slug}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Phone with click-to-call */}
                                    <td className="px-4 py-3.5">
                                        {supplier.phone ? (
                                            <a
                                                href={`tel:${supplier.phone}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                                                dir="ltr"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>{supplier.phone}</span>
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground/50 text-xs italic">—</span>
                                        )}
                                    </td>

                                    {/* WhatsApp Direct Action */}
                                    <td className="px-4 py-3.5">
                                        {supplier.whatsup ? (
                                            <a
                                                href={`https://wa.me/${cleanPhoneForWa(supplier.whatsup)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
                                                dir="ltr"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span>{supplier.whatsup}</span>
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground/50 text-xs italic">—</span>
                                        )}
                                    </td>

                                    {/* Address */}
                                    <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[200px]">
                                        {supplier.address ? (
                                            <div className="flex items-center gap-1.5 truncate" title={supplier.address}>
                                                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                <span className="truncate">{supplier.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/50 italic">—</span>
                                        )}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-4 py-3.5">
                                        <Badge
                                            variant={isActive ? 'default' : 'outline'}
                                            onClick={() => onToggleStatus(supplier)}
                                            className={`text-[11px] font-medium cursor-pointer transition-all ${
                                                isActive
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                                                    : 'text-amber-600 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/30'
                                            }`}
                                            title={t('suppliers.status_updated', 'Click to toggle status')}
                                        >
                                            {isActive
                                                ? t('suppliers.active', 'Active')
                                                : t('suppliers.inactive', 'Inactive')}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5 text-right rtl:text-left">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                                    {t('common.actions', 'Actions')}
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onView(supplier)} className="gap-2 text-xs">
                                                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {t('suppliers.view_details', 'View Details')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(supplier)} className="gap-2 text-xs">
                                                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {t('common.edit', 'Edit Supplier')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggleStatus(supplier)} className="gap-2 text-xs">
                                                    <Power className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {isActive ? t('suppliers.inactive', 'Deactivate') : t('suppliers.active', 'Activate')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(supplier)}
                                                    className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    {t('suppliers.delete_supplier', 'Delete Supplier')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
