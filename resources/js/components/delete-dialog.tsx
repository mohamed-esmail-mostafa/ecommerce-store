import React from 'react'
import { Dialog, DialogContent, DialogFooter } from './ui/dialog'
import { Delete, Trash2Icon } from 'lucide-react'
import useImports from '@/hooks/use-imports'
import { Button } from './ui/button'

export default function DeleteDialog({ showDeleteDialog = false, setshowDeleteDialog, handleDelete }: any) {
    const { t } = useImports()
    return (
        <Dialog open={showDeleteDialog} onOpenChange={() => setshowDeleteDialog(false)}>
            <DialogContent>
                <div className='flex flex-col items-center justify-center'>
                    <div className='bg-red-100 rounded-full p-3'>
                        <Trash2Icon />

                    </div>
                    <p className='font-bold text-xl'>{t("common.delete-title")}</p>
                    <p>{t("common.delete-description")}</p>
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>{t("common.delete")}</Button>
                    <Button variant="ghost" onClick={() => setshowDeleteDialog(false)}>{t("common.cancel")}</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
