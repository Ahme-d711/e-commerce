import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, easeOut } from 'framer-motion';
import dayjs from 'dayjs';
import { useGetMyOrders } from '../server/orderService';

const tableVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut, staggerChildren: 0.03 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
};

const MyOrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { isLoading, isError, data } = useGetMyOrders(page);

  const items = data?.data ?? [];
  const total = data?.total ?? items.length;
  const perPage = (data?.results ?? items.length) || 1;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[var(--color-foreground)]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load orders.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">My Orders</h1>
      </div>

      <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
        <table className="min-w-full text-sm">
          <thead className="text-left text-[var(--color-muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <motion.tr key={o._id} variants={rowVariants} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3 text-[var(--color-foreground)]">#{o._id.slice(-8)}</td>
                <td className="px-4 py-3 text-[var(--color-foreground)]">{o.orderItems?.length || 0}</td>
                <td className="px-4 py-3 text-[var(--color-foreground)]">${o.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded bg-[var(--color-muted)] text-[var(--color-foreground)] text-xs capitalize">{o.status}</span></td>
                <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{dayjs(o.createdAt).format('DD/MM/YYYY')}</td>
                <td className="px-4 py-3">
                  <Link to={`/orders/${o._id}`} className="text-[var(--color-primary)] hover:underline">View</Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center text-[var(--color-muted-foreground)] py-8">You have no orders.</div>
        )}

        {items.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] text-[var(--color-muted-foreground)]">
            <div>
              Page {page} / {totalPages} · Total: {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
              >
                Prev
              </button>
              <button
                className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyOrderPage;


