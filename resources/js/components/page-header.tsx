import React from 'react'

export default function PageHeader({ title, children }: { title?: string, children?: React.ReactNode }) {
    return (
        <div className='mb-4 flex items-center justify-between bg-white dark:bg-background h-18  px-5 border-b-2 border-b-gray-200 container m-auto '>
            <h3 className='font-bold text-lg'>{title}</h3>
            <div>{children}</div>
        </div>
    )
}
