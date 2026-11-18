import React from 'react'
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
type props = {
    title: string,
    subtitle?: string
    actiontitle?: string
    children?: React.ReactNode
}
export default function SectionHeader({ title, subtitle, actiontitle, children }: props) {
    const { t, i18n } = useTranslation()
    return (
        <div className={`flex  ${i18n.language === "ar" ? "items-start" : "items-end"} justify-between mb-8`}>
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{subtitle}</span>
                <h2 className="text-2xl font-extrabold text-gray-900">
                    {title}
                </h2>
            </div>
            
            {children}
        </div>
    )
}