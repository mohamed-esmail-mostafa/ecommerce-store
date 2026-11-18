import ProductCard from '@/components/product-card'
import SectionHeader from '@/components/section-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useImports from '@/hooks/use-imports'
import { Pagination } from '@/types/pagination'
import { Product } from '@/types/product'
import { Link } from '@inertiajs/react'
import { ArrowDown, ArrowLeft, ArrowRight, Heart, ShoppingCart } from 'lucide-react'

interface PageProps {
  products: Pagination<Product>
}
export default function ProductsSection({ products }: PageProps) {
  const { t, isArabic } = useImports()
  return (
    <div>
      <div className="container mx-auto px-4 py-5">
        <SectionHeader
          subtitle={t('categories.explore')}
          title={t('categories.shop_by_category')} >

          <Link className='text-primary flex items-center' >{t('categories.view_all')} {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}  </Link>
        </SectionHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">


          {products.data.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}


        </div>

        <div className='flex items-center justify-center mt-5'>
          <Button>{t("common.show-more")} <ArrowDown /> </Button>
        </div>
      </div>
    </div>
  )
}
