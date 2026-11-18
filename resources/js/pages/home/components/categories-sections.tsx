import SectionHeader from '@/components/section-header'
import useImports from '@/hooks/use-imports'
import { Category } from '@/types/category'
import { Link } from '@inertiajs/react'
import { ArrowLeft, ArrowRight, Image } from 'lucide-react'

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const { t, isArabic } = useImports()
  return (
    <section className="py-14 bg-gray-50">
      <div className="container overflow-hidden mx-auto px-4">
        

        <SectionHeader
          subtitle={t('categories.explore')}
          title={t('categories.shop_by_category')} >

          <Link className='text-primary flex items-center' >{t('categories.view_all')} {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} /> }  </Link>
        </SectionHeader>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories?.map((category: Category) => (

            <Link
              href={`/shop/page/${category.id}`}
              key={category.id}
              className="group flex flex-col items-center"
            >
             
              <div className="relative">
               
                <div className="absolute inset-0 rounded-full bg-orange-500/10 scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

              
                <div className="relative w-28 h-28 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={category.image || ""}
                    alt={isArabic ? category.name_ar : category.name_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-orange-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-orange-500 text-sm">→</span>
                </div>
              </div>

              
              <h3 className="mt-5 text-sm font-semibold text-center text-gray-800 transition-colors duration-300 group-hover:text-orange-500">
                {isArabic
                  ? category.name_ar
                  : category.name_en}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
