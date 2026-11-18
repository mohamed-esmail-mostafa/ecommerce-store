import UserLayout from '@/layouts/user-layout'
import { Product } from '@/types/product'
import React from 'react'
import ProductDetailsInfo from './components/product-details-info'
import ProductGallery from './components/product-gallery'

export default function details({product}:{product:Product}) {
  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
             <ProductGallery />
          <ProductDetailsInfo product={product}  />
       
        </div>
        <div className="container mx-auto">
          <div className='flex gap-2 items-center justify-center'>
            <button className='border-b-primary border-b-2 px-4 py-2'>Reviews</button>
            <button className='border-b-primary border-b-2 px-4 py-2'>Reviews</button>
            <button className='border-b-primary border-b-2 px-4 py-2'>Reviews</button>
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum harum eos magnam mollitia earum sint, ad, facere aspernatur nesciunt totam ea cupiditate ducimus, vitae pariatur delectus nisi temporibus nobis! Accusamus quod voluptatum recusandae fuga dolores, voluptatibus amet! Necessitatibus, placeat! Delectus consequatur illum quibusdam doloribus illo officiis, voluptatem suscipit impedit numquam eaque error, eos aut earum quaerat sint rerum officia atque. Rem odit similique iste temporibus dolores voluptates consequuntur cumque ipsa cum ab possimus, quos deserunt eum, incidunt neque cupiditate a blanditiis autem commodi itaque molestiae quas soluta, error laborum! Cupiditate laboriosam magni accusantium labore facere officia facilis adipisci fugiat architecto, rerum consequuntur optio praesentium corrupti dolores dolorum laudantium nobis, earum inventore nulla? Doloremque, qui voluptatem voluptas reiciendis natus veniam et quae aut quo tempore similique assumenda fugiat? Officia fugit aspernatur minima molestias maiores labore illum esse voluptates, porro placeat, tenetur unde eveniet id impedit repudiandae! Officiis accusamus, alias architecto minima enim quibusdam doloribus ut quis! Nisi ullam voluptatum facilis nam, ut laudantium. Nostrum, molestiae ex nobis maiores laudantium ipsa aperiam numquam ullam deserunt fugit, perferendis veniam inventore dicta expedita officiis suscipit soluta? Consequatur cupiditate, aliquid delectus in, quo soluta fugit tempore unde omnis libero eaque beatae facilis odio, provident ab corporis. Sunt repellendus repudiandae debitis tempora, perferendis error reiciendis consequatur alias numquam nisi, culpa est ut rerum fugiat distinctio quisquam, accusamus amet exercitationem ea veniam dolore? Placeat molestiae minus nemo cupiditate. Illum veniam tempora aperiam repellendus. Aspernatur praesentium possimus vero quisquam rerum commodi consectetur est nesciunt harum enim. Placeat, minima. Nemo atque placeat repudiandae a, accusamus corporis, expedita similique at est ad accusantium saepe alias. Explicabo, fugiat quibusdam nisi quod assumenda suscipit quasi optio repudiandae ut porro asperiores officiis fugit aliquam? Eius sequi incidunt odio minus voluptatibus voluptatem ratione sunt modi? Id omnis tempora totam eius perferendis et vel ducimus?
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
