import { Link } from '@inertiajs/react'
import { Home } from 'lucide-react'


export default function DashboardNavigationBottom() {
  return (
    <div className='fixed bottom-0 right-0 left-0 h-16 bg-gray-100 flex justify-center items-center md:hidden'>
      <div className='flex items-center justify-between w-full px-5'>
        <Link href="#" className='flex flex-col items-center justify-center'>
          <Home />
          <span className='text-xs'>Home</span>
        </Link>
        <Link href="#" className='flex flex-col items-center justify-center'>
          <Home />
          <span>Home</span>
        </Link>
        <Link href="#" className='flex flex-col items-center justify-center'>
          <Home />
          <span>Home</span>
        </Link>
        <Link href="#" className='flex flex-col items-center justify-center'>
          <Home />
          <span>Home</span>
        </Link>
        <Link href="#" className='flex flex-col items-center justify-center'>
          <Home />
          <span>Home</span>
        </Link>
      </div>
    </div>
  )
}
