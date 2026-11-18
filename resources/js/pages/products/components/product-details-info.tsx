import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import useImports from '@/hooks/use-imports';
import { Product } from '@/types/product';
import { Link } from '@inertiajs/react'
import { Divide, FacebookIcon, Instagram, Minus, Plus, ShoppingBagIcon, TicketCheckIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function ProductDetailsInfo({product}:{product:Product}) {
    const [quantity, setQuantity] = useState(1);
    const { t,isArabic} = useImports();
    return (
        <div>
            <h1 className='font-bold text-2xl'>{product.title}</h1>
            <p>{product.description}</p>

           {product.sale_price ?  <div className='flex items-center gap-2 my-5'>
                <p className='font-bold text-2xl text-primary'>{product.sale_price}</p>
                <p className='font-bold text-2xl text-red-600 line-through'>{product.price}</p>
            </div> : <div>
                <p className='font-bold text-2xl text-primary'>{product.price}</p>
                </div>}
            <div className='my-5'>
                <Label>{t("common.quantity")}</Label>
                <div className='flex items-center '>
                    <Button onClick={() => setQuantity(quantity + 1)} className='rounded-none'><Plus /></Button>
                    <span className='w-12 block text-center'>{quantity}</span>
                    <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)} className='rounded-none'><Minus /></Button>
                </div>
            </div>
            <div className='flex items-center gap-1 my-5'>
                <Button>{t("common.add_to_cart")} <ShoppingBagIcon /> </Button>
                <Link>
                    <Button variant={'secondary'}>
                        {t("common.buy_now")}
                    </Button></Link>
            </div>

            <Link className='text-primary text-xs' href={"#"}>{isArabic ? product.category.name_ar : product.category.name_en}</Link>

            <div>
                <Label className='mb-1'>{t("common.share")}</Label>
                <div className='flex items-center gap-2'>
                    <button className='border border-gray-500 rounded-full p-2'>
                        <FacebookIcon size={20} />
                    </button>
                    <button className='border border-gray-500 rounded-full p-2'>
                        <Instagram size={20} />
                    </button>
                    <button className='border border-gray-500 rounded-full p-2'>
                        <TicketCheckIcon size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
