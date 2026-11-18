import { Image } from 'lucide-react'
import React from 'react'

export default function NoImage() {
  return (
    <div className='w-full bg-gray-400 flex items-center justify-center h-44'>
        <Image className='min-w-full' />
    </div>
  )
}
