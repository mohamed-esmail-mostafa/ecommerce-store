import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import useImports from '@/hooks/use-imports';
import DashboardLayout from '@/layouts/dashboard-layout'
import { Category } from '@/types/category';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ImagePicker from '@/components/ui/image-picker';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import DeleteDialog from '@/components/delete-dialog';
import PageHeader from '@/components/page-header';
import NoDataFound from '@/components/no-data-found';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NoImage from '@/components/no-image';

export default function index({ categories }: { categories: Category[] }) {
  const { t } = useImports()
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)


  const validationSchema = Yup.object({
    name_ar: Yup.string().trim().required(t('validation.is_required')),
    image: Yup.mixed().nullable(),
  });

  // Formik Form
  const formik = useFormik({
    initialValues: {
      name_ar: editCategory ? editCategory.name_ar || '' : '',
      name_en: editCategory ? editCategory.name_en || '' : '',
      description_ar: editCategory ? editCategory.description_ar || '' : '',
      description_en: editCategory ? editCategory.description_en || '' : '',
      image: editCategory ? editCategory.image || null : (null as File | string | null),
      parent_id: editCategory ? editCategory.id || null : null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      
      const formData = new FormData();
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);
      if (values.description_en) formData.append('description_en', values.description_en);
      if (values.description_ar) formData.append('description_ar', values.description_ar);
      if (values.parent_id) formData.append('parent_id', values.parent_id.toString());

      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      if (editCategory) {
        // Update
        router.put(`/update/category/${editCategory.slug}`, formData, {
          onSuccess: () => {
            toast.success(t('common.success'));
            setEditCategory(null)
            setShowModal(false)
          },
          onError: (errors) => {
            toast.error(t('common.error_happened'));
          },
          
        });
      } else {

        router.post('/store/categories', formData, {
          onSuccess: () => {
            setShowModal(false)
            formik.resetForm()
            toast.success(t('common.success'));

          },
          onError: (errors) => {
            toast.error(t('common.error_happened'));
          },
          
        });
      }
    },
  });



  const handleDeleteCategory = async () => {
    router.delete(`/delete/category/${deleteCategory?.slug}`, {
      onSuccess: () => {
        setDeleteDialog(false)
        toast.success(t('common.success'));

      },
      onError: (errors) => {
        toast.error(t('common.error'));
        Object.keys(errors).forEach((key) => {
          formik.setFieldError(key, errors[key]);
        });
      },
    })
  }

  return (
    <DashboardLayout>
      <PageHeader title={t("categories.page-title")}>
        <Button onClick={() => setShowModal(true)}>{t("common.add")}</Button>
      </PageHeader>





      {categories.length === 0 ? <NoDataFound /> :
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mt-5">
          {categories.map((category: Category) => (
            <Card className='p-0 gap-0 overflow-hidden'>
              <CardHeader className='p-0'>
                {category.image ? <img src={category.image ? category.image : ''} alt="" /> : <NoImage /> }
              </CardHeader>
              <CardContent className='p-2'>

                <h1 className='font-bold text-md'>
                  {category.name_ar} - {category.name_en}
                </h1>
                <p>{category.description_ar}</p>
                <p>{category.description_en}</p>

              </CardContent>
              <CardFooter className='flex gap-2 p-2'>
                <Button
                  variant="default"
                  onClick={() => {
                    setEditCategory(category)
                    setShowModal(true)
                  }}>{t("common.edit")}</Button>
                <Button
                  onClick={() => {
                    setDeleteCategory(category)
                    setDeleteDialog(true)
                  }}
                  variant="destructive"
                >{t("common.delete")}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

      }












      <Dialog open={showModal} onOpenChange={setShowModal}>

        <DialogContent>
          <form
            onSubmit={formik.handleSubmit}
            className="overflow-y-auto flex-1"
            encType="multipart/form-data"
          >
            <div className="p-6 space-y-5">



              <div className="space-y-1.5">
                <ImagePicker
                  id="category-image"
                  label={t('categories.image')}
                  initialPreview={editCategory?.image || null}
                  onChange={(file) => formik.setFieldValue('image', file)}
                  error={formik.touched.image && formik.errors.image ? (formik.errors.image as string) : undefined}
                />
              </div>

             
              {categories.length > 0 ?  
              <div>
                <Select
                  name="parent_id"
                  
                  value={formik.values.parent_id?.toString()}
                  onValueChange={(val) => formik.setFieldValue('parent_id', Number(val))}>
                  <SelectTrigger className="w-full h-10 rounded-lg">
                    
                    <SelectValue placeholder={editCategory ? editCategory.name_ar : t('categories.select-parent-category')} />
                    
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem value={category.id.toString()}>{category.name_ar}</SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div> : null }

              <div className="space-y-1.5">
                <Label htmlFor="name_ar" className="text-xs font-semibold">
                  {t('common.name_ar')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name_ar"
                  name="name_ar"
                  value={formik.values.name_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Desserts, Beverages, Main Course"
                  className="rounded-xl"
                />
                {formik.touched.name_ar && formik.errors.name_ar && (
                  <InputError message={formik.errors.name_ar} />
                )}
              </div>


              <div className="space-y-1.5">
                <Label htmlFor="name_en" className="text-xs font-semibold">
                  {t('common.name_en')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name_en"
                  name="name_en"
                  value={formik.values.name_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Desserts, Beverages, Main Course"
                  className="rounded-xl"
                />
                {formik.touched.name_en && formik.errors.name_en && (
                  <InputError message={formik.errors.name_en} />
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <Label htmlFor="description_ar" className="text-xs font-semibold">
                  {t('common.description_ar')}
                </Label>
                <Textarea
                  id="description_ar"
                  name="description_ar"
                  value={formik.values.description_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Optional description of the category..."
                  rows={3}
                  className="rounded-xl resize-none"
                />
                {formik.touched.description_ar && formik.errors.description_ar && (
                  <InputError message={formik.errors.description_ar} />
                )}
              </div>


              <div className="space-y-1.5">
                <Label htmlFor="description_en" className="text-xs font-semibold">
                  {t('common.description_en', 'Description')}
                </Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formik.values.description_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Optional description of the category..."
                  rows={3}
                  className="rounded-xl resize-none"
                />
                {formik.touched.description_en && formik.errors.description_en && (
                  <InputError message={formik.errors.description_en} />
                )}
              </div>








            </div>

            <DialogFooter>
              <Button type='submit' disabled={formik.isSubmitting}>{t("common.save")}</Button>
              <Button type='button' variant="destructive" onClick={() => setShowModal(false)}>{t("common.cancel")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>



      <DeleteDialog
        showDeleteDialog={deleteDialog}
        setshowDeleteDialog={setDeleteDialog}
        handleDelete={handleDeleteCategory}

      />
    </DashboardLayout>
  )
}
