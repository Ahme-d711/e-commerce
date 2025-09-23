import React, { useState } from 'react';
import { motion, easeOut } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useGetAllOrders, useGetOrderStats } from '../server/orderService';
import { useOrderStore } from '../store/OrderStore';
import dayjs from "dayjs";
import { useAuthStore } from '../store/AuthStore';

const tableVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut, staggerChildren: 0.03 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
};


const DashboardOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { isLoading, error, data } = useGetAllOrders(page);
  const { data: statsData, isLoading: statsLoading } = useGetOrderStats();
  const { orders } = useOrderStore();
  useAuthStore();
  
  const items = (data?.data ?? orders ?? []);
  const total = data?.total ?? items.length;
  const totalPages = Math.max(1, Math.ceil(total / 12));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Dashboard / Orders</h1>
        <div className="text-sm text-[var(--color-muted-foreground)]">
          Total Orders: {total}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            label: 'Total Orders',
            value: statsData?.data?.overview?.totalOrders ?? 0,
          },
          {
            label: 'Revenue',
            value: `$${(statsData?.data?.overview?.totalRevenue ?? 0).toFixed ? (statsData?.data?.overview?.totalRevenue ?? 0).toFixed(2) : Number(statsData?.data?.overview?.totalRevenue ?? 0).toFixed(2)}`,
          },
          {
            label: 'Avg Order Value',
            value: `$${(statsData?.data?.overview?.averageOrderValue ?? 0).toFixed ? (statsData?.data?.overview?.averageOrderValue ?? 0).toFixed(2) : Number(statsData?.data?.overview?.averageOrderValue ?? 0).toFixed(2)}`,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4"
          >
            <div className="text-sm text-[var(--color-muted-foreground)]">{card.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--color-foreground)]">
              {statsLoading ? '—' : card.value}
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[var(--color-foreground)]">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
        </div>
      )}

      {error && (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load orders.
        </div>
      )}

      {!isLoading && !error && (
        <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <table className="min-w-full text-sm">
            <thead className="text-left text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <React.Fragment key={order._id}>
                  <motion.tr variants={rowVariants} className="border-t border-[var(--color-border)] hover:bg-[var(--color-muted)]/5">
                    <td className="px-4 py-3 text-[var(--color-foreground)] font-mono text-xs">
                      #{order._id.slice(-8)}
                    </td>
                    {/* <td className="px-4 py-3 text-[var(--color-foreground)]">
                      User ID: {order.user.slice(-8)}
                    </td> */}
                    <td className="px-4 py-3">
                      {typeof order.user === 'object' ? order.user?.email : undefined}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-foreground)] font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)] capitalize">
                      {order.paymentMethod || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
                      {dayjs(order.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleOrderDetails(order._id)}
                          className="inline-flex items-center gap-1 text-[var(--color-foreground)] hover:opacity-80 text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          {expandedOrder === order._id ? 'Hide' : 'View'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  
                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[var(--color-border)]"
                    >
                      <td colSpan={7} className="px-4 py-4 bg-[var(--color-muted)]/5">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-[var(--color-foreground)] mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex items-center gap-3 p-2 bg-[var(--color-card)] rounded border">
                                    <img 
                                      src={item.product.imageUrl || 'https://cdn-icons-png.freepik.com/256/15980/15980207.png?semt=ais_white_label'} 
                                      alt={item.product.name}
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-[var(--color-foreground)]">{item.product.name}</p>
                                      <p className="text-xs text-[var(--color-muted-foreground)]">
                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="text-sm font-semibold text-[var(--color-foreground)]">
                                      ${(item.quantity * item.price).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-[var(--color-foreground)] mb-2">Shipping Address</h4>
                              {order.shippingAddress ? (
                                <div className="p-3 bg-[var(--color-card)] rounded border text-sm">
                                  <p>{order.shippingAddress.address}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                  <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                                </div>
                              ) : (
                                <p className="text-[var(--color-muted-foreground)] text-sm">No shipping address provided</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
                            <div className="text-sm text-[var(--color-muted-foreground)]">
                              Order placed: {dayjs(order.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                            </div>
                            <div className="text-sm text-[var(--color-muted-foreground)]">
                              Last updated: {dayjs(order.updatedAt).format("MMM DD, YYYY [at] h:mm A")}
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {items.length === 0 && (
            <div className="text-center text-[var(--color-muted-foreground)] py-8">No orders found.</div>
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
      )}
    </div>
  );
};

export default DashboardOrders;
