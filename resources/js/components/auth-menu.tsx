import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuth from '@/hooks/use-auth';
import { router, Link } from '@inertiajs/react';
import { CircleDashed, LogOut, UserIcon } from 'lucide-react';
import useImports from '@/hooks/use-imports';

export default function AuthMenu() {
    const { auth } = useAuth()
    const { t } = useImports()
   
    return (
      <>
      {auth ? <>
      
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative size-9 rounded-full p-0 border border-orange-700"
                >
                    <Avatar className="size-8">
                        <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name || 'User'} />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : 'AD'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                    <p className="text-xs font-medium leading-none text-foreground">
                        {auth?.user?.name || 'Admin'}
                    </p>
                    <p className="text-[11px] leading-none text-muted-foreground">
                        {auth?.user?.email || 'admin@system.local'}
                    </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings/profile" className="flex items-center gap-2 text-xs">
                        <UserIcon className="size-3.5" />
                        <span>{t('admin_nav.profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {auth?.user?.role?.slug === "admin" ? 
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 text-xs">
                        <CircleDashed className="size-3.5" />
                        <span>{t('common.dashboard')}</span>
                    </Link>
                </DropdownMenuItem>
            : null    
            }
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.post('/logout')}
                    className="flex items-center gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                    <LogOut className="size-3.5" />
                    <span>{t('admin_nav.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      
      </>:null}
      
      </>
    )
}
