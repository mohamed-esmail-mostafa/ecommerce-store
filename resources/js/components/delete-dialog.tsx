
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog'
import { Trash2 } from 'lucide-react'
import useImports from '@/hooks/use-imports'
import { Button } from './ui/button'

type DeleteDialogProps = {
    showDeleteDialog: boolean
    setshowDeleteDialog: (open: boolean) => void
    handleDelete: () => void
    processing?: boolean
}

export default function DeleteDialog({
    showDeleteDialog = false,
    setshowDeleteDialog,
    handleDelete,
    processing = false,
}: DeleteDialogProps) {
    const { t } = useImports()

    const handleClose = () => {
        if (!processing) {
            setshowDeleteDialog(false)
        }
    }

    return (
        <Dialog
            open={showDeleteDialog}
            onOpenChange={handleClose}
        >
            <DialogContent className="sm:max-w-[425px] p-6">

                <DialogHeader className="items-center text-center gap-3">

                    {/* Warning Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2
                                size={25}
                                className="text-destructive"
                                strokeWidth={2}
                            />
                        </div>
                    </div>

                    <DialogTitle className="text-xl font-bold">
                        {t('common.delete-title')}
                    </DialogTitle>

                    <DialogDescription className="text-sm leading-6 max-w-[300px]">
                        {t('common.delete-description')}
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-4">

                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        {t('common.cancel')}
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        <Trash2 size={16} />

                        {processing
                            ? t('common.loading')
                            : t('common.delete')}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
