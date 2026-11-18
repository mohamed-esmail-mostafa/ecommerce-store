

import DestopHeader from './destop-header'
import MobileHeader from './mobile-header'

export default function MiddleHeader() {
    return (
        <div className='sticky top-0 z-50 bg-white'>
            <DestopHeader />
            <MobileHeader />
        </div>
    )
}
