import { Button } from '@/components/ui/button'
import useImports from '@/hooks/use-imports';
import { Link } from '@inertiajs/react'
import { Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import React from 'react'

export default function HeroSection() {
    const {t}=useImports();
    return (
        <div className='h-100 md:h-162.5 bg-cover bg-no-repeat my-3' style={{backgroundImage:'url("/banner.jpeg")'}}>
            <div className="container m-auto px-4 flex flex-col md:flex-row  h-full">
                <div className='flex flex-col justify-center h-full gap-5'>
                    <h1 className='font-extrabold text-3xl md:text-5xl'>Lorem ipsum dolor sit amet.</h1>
                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis corrupti asperiores, excepturi odio culpa iure.</h4>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <Link href="/" className='w-full '>
                            <Button className='w-full ' size="lg">Browse all Products</Button>
                        </Link>
                        <Link href="/" className='w-full '>
                            <Button className='w-full ' size="lg" variant="secondary">Browse Offers</Button>
                        </Link>
                    </div>
                </div>
                <div className=''></div>
            </div>

           
        </div>
    )
}
