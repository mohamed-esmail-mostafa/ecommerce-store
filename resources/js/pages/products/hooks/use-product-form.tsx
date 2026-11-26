import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import useImports from '@/hooks/use-imports';
import { Product, ProductFormValues, ProductImage } from '@/types/product';

interface UseProductFormOptions {
    product?: Product | null;
}

export default function useProductForm({ product }: UseProductFormOptions = {}) {
    const { t } = useImports();
    const isEdit = Boolean(product);

    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const existingImages: ProductImage[] = (product?.images || [])
        .filter((img): img is ProductImage => typeof img === 'object' && img !== null && 'id' in img)
        .filter((img) => !deletedImageIds.includes(img.id));

    const handleRemoveExistingImage = (imageId: number) => {
        setDeletedImageIds((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]));
    };

    const validationSchema = Yup.object({
        title: Yup.string().trim().required(t('validation.is_required', 'This field is required')),
        category_id: Yup.string().required(t('validation.is_required', 'This field is required')),
        price: Yup.number()
            .typeError(t('validation.is_required', 'This field is required'))
            .min(0, t('validation.price_min', 'Price must be 0 or more'))
            .required(t('validation.is_required', 'This field is required')),
        sale_price: Yup.number()
            .nullable()
            .transform((value, originalValue) =>
                String(originalValue ?? '').trim() === '' ? null : value
            )
            .min(0, t('validation.price_min', 'Price must be 0 or more')),
        stock: Yup.number()
            .typeError(t('validation.is_required', 'This field is required'))
            .min(0, t('validation.stock_min', 'Stock must be 0 or more'))
            .required(t('validation.is_required', 'This field is required')),
        sku: Yup.string().nullable(),
        description: Yup.string().nullable(),
        long_description: Yup.string().nullable(),
        supplier_id: Yup.string().nullable(),
        brand_id: Yup.string().nullable(),
    });

    const formik = useFormik<ProductFormValues>({
        initialValues: {
            category_id: product?.category_id ? String(product.category_id) : '',
            supplier_id: product?.supplier_id ? String(product.supplier_id) : '',
            brand_id: product?.brand_id ? String(product.brand_id) : '',
            title: product?.title || '',
            slug: product?.slug || '',
            sku: product?.sku || '',
            description: product?.description || '',
            long_description: product?.long_description || '',
            price: product?.price !== undefined && product?.price !== null ? String(product.price) : '',
            sale_price:
                product?.sale_price !== undefined && product?.sale_price !== null
                    ? String(product.sale_price)
                    : '',
            stock: product?.stock !== undefined && product?.stock !== null ? String(product.stock) : '1',
            product_type: product?.product_type || 'simple',
            product_kind: product?.product_kind || 'physical',
            is_active: product?.is_active ?? true,
            is_featured: product?.is_featured ?? false,
            is_popular: product?.is_popular ?? false,
            images: [],
        },
        enableReinitialize: true,
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

            if (deletedImageIds.length > 0) {
                deletedImageIds.forEach((id) => {
                    formData.append('deleted_images[]', String(id));
                });
            }

            if (values.images && values.images.length > 0) {
                values.images.forEach((file) => {
                    formData.append('images[]', file);
                });
            }

            const endpoint = isEdit && product ? `/products/update/${product.id}` : '/store/product';

            router.post(endpoint, formData, {
                onSuccess: () => {
                    toast.success(
                        isEdit
                            ? t('products.updated_success', 'Product updated successfully.')
                            : t('common.saved_success', 'Product saved successfully.')
                    );
                },
                onError: (errors) => {
                    toast.error(t('common.error', 'Please check the form for errors.'));
                    Object.keys(errors).forEach((key) => {
                        formik.setFieldError(key as keyof ProductFormValues, errors[key]);
                    });
                },
                onFinish: () => setSubmitting(false),
            });
        },
    });

    return {
        formik,
        isEdit,
        existingImages,
        handleRemoveExistingImage,
    };
}
