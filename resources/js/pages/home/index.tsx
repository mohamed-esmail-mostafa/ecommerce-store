
import CategoriesSection from './components/categories-sections'
import BannerSection from './components/banner-section'
import ProductsSection from './components/products-section'
import UserLayout from '@/layouts/user-layout'
import PromoSection from './components/promo-section'
import Newsletter from './components/news-letter'
import HeroSection from './components/hero-section'
import StoreFeatures from './components/store-features'

export default function HomePage({ categories, products }: any) {
  console.log(products)
  return (
    <UserLayout>
      <HeroSection />
      <StoreFeatures />
      <CategoriesSection categories={categories} />
      {/* <BannerSection /> */}
      {/* <PromoSection /> */}
      <ProductsSection products={products} />
      {/* <Newsletter /> */}
    </UserLayout>
  )
}
