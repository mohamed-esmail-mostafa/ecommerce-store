import React from 'react';
import {
    Building2,
    Calendar,
    Clock,
    Edit2,
    ExternalLink,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useImports from '@/hooks/use-imports';
import { Supplier } from '@/types/supplier';

interface SupplierDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier?: Supplier | null;
    onEdit?: (supplier: Supplier) => void;
}

export default function SupplierDetailsModal({
    open,
    onOpenChange,
    supplier,
    onEdit,
}: SupplierDetailsModalProps) {
    const { t } = useImports();

    if (!supplier) return null;

    const getInitials = (name: string) => {
        if (!name) return 'SP';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const cleanPhoneForWa = (num: string) => num.replace(/[^0-9]/g, '');

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '—';
        try {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const isActive = supplier.is_active !== false;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('suppliers.view_details', 'Supplier Details')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Header Card */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {getInitials(supplier.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="font-bold text-lg text-foreground truncate">{supplier.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{supplier.slug}</p>
                            <div className="pt-0.5">
                                <Badge
                                    variant={isActive ? 'default' : 'outline'}
                                    className={`text-[11px] ${
                                        isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-amber-600 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20'
                                    }`}
                                >
                                    {isActive ? t('suppliers.active', 'Active') : t('suppliers.inactive', 'Inactive')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        {supplier.phone ? (
                            <a
                                href={`tel:${supplier.phone}`}
                                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                            >
                                <Phone className="w-4 h-4 text-blue-600" />
                                <span>{t('suppliers.call_now', 'Call')}</span>
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30 text-xs text-muted-foreground/50 cursor-not-allowed">
                                <Phone className="w-4 h-4" />
                                <span>{t('suppliers.call_now', 'Call')}</span>
                            </div>
                        )}

                        {supplier.whatsup ? (
                            <a
                                href={`https://wa.me/${cleanPhoneForWa(supplier.whatsup)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-600" />
                                <span>{t('suppliers.whatsapp_chat', 'WhatsApp')}</span>
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30 text-xs text-muted-foreground/50 cursor-not-allowed">
                                <MessageCircle className="w-4 h-4" />
                                <span>{t('suppliers.whatsapp_chat', 'WhatsApp')}</span>
                            </div>
                        )}
                    </div>

                    {/* Contact & Meta Details */}
                    <div className="space-y-3 divide-y divide-border/50 text-xs">
                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" />
                                {t('suppliers.phone', 'Phone Number')}
                            </span>
                            <span className="font-medium text-foreground" dir="ltr">{supplier.phone || '—'}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {t('suppliers.whatsup', 'WhatsApp')}
                            </span>
                            <span className="font-medium text-foreground" dir="ltr">{supplier.whatsup || '—'}</span>
                        </div>

                        <div className="flex items-start justify-between py-1.5 gap-4">
                            <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                                <MapPin className="w-3.5 h-3.5" />
                                {t('suppliers.address', 'Address')}
                            </span>
                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="font-medium text-foreground">{supplier.address || '—'}</span>
                                {supplier.address && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(supplier.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                                    >
                                        <span>Google Maps</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {t('common.created_at', 'Registered On')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(supplier.created_at)}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                {t('common.updated_at', 'Last Updated')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(supplier.updated_at)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        {t('common.close', 'Close')}
                    </Button>
                    {onEdit && (
                        <Button
                            onClick={() => {
                                onOpenChange(false);
                                onEdit(supplier);
                            }}
                            className="gap-1.5"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            {t('common.edit', 'Edit Supplier')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
