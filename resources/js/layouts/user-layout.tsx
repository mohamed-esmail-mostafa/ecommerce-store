import { Head } from '@inertiajs/react'
import React from 'react'
import TopHeader from '@/components/top-header'
import Footer from '@/components/footer'
import BottomNavigation from '@/components/bottom-navigation'
import MiddleHeader from '@/components/middle-header'
import { Category } from '@/types/category'


export default function UserLayout({ children, categories }: { children: React.ReactNode; categories?: Category[] }) {

  return (
    <>
      <Head title="Shopella — Shop Smart, Live Better">
        <meta name="description" content="Discover the best deals on fashion, electronics, home & living, and more at Shopella. Premium products at unbeatable prices." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen">
        <TopHeader />
        <MiddleHeader />
        {/* <MobileHeader /> */}
        <main>
          {children}
        </main>

        <Footer />
        <BottomNavigation />
      </div>
    </>
  )
}
