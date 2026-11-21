import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  FolderTree,
  HelpCircle,
  ImageIcon,
  Layers,
  Package,
  Save,
  Sparkles,
  Tag,
  Ticket,
  Truck,
  User2,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import InputError from '@/components/input-error';
import ImagesPicker from '@/components/ui/images-picker';
import RichTextEditor from '@/components/ui/rich-text-editor';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import useImports from '@/hooks/use-imports';
import { Supplier } from '@/types/supplier';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';

interface CreateProductPageProps {
  suppliers?: Supplier[];
  categories?: Category[];
  brands?: Brand[];
}

interface ProductFormValues {
  category_id: string;
  supplier_id: string;
  brand_id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  long_description: string;
  price: string;
  sale_price: string;
  stock: string;
  product_type: 'simple' | 'variant';
  product_kind: 'physical' | 'digital';
  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  images: File[];
}

export default function CreateProductPage({
  suppliers = [],
  categories = [],
  brands = [],
}: CreateProductPageProps) {
  const { t } = useImports();

  // Validation Schema
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

  const selectedCategory = categories.find((c) => String(c.id) === String(formik.values.category_id));
  const selectedSupplier = suppliers.find((s) => String(s.id) === String(formik.values.supplier_id));
  const selectedBrand = brands.find((b) => String(b.id) === String(formik.values.brand_id));

  return (
    <DashboardLayout>
      <PageHeader title={t('products.create-page-title', 'Create New Product')}>
        <div className="flex items-center gap-2">
          <Link href="/products/page">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              {t('products.page-title', 'Products List')}
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            disabled={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
            className="gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {t('common.save', 'Save Product')}
          </Button>
        </div>
      </PageHeader>

      <form onSubmit={formik.handleSubmit} className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Basic Information */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  {t('products.general_info', 'General Information')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('products.general_info_desc', 'Enter the basic name and descriptions')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold">
                    {t('products.title', 'Product Title')}{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('products.title_placeholder', 'e.g. Wireless Noise-Cancelling Headphones')}
                    className="rounded-lg h-10"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <InputError message={formik.errors.title} />
                  )}
                </div>

                {/* Slug & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-semibold">
                      {t('common.slug', 'Slug')}
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formik.values.slug}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="auto-generated-from-title"
                      className="rounded-lg font-mono text-xs"
                    />
                    {formik.touched.slug && formik.errors.slug && (
                      <InputError message={formik.errors.slug} />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sku" className="text-xs font-semibold">
                      {t('products.sku', 'SKU (Stock Keeping Unit)')}
                    </Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formik.values.sku}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. SKU-10492"
                      className="rounded-lg font-mono text-xs"
                    />
                    {formik.touched.sku && formik.errors.sku && (
                      <InputError message={formik.errors.sku} />
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold">
                    {t('products.description', 'Short Summary Description')}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('products.description_placeholder', 'Brief overview of key product highlights...')}
                    rows={3}
                    className="rounded-lg resize-none text-sm"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <InputError message={formik.errors.description} />
                  )}
                </div>

                {/* Long Description with Rich Text Editor */}
                <div className="space-y-1.5 pt-2">
                  <RichTextEditor
                    id="long_description"
                    label={t('products.long_description', 'Detailed Description (Rich Text)')}
                    value={formik.values.long_description}
                    onChange={(val) => formik.setFieldValue('long_description', val)}
                    error={
                      formik.touched.long_description && formik.errors.long_description
                        ? formik.errors.long_description
                        : undefined
                    }
                    placeholder="Detailed specifications, features, care instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Pricing & Stock */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  {t('products.pricing_inventory', 'Pricing & Inventory')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('products.pricing_inventory_desc', 'Set regular price, discounted price, and available inventory')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Regular Price */}
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-semibold">
                      {t('products.price', 'Price')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className="rounded-lg"
                    />
                    {formik.touched.price && formik.errors.price && (
                      <InputError message={formik.errors.price} />
                    )}
                  </div>

                  {/* Sale Price */}
                  <div className="space-y-1.5">
                    <Label htmlFor="sale_price" className="text-xs font-semibold">
                      {t('products.sale-price', 'Sale Price')}
                    </Label>
                    <Input
                      id="sale_price"
                      name="sale_price"
                      type="number"
                      step="0.01"
                      value={formik.values.sale_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Optional discount price"
                      className="rounded-lg"
                    />
                    {formik.touched.sale_price && formik.errors.sale_price && (
                      <InputError message={formik.errors.sale_price} />
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <Label htmlFor="stock" className="text-xs font-semibold">
                      {t('products.stock', 'Stock Quantity')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0"
                      className="rounded-lg"
                    />
                    {formik.touched.stock && formik.errors.stock && (
                      <InputError message={formik.errors.stock} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Product Media & Gallery */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  {t('products.media', 'Product Media')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('products.media_desc', 'Upload product gallery images (PNG, JPG, WEBP)')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ImagesPicker
                  name="images"
                  multiple
                  images={formik.values.images}
                  setFieldValue={formik.setFieldValue}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Taxonomy, Flags & Live Summary */}
          <div className="space-y-6">
            {/* 1. Categorization & Relations */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-primary" />
                  {t('products.organization', 'Organization')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Category Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="category_id" className="text-xs font-semibold">
                    {t('products.select-category', 'Category')}{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formik.values.category_id}
                    onValueChange={(val) => formik.setFieldValue('category_id', val)}
                  >
                    <SelectTrigger className="w-full h-10 rounded-lg">
                      <SelectValue placeholder={t('products.select-category', 'Select Category')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name_ar} {category.name_en ? `(${category.name_en})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.category_id && formik.errors.category_id && (
                    <InputError message={formik.errors.category_id} />
                  )}
                </div>

                {/* Brand Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="brand_id" className="text-xs font-semibold">
                    {t('products.brand', 'Brand')}
                  </Label>
                  <Select
                    value={formik.values.brand_id}
                    onValueChange={(val) => formik.setFieldValue('brand_id', val)}
                  >
                    <SelectTrigger className="w-full h-10 rounded-lg">
                      <SelectValue placeholder={t('products.select-brand', 'Select Brand (Optional)')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        {t('common.none', 'None')}
                      </SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="supplier_id" className="text-xs font-semibold">
                    {t('products.select-supplier', 'Supplier')}
                  </Label>
                  <Select
                    value={formik.values.supplier_id}
                    onValueChange={(val) => formik.setFieldValue('supplier_id', val)}
                  >
                    <SelectTrigger className="w-full h-10 rounded-lg">
                      <SelectValue placeholder={t('products.select-supplier', 'Select Supplier (Optional)')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        {t('common.none', 'None')}
                      </SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Classification */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      {t('common.product-kind', 'Kind')}
                    </Label>
                    <Select
                      value={formik.values.product_kind}
                      onValueChange={(val: 'physical' | 'digital') =>
                        formik.setFieldValue('product_kind', val)
                      }
                    >
                      <SelectTrigger className="w-full h-9 rounded-lg text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">
                          {t('common.physical-product', 'Physical')}
                        </SelectItem>
                        <SelectItem value="digital">
                          {t('common.digital-product', 'Digital')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      {t('products.product_type', 'Type')}
                    </Label>
                    <Select
                      value={formik.values.product_type}
                      onValueChange={(val: 'simple' | 'variant') =>
                        formik.setFieldValue('product_type', val)
                      }
                    >
                      <SelectTrigger className="w-full h-9 rounded-lg text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">
                          {t('products.simple', 'Simple')}
                        </SelectItem>
                        <SelectItem value="variant">
                          {t('products.variant', 'Variant')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Status & Visibility Flags */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('products.visibility', 'Visibility & Flags')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formik.values.is_active}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue('is_active', Boolean(checked))
                    }
                  />
                  <Label htmlFor="is_active" className="text-xs font-medium cursor-pointer">
                    {t('common.active-status', 'Active & Published')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formik.values.is_featured}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue('is_featured', Boolean(checked))
                    }
                  />
                  <Label htmlFor="is_featured" className="text-xs font-medium cursor-pointer">
                    {t('common.mark-as-featured', 'Mark as Featured')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_popular"
                    checked={formik.values.is_popular}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue('is_popular', Boolean(checked))
                    }
                  />
                  <Label htmlFor="is_popular" className="text-xs font-medium cursor-pointer">
                    {t('common.mark-as-popular', 'Mark as Popular / Trending')}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* 3. Live Summary Card */}
            <Card className="rounded-2xl border-border/80 bg-muted/20 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>{t('products.summery', 'Live Summary')}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {formik.values.stock && Number(formik.values.stock) > 0
                      ? t('common.stockin', 'In Stock')
                      : t('common.stockout', 'Out Of Stock')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('products.title', 'Title')}:</span>
                  <span className="font-semibold text-foreground text-right truncate max-w-[170px]">
                    {formik.values.title || '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('categories.page-title', 'Category')}:</span>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {selectedCategory?.name_ar || '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('brands.name', 'Brand')}:</span>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {selectedBrand?.name || '-'}
                  </span>
                </div>

                <Separator className="my-1" />

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('products.price', 'Price')}:</span>
                  <div className="font-bold text-foreground">
                    {formik.values.sale_price ? (
                      <span className="flex items-center gap-1.5">
                        <span className="line-through text-muted-foreground font-normal">
                          ${formik.values.price}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ${formik.values.sale_price}
                        </span>
                      </span>
                    ) : (
                      <span>${formik.values.price || '0.00'}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('products.stock', 'Stock')}:</span>
                  <span className="font-semibold text-foreground">
                    {formik.values.stock || '0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('products.media', 'Images')}:</span>
                  <span className="font-medium text-foreground">
                    {formik.values.images.length} uploaded
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
