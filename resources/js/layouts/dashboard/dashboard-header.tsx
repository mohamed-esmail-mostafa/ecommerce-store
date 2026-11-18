import { Button } from '@/components/ui/button'
import { LanguagesIcon, Moon, Sun } from 'lucide-react'

import useImports from '@/hooks/use-imports';
import AuthMenu from '@/components/auth-menu';
import DashboardMobileSidebar from './dashboard-mobile-sidebar';

export default function DashboardHeader({ url }: any) {
    const { t, isArabic, toggleTheme, appearance, dark, isDark, toggleLanguage } = useImports()

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur-md md:px-8">
            <div className="flex items-center gap-3">
                <DashboardMobileSidebar />
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span>{t('admin_nav.admin_console')}</span>
                    <span>/</span>
                    <span className="text-foreground capitalize">
                        {url.replace('/', '') || t('admin_nav.dashboard')}
                    </span>
                </div>
            </div>

            {/* Header Controls (Language, Theme, User) */}
            <div className="flex items-center gap-2">
                {/* Language Switcher */}


                {/* Theme Toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTheme()}
                    className="size-9 p-0"
                >

                    {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-700" />}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLanguage()}
                    className="size-9 p-0"
                >

                   <LanguagesIcon />
                </Button>
                {/* User Profile Menu */}
                <AuthMenu />
            </div>
        </header>
    )
}
