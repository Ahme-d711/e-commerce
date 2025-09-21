import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { productRequestSchema, type ProductInput } from '../types/productType/productSchema';
import { useGetProduct, useUpdateProduct } from '../server/productService';
import { Image, X } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProduct(id || undefined);
  const updateMutation = useUpdateProduct(id || '');

  const [preview, setPreview] = useState<string | null>(null)


  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ProductInput>({
    resolver: zodResolver(productRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      countInStock: 0,
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: imageInputRef, onChange: rhfImageOnChange, ...imageField } = register('image');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        category: product.category,
        countInStock: product.countInStock,
      });
    }
  }, [product, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);


  const onSubmit = (data: ProductInput) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('category', data.category);
    formData.append('countInStock', String(data.countInStock));
    // Optional new image
    if (data.image && data.image instanceof FileList && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate(`/products/${id}`, { replace: true });
      }
    });
  };

  if (!id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Missing product id.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[var(--color-foreground)]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load product.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[var(--color-background)] dark flex items-center justify-center px-4 py-10">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Edit Product</h1>

        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Name</label>
          <input className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" {...register('name')} />
          {errors.name && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Description</label>
          <textarea className="textarea py-1.5 px-4 textarea-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" rows={4} {...register('description')} />
          {errors.description && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.description.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-[var(--color-foreground)]">Price</label>
            <input type="number" step="0.01" className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm text-[var(--color-foreground)]">Count In Stock</label>
            <input type="number" className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" {...register('countInStock', { valueAsNumber: true })} />
            {errors.countInStock && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.countInStock.message}</p>}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Category</label>
          <input className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" {...register('category')} />
          {errors.category && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Replace Image</label>
          <Image onClick={() => fileInputRef.current?.click()}/>
          <input
            type="file"
            accept="image/*"
            className="file-input py-1.5 px-4 file-input-bordered w-full hidden"
            ref={(el) => { imageInputRef(el); fileInputRef.current = el; }}
            onChange={(e) => { rhfImageOnChange(e); handleFileChange(e); }}
            {...imageField}
          />
          {preview && (
            <div className="relative mt-3 inline-block">
              <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label="Remove image preview"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting || updateMutation.isPending}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="btn py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </motion.button>

        {updateMutation.isError && (
          <div className="bg-[var(--color-destructive)]/20 border border-[var(--color-destructive)] rounded-[var(--radius-md)] p-3 text-[var(--color-destructive)]">
            {(updateMutation.error as Error)?.message || 'Failed to update product'}
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default EditProduct;


