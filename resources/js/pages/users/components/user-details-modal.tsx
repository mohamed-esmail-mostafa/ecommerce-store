import React from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    Mail,
    MapPin,
    Phone,
    Shield,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { User } from '@/types/user';

interface UserDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onEdit?: (user: User) => void;
}

export default function UserDetailsModal({
    open,
    onOpenChange,
    user,
    onEdit,
}: UserDetailsModalProps) {
    const { t } = useImports();

    if (!user) return null;

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('users.view_details', 'User Details')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* User Header Profile Card */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20 shrink-0">
                            {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="font-bold text-lg text-foreground truncate">{user.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <div className="flex items-center gap-2 pt-0.5">
                                {user.role ? (
                                    <Badge variant="secondary" className="text-[11px] gap-1">
                                        <Shield className="w-3 h-3 text-primary" />
                                        {user.role.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-500/40">
                                        {t('users.no_role', 'No Role')}
                                    </Badge>
                                )}

                                {user.email_verified_at ? (
                                    <Badge variant="outline" className="text-[10px] gap-1 text-emerald-600 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t('users.verified', 'Verified')}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground border-border">
                                        <XCircle className="w-3 h-3" />
                                        {t('users.unverified', 'Unverified')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact & System Details */}
                    <div className="space-y-3 divide-y divide-border/50 text-xs">
                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" />
                                {t('users.email', 'Email Address')}
                            </span>
                            <span className="font-medium text-foreground" dir="ltr">{user.email}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" />
                                {t('users.phone', 'Phone')}
                            </span>
                            <span className="font-medium text-foreground" dir="ltr">{user.phone || '—'}</span>
                        </div>

                        <div className="flex items-start justify-between py-1.5 gap-4">
                            <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                                <MapPin className="w-3.5 h-3.5" />
                                {t('users.address', 'Address')}
                            </span>
                            <span className="font-medium text-foreground text-right">{user.address || '—'}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {t('users.created_at', 'Registered On')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(user.created_at)}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                {t('common.updated_at', 'Last Updated')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(user.updated_at)}</span>
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
                                onEdit(user);
                            }}
                            className="gap-1.5"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            {t('users.edit_user', 'Edit User')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
