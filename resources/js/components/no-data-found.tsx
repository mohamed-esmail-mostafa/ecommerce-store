
import useImports from '@/hooks/use-imports'
import { Database, SearchX } from 'lucide-react'
import React from 'react'

export default function NoDataFound({
    children,
}: {
    children?: React.ReactNode
}) {
    const { t } = useImports()

    return (
        <div className="flex min-h-75 h-full flex-col items-center justify-center px-4 py-10 text-center">

            {/* Icon */}
            <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-primary/10">
                <SearchX
                    size={38}
                    strokeWidth={1.5}
                    className="text-primary"
                />
            </div>

            {/* Text */}
            <h3 className="mb-2 text-lg font-semibold text-foreground">
                {t('common.no-data')}
            </h3>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                {t('common.no-data-des')}
            </p>

            {/* Optional Action */}
            {children && (
                <div className="mt-6">
                    {children}
                </div>
            )}
        </div>
    )
}
