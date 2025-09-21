import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productRequestSchema, type ProductInput } from '../types/productType/productSchema';
import { useCreateProduct } from '../server/productService';
import { Image, X } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

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

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) setPreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: ProductInput) => {
    // Prepare multipart form data to support optional image file
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('category', data.category);
    formData.append('countInStock', String(data.countInStock));
    if (data.image && data.image instanceof FileList && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    
    console.log(formData);
    
    // Cast to any to align with current mutation typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createMutation.mutate(formData as any, {
      onSuccess: () => {
        reset();
        navigate('/products', { replace: true });
      }
    });
  };

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
        <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Create Product</h1>

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
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Image</label>
          <div className="flex gap-3 items-center">
          <Image size={30} onClick={() => fileInputRef.current?.click()} className='cursor-pointer'/>
          <input
            type="file"
            ref={(el) => { imageInputRef(el); fileInputRef.current = el; }}
            accept="image/*"
            className="hidden"
            onChange={(e) => { rhfImageOnChange(e); handleInputFile(e); }}
            {...imageField}
            />
            {preview && (
              <div className="relative w-16 h-16">
                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
        </div>
          {errors.image && <p className="text-[var(--color-destructive)] text-sm mt-1">{errors.image.message as string}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting || createMutation.isPending}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="btn py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create Product'}
        </motion.button>

        {createMutation.isError && (
          <div className="bg-[var(--color-destructive)]/20 border border-[var(--color-destructive)] rounded-[var(--radius-md)] p-3 text-[var(--color-destructive)]">
            {(createMutation.error as Error)?.message || 'Failed to create product'}
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default CreateProduct;


