import React from 'react'
import { Link, router } from '@inertiajs/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import useImports from '@/hooks/use-imports';
import { ProductFormValues } from '@/types/product';

export default function useCreateProduct() {
    const {t}=useImports()
    const validationSchema = Yup.object({
    title: Yup.string().trim().required(t('validation.is_required')),
    category_id: Yup.string().required(t('validation.is_required')),
    price: Yup.number()
      .typeError(t('validation.is_required'))
      .min(0, t('validation.price_min'))
      .required(t('validation.is_required')),
    sale_price: Yup.number()
      .nullable()
      .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
      .min(0, t('validation.price_min')),
    stock: Yup.number()
      .typeError(t('validation.is_required'))
      .min(0, t('validation.stock_min'))
      .required(t('validation.is_required')),
    sku: Yup.string().nullable(),
    description: Yup.string().nullable(),
    long_description: Yup.string().nullable(),
    supplier_id: Yup.string().nullable(),
    brand_id: Yup.string().nullable(),
  });

  // Formik Form
  const formik = useFormik<ProductFormValues>({
    initialValues: {
      category_id: '',
      supplier_id: '',
      brand_id: '',
      title: '',
      slug: '',
      sku: '',
      description: '',
      long_description: '',
      price: '',
      sale_price: '',
      stock: '1',
      product_type: 'simple',
      product_kind: 'physical',
      is_active: true,
      is_featured: false,
      is_popular: false,
      images: [],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category_id', values.category_id);
      if (values.supplier_id) formData.append('supplier_id', values.supplier_id);
      if (values.brand_id) formData.append('brand_id', values.brand_id);
      if (values.slug) formData.append('slug', values.slug);
      if (values.sku) formData.append('sku', values.sku);
      if (values.description) formData.append('description', values.description);
      if (values.long_description) formData.append('long_description', values.long_description);
      formData.append('price', values.price);
      if (values.sale_price) formData.append('sale_price', values.sale_price);
      formData.append('stock', values.stock);
      formData.append('product_type', values.product_type);
      formData.append('product_kind', values.product_kind);
      formData.append('is_active', values.is_active ? '1' : '0');
      formData.append('is_featured', values.is_featured ? '1' : '0');
      formData.append('is_popular', values.is_popular ? '1' : '0');

      // Multiple images
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append('images[]', file);
        });
      }

      router.post('/store/product', formData, {
        onSuccess: () => {
          toast.success(t('common.saved_success'));
        },
        onError: (errors) => {
          toast.error(t('common.error'));
          Object.keys(errors).forEach((key) => {
            formik.setFieldError(key as any, errors[key]);
          });
        },
        onFinish: () => setSubmitting(false),
      });
    },
  });

//   const selectedCategory = categories.find((c) => String(c.id) === String(formik.values.category_id));
//   const selectedSupplier = suppliers.find((s) => String(s.id) === String(formik.values.supplier_id));
//   const selectedBrand = brands.find((b) => String(b.id) === String(formik.values.brand_id));

  return {
formik,
  }
}
