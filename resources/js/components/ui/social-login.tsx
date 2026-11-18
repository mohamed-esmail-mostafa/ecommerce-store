import React from 'react'
import { Button } from './button'
import useImports from '@/hooks/use-imports'
import { Check } from 'lucide-react'

export default function SocialLogin() {
    const { t } = useImports()
    return (
        <div className='flex flex-col gap-3'>
            <Button className='w-full'> <Check /> {t('auth.google-login')}  </Button>
            <Button className='w-full bg-blue-700'> <Check /> {t('auth.facebook-login')}</Button>
        </div>
    )
}
