import NoDataFound from '@/components/no-data-found'
import NoImage from '@/components/no-image'
import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import useImports from '@/hooks/use-imports'
import useWebsiteSettings from '@/hooks/use-website-settings'
import DashboardLayout from '@/layouts/dashboard-layout'
import { Pagination } from '@/types/pagination'
import { Product } from '@/types/product'
import { Link, router } from '@inertiajs/react'
import { Edit2Icon, Trash2 } from 'lucide-react'
import React from 'react'

interface ProductsPageProps {
  products: Pagination<Product>
}

export default function products_page({ products }: ProductsPageProps) {
  const { t } = useImports()
  const { settings } = useWebsiteSettings()


  const changePage = (url: string | null) => {
    if (url) {
      router.get(url, {}, {
        preserveState: true,
        preserveScroll: true
      })
    }
  }
  return (
    <DashboardLayout>
      <PageHeader title={t("products.page-title")}>
        <Link href={'/create/product/page'}>
          <Button>{t("common.add")}</Button>
        </Link>
      </PageHeader>
      {products.data.length === 0 ? <NoDataFound /> :
        <div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 contianer mx-auto px-5 gap-4 '>
            {products.data.map((product: Product) => (
              <Card key={product.id} className='p-0 overflow-hidden gap-0'>
                <CardHeader className='p-0'>
                  {product.images.length > 0 ? <img src={product.images[0]} /> : <NoImage />}
                </CardHeader>
                <CardContent className='p-2 mt-0 '>
                  <h2 className='font-bold'>{product.title}</h2>
                  <h2>{product.description}</h2>
                  <h2>{product.category?.name_ar}</h2>
                  <div >

                    {product.sale_price ? <div>
                      <span className=''>{settings?.currency_ar}{product.price}</span>
                      <span className=''>{settings?.currency_ar} {product.sale_price}</span>
                    </div> : <span className=''>{settings?.currency_ar}{product.price}</span>}

                  </div>
                </CardContent>
                <CardFooter className='p-2 gap-2'>
                  <Button variant="default" size="icon"><Edit2Icon /></Button>
                  <Button variant="destructive" size="icon"><Trash2 /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>


          <div className='flex items-center gap-3 mt-10 container m-auto px-5'>
            <Button
              disabled={!products.prev_page_url}
              onClick={() => { changePage(products.prev_page_url) }}>
              {t("common.previous")}
            </Button>
            <Button
              disabled={!products.next_page_url}
              onClick={() => { changePage(products.next_page_url) }}>{t("common.next")}</Button>
          </div>

        </div>}



    </DashboardLayout>
  )
}
