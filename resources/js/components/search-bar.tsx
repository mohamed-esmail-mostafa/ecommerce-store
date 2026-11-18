import useImports from '@/hooks/use-imports'
import { Search } from 'lucide-react'


export default function SearchBar() {
  const { t } = useImports()
  return (
    <div className="flex w-full border border-primary rounded-full overflow-hidden shadow-sm">
      <input
        type="text"

        // onChange={e => setSearchQuery(e.target.value)}
        placeholder={t('common.search-placeholder')}
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
      />
      <button className="bg-primary hover:bg-primary/80 transition-colors px-5 flex items-center justify-center">
        <Search size={18} className="text-white" />
      </button>
    </div>
  )
}
