import { Link } from '@inertiajs/react'
import { Heart, HeartIcon, Home, RibbonIcon, ShoppingCart, ShoppingCartIcon, Store, StoreIcon, User, User2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button';
import useImports from '@/hooks/use-imports';



function NavigationIcon({ label, icon, href }: any) {
    return (
        <Link href={href}

            className='flex flex-col items-center justify-center flex-1'>
            <p>{icon}</p>
            <p className='text-xs font-bold mt-1'>{label}</p>
        </Link>
    )
}

{/* <path d='
                        M 0 0
                        H 100
                        C 190 0, 155 55 , 200 55
                        C 245 55,245 0,265 0
                        H 400
                        V 100 
                        H 0
                        Z
                        '
                    fill='gray'
                /> */}


                // <path d={`
                //         M 0 0
                //         H ${left}
                //         C ${left + curvature} 0, 
                //            ${center - curvature} ${depth} , 
                //            ${center} ${depth}

                //         C ${center + curvature} ${depth}, 
                //           ${right - curvature} 0 , 
                //           ${right} 0
                //         H 400
                //         V 100 
                //         H 0
                //         Z
                // `}
export default function BottomNavigation() {
    const { t } = useImports();
    const center = 200;
    const width = 140;
    const depth = 70;
    const curvature = 25;
    const left = center - width / 2;
    const right = center - width / 2;
    return (
        <div className='fixed bottom-0 right-0 left-0 h-18 w-full lg:hidden'>
            <svg viewBox='0 0 400 100' preserveAspectRatio='none' className='absolute inset-0 w-full h-full '>
                <path d={`
                        M 0 0
                        H ${left}
                        C ${left + curvature} 0, ${center - curvature} ${depth} , ${center} ${depth}
                        C ${center + curvature} ${depth}, 245 0, 265 0
                        H 400
                        V 100 
                        H 0
                        Z
                
                `}
                        
                        
                    fill='white'
                    stroke=""
                    strokeWidth={3}
                    strokeLinecap='round'

                /> 


                

                <NavigationIcon icon={<Home />} title="fdsfdf" />
            </svg>
            <Link href={'/cart/page'} className='absolute bg-primary rounded-full w-16 h-16  left-1/2 -top-10 -translate-x-1/2 p-0 flex items-center justify-center'><ShoppingCartIcon size={30} color='white' /></Link>

            <div className="flex justify-between gap-40">
                <div className='relative flex items-center  mt-3 flex-1'>
                    <NavigationIcon href="/" icon={<Home />} label={t("common.home")} />
                    <NavigationIcon icon={<User2Icon />} label={t('auth.account')} />
                   
                </div>
                <div className='relative flex items-center  mt-3 flex-1'>
                    <NavigationIcon href={'/shop/page'} icon={<StoreIcon />} label={t('common.shop')} />
                    <NavigationIcon href={'/wishlist/page'} icon={<HeartIcon />} label={t('common.wishlist')} />
                    
                </div>
            </div>
        </div>
    )
}
