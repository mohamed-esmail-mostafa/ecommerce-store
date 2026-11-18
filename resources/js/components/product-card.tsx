import { Product } from '@/types/product'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Link } from '@inertiajs/react'
import { Button } from './ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import useImports from '@/hooks/use-imports'

export default function ProductCard({ product }: { product: Product }) {
    const { t } = useImports();
    return (
        <Card className='p-0 overflow-hidden gap-0 rounded-none'>
            <CardHeader className=' p-0'>
                <Link href={`/product/${product.slug}/details`}> <img src='/image.jpeg' className='w-full' /></Link>
            </CardHeader>
            <CardContent className=' pt-2'>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <p>{product.category.name_ar}</p>
                <div>
                    {product.sale_price ? (
                        <div className='flex items-center gap-2'>
                            <p>{product.sale_price}</p>
                            <p className='line-through text-red-700'>{product.price}</p>
                        </div>
                    ) : (<div>
                        <p className='text-primary'>{product.price}</p>
                    </div>)}
                </div>
            </CardContent>
            <CardFooter className='py-1 p-0 ' >
                <Button className='rounded-none' variant="outline">
                    <Heart />
                </Button>
                <Button className='rounded-none flex-1'>
                    <ShoppingCart />{t("common.add-to-cart")}
                </Button>
            </CardFooter>
        </Card>
    )
}
