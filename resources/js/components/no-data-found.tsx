import useImports from '@/hooks/use-imports'
import { Database } from 'lucide-react'
import React from 'react'

export default function NoDataFound({ children }: { children?: React.ReactNode }) {
    const { t } = useImports()
    return (
        <div className='flex flex-col items-center justify-center py-4 h-100'>

            <div className='bg-gray-200 rounded-full p-3 mb-3'>
                <Database size={40} className='text-primary' />
            </div>
            <p>{t("common.no-data")}</p>
            <p>{t("common.no-data-des")}</p>
            {children}
        </div>
    )
}
