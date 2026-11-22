

import { Category } from '@/types/category'
import DestopHeader from './destop-header'
import MobileHeader from './mobile-header'

export default function MiddleHeader({categories}:{categories:Category[]}) {
    return (
        <div className='sticky top-0 z-50 bg-white'>
            <DestopHeader categories={categories} />
            <MobileHeader />
        </div>
    )
}
