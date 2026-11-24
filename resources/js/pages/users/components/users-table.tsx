import React from 'react';
import {
    Edit2,
    Eye,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Plus,
    Shield,
    Trash2,
    UserCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { User } from '@/types/user';

interface UsersTableProps {
    users: User[];
    currentUserId?: number;
    onEdit: (user: User) => void;
    onChangeRole: (user: User) => void;
    onView: (user: User) => void;
    onDelete: (user: User) => void;
    onAddUser: () => void;
}

export default function UsersTable({
    users,
    currentUserId,
    onEdit,
    onChangeRole,
    onView,
    onDelete,
    onAddUser,
}: UsersTableProps) {
    const { t } = useImports();

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getRoleBadge = (roleName?: string | null) => {
        if (!roleName) {
            return (
                <Badge
                    variant="outline"
                    className="border-dashed border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-[11px] gap-1 cursor-pointer hover:bg-amber-100/50 transition-colors"
                >
                    <Shield className="w-3 h-3" />
                    {t('users.no_role', 'No Role')}
                </Badge>
            );
        }

        const lower = roleName.toLowerCase();
        let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
        if (lower.includes('admin') || lower.includes('super')) {
            colorClasses = 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
        } else if (lower.includes('manager')) {
            colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        } else if (lower.includes('editor') || lower.includes('staff')) {
            colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        }

        return (
            <Badge
                variant="outline"
                className={`${colorClasses} font-medium text-[11px] gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
            >
                <Shield className="w-3 h-3" />
                {roleName}
            </Badge>
        );
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    if (!users || users.length === 0) {
        return (
            <div className="py-12 bg-card border border-border/70 rounded-xl shadow-xs">
                <NoDataFound>
                    <div className="mt-4">
                        <Button onClick={onAddUser} className="gap-2">
                            <Plus className="w-4 h-4" />
                            {t('users.add_user', 'Add User')}
                        </Button>
                    </div>
                </NoDataFound>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop & Tablet Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right border-collapse">
                        <thead>
                            <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                <th scope="col" className="px-5 py-3.5">
                                    {t('users.name', 'User')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('users.role', 'Role')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('users.phone', 'Contact / Address')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('users.created_at', 'Joined')}
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-right rtl:text-left">
                                    {t('users.actions', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {users.map((user) => {
                                const isSelf = currentUserId === user.id;
                                return (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        {/* User Identity */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 ring-1 ring-border shrink-0">
                                                    {user.avatar ? (
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-foreground truncate block max-w-[200px]">
                                                            {user.name}
                                                        </span>
                                                        {isSelf && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                                                            >
                                                                {t('users.current_user_badge', 'You')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[220px]">
                                                        <Mail className="w-3 h-3 shrink-0" />
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role with click-to-change shortcut */}
                                        <td className="px-4 py-3.5">
                                            <div
                                                onClick={() => onChangeRole(user)}
                                                title={t('users.change_role', 'Click to change role')}
                                                className="inline-block"
                                            >
                                                {getRoleBadge(user.role?.name)}
                                            </div>
                                        </td>

                                        {/* Phone & Address */}
                                        <td className="px-4 py-3.5">
                                            <div className="space-y-0.5 text-xs">
                                                {user.phone ? (
                                                    <div className="flex items-center gap-1 text-foreground/90 font-medium">
                                                        <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                                                        <span dir="ltr">{user.phone}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/60 italic">—</span>
                                                )}
                                                {user.address && (
                                                    <div className="flex items-center gap-1 text-muted-foreground line-clamp-1 max-w-[220px]" title={user.address}>
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">{user.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(user.created_at)}
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
                                                        {t('users.actions', 'Actions')}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => onView(user)} className="gap-2 text-xs">
                                                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {t('users.view_details', 'View Details')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEdit(user)} className="gap-2 text-xs">
                                                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {t('users.edit_user', 'Edit User')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onChangeRole(user)} className="gap-2 text-xs">
                                                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {t('users.change_role', 'Change Role')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={isSelf}
                                                        onClick={() => onDelete(user)}
                                                        className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {t('users.delete_user', 'Delete User')}
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

            {/* Mobile Card List View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {users.map((user) => {
                    const isSelf = currentUserId === user.id;
                    return (
                        <Card key={user.id} className="p-4 border border-border/70 shadow-xs">
                            <CardContent className="p-0 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 ring-1 ring-border shrink-0">
                                            {user.avatar ? (
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                            ) : null}
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-semibold text-sm text-foreground">{user.name}</h4>
                                                {isSelf && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                                                    >
                                                        {t('users.current_user_badge', 'You')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>

                                            <div onClick={() => onChangeRole(user)}>
                                                {getRoleBadge(user.role?.name)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div onClick={() => onChangeRole(user)}>
                                        {getRoleBadge(user.role?.name)}
                                    </div> */}
                                </div>

                                {(user.phone || user.address) && (
                                    <div className="pt-2 border-t border-border/50 space-y-1 text-xs text-muted-foreground">
                                        {user.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                                <span dir="ltr">{user.phone}</span>
                                            </div>
                                        )}
                                        {user.address && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="line-clamp-1">{user.address}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{formatDate(user.created_at)}</span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs gap-1"
                                            onClick={() => onView(user)}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            {t('users.view_details', 'View')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 text-xs gap-1"
                                            onClick={() => onEdit(user)}
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            {t('common.edit', 'Edit')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isSelf}
                                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(user)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
