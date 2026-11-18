import DeleteDialog from '@/components/delete-dialog'
import InputError from '@/components/input-error'
import NoDataFound from '@/components/no-data-found'
import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useImports from '@/hooks/use-imports'
import DashboardLayout from '@/layouts/dashboard-layout'
import { Supplier } from '@/types/supplier'
import { router } from '@inertiajs/react'
import { useFormik } from 'formik'
import { Database, MapIcon, MessageCircle, Phone, User } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function index({ suppliers }: { suppliers: Supplier[] }) {
    const { t } = useImports()
    const [modalOpen, setModalOpen] = useState(false)
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [showDeleteDialog, setshowDeleteDialog] = useState(false)
    const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);
    const formik = useFormik({
        initialValues: {
            name: supplier ? supplier.name || '' : '',
            phone: supplier ? supplier.phone || '' : '',
            address: supplier ? supplier.address || '' : '',
            whatsup: supplier ? supplier.whatsup || '' : '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (supplier) {
                router.post(`/suppliers/update/${supplier.slug}`, values, {
                    onSuccess: () => {
                        formik.resetForm();
                        setModalOpen(false)
                        toast.success(t("common.success"))
                    },
                    onError: () => {
                        toast.success(t("common.error"))
                    },
                })
            } else {
                router.post("/suppliers/store", values, {
                    onSuccess: () => {
                        formik.resetForm();
                        setModalOpen(false)
                        toast.success(t("common.success"))
                    },
                    onError: () => {
                        toast.success(t("common.error"))
                    },
                })
            }
        }
    })

    const handleDeleteSupplier = async () => {
        router.delete(`/supplier/delete/${deleteSupplier?.slug}`, {
            onSuccess: () => {
                setshowDeleteDialog(false)
                toast.success(t("common.success"))
            },
            onError: () => {
                toast.success(t("common.error"))
            },
        })
    }
    return (
        <DashboardLayout>


            <PageHeader title={t("suppliers.page-title")}>
                <Button onClick={() => setModalOpen(true)}>{t("common.add")}</Button>
            </PageHeader>



            <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
                <DialogContent>
                    <div>
                        <Label>{t("common.name")}</Label>
                        <Input name="name" value={formik.values.name} onChange={formik.handleChange} />
                        <InputError message={formik.errors.name} />
                    </div>
                    <div>
                        <Label>{t("common.phone")}</Label>
                        <Input name="phone" value={formik.values.phone} onChange={formik.handleChange} />
                        <InputError message={formik.errors.phone} />
                    </div>

                    <div>
                        <Label>{t("common.address")}</Label>
                        <Input name="address" value={formik.values.address} onChange={formik.handleChange} />
                        <InputError message={formik.errors.address} />
                    </div>

                    <div>
                        <Label>{t("common.whatsup")}</Label>
                        <Input name="whatsup" value={formik.values.whatsup} onChange={formik.handleChange} />
                        <InputError message={formik.errors.whatsup} />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => formik.handleSubmit()}>{t("common.save")}</Button>
                        <Button variant="destructive" onClick={() => setModalOpen(false)}>{t("common.cancel")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>








            {suppliers.length === 0 ?
                <NoDataFound /> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {suppliers.map((supplier: any) => (
                        <Card>
                            <CardHeader></CardHeader>
                            <CardContent className='flex flex-col gap-3'>
                                <h2 className='flex items-center'><User /> - {supplier.name}</h2>
                                <h2 className='flex items-center'> <Phone /> - {supplier.phone}</h2>
                                <h2 className='flex items-center'> <MapIcon /> - {supplier.address}</h2>
                                <h2 className='flex items-center'><MessageCircle /> - {supplier.whatsup}</h2>
                            </CardContent>
                            <CardFooter className='flex gap-4'>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSupplier(supplier)
                                        setModalOpen(true)
                                    }}>{t("common.edit")}</Button>


                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setDeleteSupplier(supplier)
                                        setshowDeleteDialog(true)
                                    }}>{t("common.delete")}</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>}
            <DeleteDialog
                showDeleteDialog={showDeleteDialog}
                setshowDeleteDialog={setshowDeleteDialog}
                handleDelete={handleDeleteSupplier}
            />
        </DashboardLayout>
    )
}
