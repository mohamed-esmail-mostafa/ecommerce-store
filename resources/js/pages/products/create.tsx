import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import useImports from '@/hooks/use-imports'
import DashboardLayout from '@/layouts/dashboard-layout'
import { Link, router } from '@inertiajs/react'
import { useFormik } from 'formik';
import { toast } from 'sonner'
import * as Yup from 'yup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Supplier } from '@/types/supplier'
import { Category } from '@/types/category'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/input-error'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import ImagesPicker from '@/components/ui/images-picker'
import { CassetteTape, DollarSignIcon, Ticket, User2 } from 'lucide-react'

export default function create_page({ suppliers, categories }: { suppliers: Supplier[], categories: Category[] }) {
  const { t } = useImports()



  const validationSchema = Yup.object({
    title: Yup.string().trim().required(t('validation.is_required')),
    price: Yup.string().trim().required(t('validation.is_required')),
    stock: Yup.string().trim().required(t('validation.is_required')),
    images: Yup.mixed().nullable(),
  });

  // Formik Form
  const formik = useFormik({
    initialValues: {
      category_id: '',
      supplier_id: '',
      title: '',
      description: '',
      price: '',
      sale_price: '',
      stock: '',
      images: [],

    },
    validationSchema,

    onSubmit: async (values) => {

      const formData = new FormData();
      formData.append('category_id', values.category_id);
      formData.append('supplier_id', values.supplier_id);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('sale_price', values.price);
      formData.append('stock', values.price);


      if (values.images instanceof File) {
        formData.append('images', values.images);
      }


      values.images.forEach((image: File) => {
        formData.append('imagess[]', image);
      })


      router.post('/store/product', values, {
        onSuccess: () => {

          formik.resetForm()
          toast.success(t('common.success'));

        },
        onError: (errors) => {
          toast.error(t('common.error_happened'));
        },

      });
    },
  });

  const selectCategory = categories.find((category) => Number(category.id) === Number(formik.values.category_id))
  const selectSupplier = suppliers.find((supplier) => Number(supplier.id) === Number(formik.values.supplier_id))
  return (
    <DashboardLayout>
      <PageHeader title={t("products.create-page-title")}>
        <Link href={'/products/page'}>
          <Button>{t("products.page-title")}</Button>
        </Link>
      </PageHeader>


      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className='lg:col-span-2 p-4'>
            <div className=''>
              <Label>{t("products.select-category")}</Label>
              <Select
                name="category_id"

                value={formik.values.category_id?.toString()}
                onValueChange={(val) => {
                  formik.setFieldValue('category_id', Number(val))
                }}>
                <SelectTrigger className="w-full h-10 rounded-lg">

                  <SelectValue placeholder={t("products.select-category")} />

                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem value={category.id.toString()}>{category.name_ar}</SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
            {/* -------------------- */}
            <div>
              <Label>{t("products.select-supplier")}</Label>
              <Select
                name="supplier_id"

                value={formik.values.supplier_id?.toString()}
                onValueChange={(val) => formik.setFieldValue('supplier_id', Number(val))}>
                <SelectTrigger className="w-full h-10 rounded-lg">

                  <SelectValue placeholder={t("products.select-supplier")} />

                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem value={supplier.id.toString()}>{supplier.name}</SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
            {/* -------------------- */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                {t('products.title')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('products.title')}

              />
              {formik.touched.title && formik.errors.title && (
                <InputError message={formik.errors.title} />
              )}
            </div>


            {/* -------------------- */}

            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold">
                {t('products.price')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                value={formik.values.price}
                type='number'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('products.price')}

              />
              {formik.touched.price && formik.errors.price && (
                <InputError message={formik.errors.price} />
              )}
            </div>


            <div className="space-y-1.5">
              <Label htmlFor="sale_price" className="text-xs font-semibold">
                {t('products.sale-price')}
              </Label>
              <Input
                id="sale_price"
                name="sale_price"
                value={formik.values.sale_price}
                type='number'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('products.sale-price')}

              />
              {formik.touched.sale_price && formik.errors.sale_price && (
                <InputError message={formik.errors.sale_price} />
              )}
            </div>


            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold">
                {t('products.stock')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                value={formik.values.stock}
                type='number'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('products.stock')}

              />
              {formik.touched.stock && formik.errors.stock && (
                <InputError message={formik.errors.stock} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                {t('products.description')}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('products.description')}
                rows={3}

              />
              {formik.touched.description && formik.errors.description && (
                <InputError message={formik.errors.description} />
              )}
            </div>

            <ImagesPicker
              name="images"
              multiple
              images={formik.values.images}
              setFieldValue={formik.setFieldValue} />

          </div>
          <div className=''>
            <h4 className='text-center py-4 bg-gray-200'>{t("products.summery")}</h4>

            <div className='flex items-center justify-between  mb-1 border-b-2 border-b-gray-200 py-3'>
              <CassetteTape />
              <h6>  {selectCategory?.name_ar} - {selectCategory?.name_en}</h6>
            </div>
            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <User2 />
              <h6>  {selectSupplier?.name}</h6>
            </div>
            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <Ticket />
              <h6> {formik.values.title}</h6>
            </div>
            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <Ticket />
              <h6>{formik.values.description} </h6>
            </div>

            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <DollarSignIcon />
              <h6>{formik.values.price} </h6>
            </div>
            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <DollarSignIcon />
              <h6>{formik.values.sale_price} </h6>
            </div>
            <div className='flex items-center justify-between mb-1 border-b-2 border-b-gray-200 py-3'>
              <DollarSignIcon />
              <h6>{formik.values.stock} </h6>
            </div>






          </div>
        </div>
      </div>

      <div className='container px-10 m-auto grid grid-cols-1 md:grid-cols-2 gap-4'>










        {/* <div>
          <input type="file" multiple onChange={(e) => e.target.files} />
        </div> */}

      </div>
      <Button type='submit' onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting}>{t("common.save")}</Button>

    </DashboardLayout>
  )
}
