import Logo from '@/components/ui/logo'
import MobileDrawer from './mobile-drawer'
import SearchBar from '@/components/search-bar'


export default function MobileHeader() {
    return (
        <div className=' lg:hidden sticky top-0  z-50'>
            <div className='container mx-auto flex items-center justify-between px-4 py-5'>
                <Logo />
                <MobileDrawer />
            </div>

            <div className="container mx-auto px-3 pb-2">
                <SearchBar />
            </div>
        </div>
    )
}
