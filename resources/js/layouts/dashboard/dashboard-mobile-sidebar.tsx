import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';

export default function DashboardMobileSidebar() {
    return (
        <div className='px-4'>

            <Sheet >
                <SheetTrigger><MenuIcon /></SheetTrigger>
                <SheetContent>
                    {/* <SheetTrigger>fdsfdsafdsfdf</SheetTrigger> */}
                    <SheetHeader>header</SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}
