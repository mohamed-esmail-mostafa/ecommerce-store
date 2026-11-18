import { Button } from '@/components/ui/button'
import useImports from '@/hooks/use-imports'
import useWebsiteSettings from '@/hooks/use-website-settings'
import { Languages, LanguagesIcon, Mail, Moon, Phone, Sun } from 'lucide-react'
import React from 'react'
import { Link } from '@inertiajs/react'

export default function TopHeader() {
    const { t, toggleLanguage, toggleTheme, appearance, isDark } = useImports()
    const {settings}=useWebsiteSettings()
    return (
        <div className="bg-black text-white text-xs py-1">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
                {/* Left: promo + contact */}
                <div className="flex items-center gap-5">
                    <span className=" sm:block font-medium tracking-wide">
                        {t('common.free_shipping')}
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Phone size={11} />
                        <a href={"#"} className="hover:text-secondary transition-colors">
                            123456
                            {/* {t('common.contact_phone')} */}
                        </a>
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Mail size={11} />
                        <a href={`#`}
                            className="hover:text-secondary transition-colors">

                        </a>
                    </span>
                </div>

                {/* Right: currency, language, links */}
                <div className="flex items-center gap-4">
                    {/* <LanguageSelector /> */}
                    <Button size="icon" onClick={() => toggleLanguage()}> <LanguagesIcon /> </Button>
                    <Button size="icon" onClick={() => toggleTheme()}>
                        {isDark ? <Sun />:<Moon />}
                    </Button>
                    <Link href="/login">{t("auth.login")}</Link>
                </div>
            </div>
        </div>
    )
}
