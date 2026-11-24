
import React from 'react'
import { LayoutDashboard, LucideIcon } from 'lucide-react'

interface PageHeaderProps {
    title?: string
    description?: string
    icon?: LucideIcon
    children?: React.ReactNode
}

export default function PageHeader({
    title,
    description,
    icon: Icon = LayoutDashboard,
    children,
}: PageHeaderProps) {
    return (
        <div className="container mx-auto mb-6 flex flex-col gap-4 border-b border-border bg-background px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={23} className="text-primary" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    {title && (
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                    )}

                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {children && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    )
}
