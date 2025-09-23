import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, easeOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createOrderSchema, type CreateOrderInput } from '../types/orderType/orderSchema';
import { useCreateOrder } from '../server/orderService';
import { useCartStore } from '../store/CartStore';
import { useClearCart } from '../server/cartService';
import toast from 'react-hot-toast';

const containerVariants = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: easeOut 
    } 
  } 
};

const buttonVariants = { 
  hover: { scale: 1.05 }, 
  tap: { scale: 0.95 } 
};

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const createMutation = useCreateOrder();
  const clearCart = useClearCart();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      paymentMethod: 'cod',
      shippingAddress: {
        address: '',
        city: '',
        country: '',
        postalCode: '',
      }
    }
  });

  const onSubmit = (data: CreateOrderInput) => {
    const orderItems = (cart?.items ?? []).map(i => ({
      product: typeof i.product === 'string' ? i.product : i.product._id,
      quantity: i.quantity,
    }));

    if (orderItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    const orderData = {
      orderItems,
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
    };

    createMutation.mutate(orderData, {
      onSuccess: () => {
        toast.success('Order placed successfully');
        navigate(`/orders/my-orders`, { replace: true });
        clearCart.mutate();
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to create order');
      }
    });
  };

  const totalPrice = cart?.totalPrice ?? 0;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg space-y-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Checkout</h2>

      <div>
        <label className="block mb-1 text-sm text-[var(--color-foreground)]">Address</label>
        <input 
          className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" 
          {...register('shippingAddress.address')} 
        />
        {errors.shippingAddress?.address && (
          <p className="text-[var(--color-destructive)] text-sm mt-1">
            {errors.shippingAddress.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">City</label>
          <input 
            className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" 
            {...register('shippingAddress.city')} 
          />
          {errors.shippingAddress?.city && (
            <p className="text-[var(--color-destructive)] text-sm mt-1">
              {errors.shippingAddress.city.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm text-[var(--color-foreground)]">Country</label>
          <input 
            className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" 
            {...register('shippingAddress.country')} 
          />
          {errors.shippingAddress?.country && (
            <p className="text-[var(--color-destructive)] text-sm mt-1">
              {errors.shippingAddress.country.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm text-[var(--color-foreground)]">Postal Code</label>
        <input 
          className="input py-1.5 px-4 input-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" 
          {...register('shippingAddress.postalCode')} 
        />
        {errors.shippingAddress?.postalCode && (
          <p className="text-[var(--color-destructive)] text-sm mt-1">
            {errors.shippingAddress.postalCode.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm text-[var(--color-foreground)]">Payment Method</label>
        <select 
          className="select py-1.5 px-4 select-bordered w-full bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)]" 
          {...register('paymentMethod')}
        >
            <option 
              className='bg-[var(--color-card)]/80 rounded-2xl' 
              value="paypal"
            >
              PAYPAL
            </option>
        </select>
        {errors.paymentMethod && (
          <p className="text-[var(--color-destructive)] text-sm mt-1">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <div className="text-[var(--color-muted-foreground)]">Total</div>
        <div className="text-[var(--color-foreground)] font-bold">${totalPrice.toFixed(2)}</div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting || createMutation.isPending}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="btn py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting || createMutation.isPending ? 'Placing Order...' : 'Place Order'}
      </motion.button>
    </motion.form>
  );
};

export default OrderForm;


