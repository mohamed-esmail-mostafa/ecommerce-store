import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import useImports from '@/hooks/use-imports';
import { Role } from '@/types/role';
import { User } from '@/types/user';

interface ChangeRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    roles: Role[];
}

export default function ChangeRoleModal({
    open,
    onOpenChange,
    user,
    roles,
}: ChangeRoleModalProps) {
    const { t } = useImports();
    const [selectedRole, setSelectedRole] = useState<string>(
        user?.role_id ? String(user.role_id) : 'none'
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync selectedRole when user changes
    React.useEffect(() => {
        setSelectedRole(user?.role_id ? String(user.role_id) : 'none');
    }, [user]);

    if (!user) return null;

    const handleSaveRole = () => {
        setIsSubmitting(true);
        const roleId = selectedRole === 'none' ? null : Number(selectedRole);

        router.post(
            `/users/change-role/${user.id}`,
            { role_id: roleId },
            {
                onSuccess: () => {
                    toast.success(t('users.role_updated', 'User role updated successfully'));
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error(t('common.error', 'Failed to update user role'));
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {t('users.change_role', 'Change User Role')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('users.update_role_for', 'Update role permissions for')}{' '}
                        <strong className="text-foreground">{user.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* User Summary Box */}
                    <div className="p-3 bg-muted/40 rounded-lg border border-border/60 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{t('users.email', 'Email')}</p>
                            <p className="text-sm font-medium text-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">{t('users.current_role', 'Current Role')}</p>
                            {user.role ? (
                                <Badge variant="secondary" className="text-xs">
                                    {user.role.name}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/40">
                                    {t('users.no_role', 'No Role')}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* New Role Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="change_role_select" className="text-xs font-semibold">
                            {t('users.select_role', 'Select New Role')}
                        </Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="change_role_select" className="w-full">
                                <SelectValue placeholder={t('users.select_role', 'Select role')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    <span className="text-amber-600 font-medium">
                                        {t('users.no_role', 'No Role Assigned (Standard Access)')}
                                    </span>
                                </SelectItem>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={String(r.id)}>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>{r.name}</span>
                                            {r.users_count !== undefined && (
                                                <span className="text-[11px] text-muted-foreground">
                                                    ({r.users_count} users)
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleSaveRole} disabled={isSubmitting} className="min-w-24">
                        {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Update Role')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
