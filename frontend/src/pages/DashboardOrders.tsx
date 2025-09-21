// import React, { useState } from 'react';
// import { motion, easeOut } from 'framer-motion';
// import dayjs from 'dayjs';
// import { useGetAllOrders, useGetOrderStats, useUpdateOrderStatus } from '../server/orderService';
// import { type OrderStatus } from '../types/orderType/orderTypes';
// import toast from 'react-hot-toast';


// const tableVariants = {
//   hidden: { opacity: 0, y: 12 },
//   visible: { 
//     opacity: 1, 
//     y: 0, 
//     transition: { 
//       duration: 0.35, 
//       ease: easeOut
//     },
//     staggerChildren: 0.03
//   },
// };

// const rowVariants = {
//   hidden: { opacity: 0, y: 6 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
// };

// const statusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   paid: 'bg-blue-100 text-blue-800',
//   processing: 'bg-purple-100 text-purple-800',
//   shipped: 'bg-indigo-100 text-indigo-800',
//   delivered: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800',
// };

// const DashboardOrders: React.FC = () => {
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
//   const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  
//   const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useGetAllOrders(page);
//   const { data: statsData, isLoading: statsLoading } = useGetOrderStats();
//   const { mutate: updateOrderStatus } = useUpdateOrderStatus();

//   const orders = ordersData?.data ?? [];
//   const total = ordersData?.total ?? 0;
//   const perPage = ordersData?.results ?? 10;
//   const totalPages = Math.max(1, Math.ceil(total / perPage));
//   const canPrev = page > 1;
//   const canNext = page < totalPages;

//   const stats = statsData?.data?.overview;

//   const handleStatusUpdate = (orderId: string, currentStatus: OrderStatus) => {
//     setSelectedOrder(orderId);
//     setNewStatus(currentStatus);
//   };

//   const confirmStatusUpdate = () => {
//     if (!selectedOrder) return;
    
//     updateOrderStatus(
//       { id: selectedOrder, status: newStatus },
//       {
//         onSuccess: () => {
//           toast.success('Order status updated successfully');
//           setSelectedOrder(null);
//         },
//         onError: () => {
//           toast.error('Failed to update order status');
//         },
//       }
//     );
//   };

//   if (ordersLoading || statsLoading) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center">
//         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[var(--color-foreground)]">
//           <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//           </svg>
//         </motion.div>
//       </div>
//     );
//   }

//   if (ordersError) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center">
//         <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
//           Failed to load orders.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Orders Dashboard</h1>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
//           >
//             <div className="text-sm text-[var(--color-muted-foreground)]">Total Orders</div>
//             <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.totalOrders}</div>
//           </motion.div>
          
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
//           >
//             <div className="text-sm text-[var(--color-muted-foreground)]">Total Revenue</div>
//             <div className="text-2xl font-bold text-[var(--color-foreground)]">${stats.totalRevenue?.toFixed(2) || '0.00'}</div>
//           </motion.div>
          
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
//           >
//             <div className="text-sm text-[var(--color-muted-foreground)]">Average Order Value</div>
//             <div className="text-2xl font-bold text-[var(--color-foreground)]">${stats.averageOrderValue?.toFixed(2) || '0.00'}</div>
//           </motion.div>
          
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
//           >
//             <div className="text-sm text-[var(--color-muted-foreground)]">Delivered Orders</div>
//             <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.deliveredOrders}</div>
//           </motion.div>
//         </div>
//       )}

//       {/* Orders Table */}
//       <motion.div
//         variants={tableVariants}
//         initial="hidden"
//         animate="visible"
//         className="overflow-x-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
//       >
//         <table className="min-w-full text-sm">
//           <thead className="text-left text-[var(--color-muted-foreground)]">
//             <tr>
//               <th className="px-4 py-3">Order ID</th>
//               <th className="px-4 py-3">Customer</th>
//               <th className="px-4 py-3">Items</th>
//               <th className="px-4 py-3">Total</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Created</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <motion.tr key={order._id} variants={rowVariants} className="border-t border-[var(--color-border)]">
//                 <td className="px-4 py-3 text-[var(--color-foreground)]">#{order._id.slice(-8)}</td>
//                 <td className="px-4 py-3 text-[var(--color-foreground)]">
//                   {typeof order.user === 'object' && order.user && 'name' in order.user ? (order.user as { name: string }).name : 'Unknown'}
//                 </td>
//                 <td className="px-4 py-3 text-[var(--color-foreground)]">{order.orderItems?.length || 0}</td>
//                 <td className="px-4 py-3 text-[var(--color-foreground)]">${order.totalPrice.toFixed(2)}</td>
//                 <td className="px-4 py-3">
//                   <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${statusColors[order.status]}`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
//                   {dayjs(order.createdAt).format('DD/MM/YYYY')}
//                 </td>
//                 <td className="px-4 py-3">
//                   <button
//                     onClick={() => handleStatusUpdate(order._id, order.status)}
//                     className="text-[var(--color-primary)] hover:underline text-sm"
//                     disabled={updateOrderStatus.isPending}
//                   >
//                     Update Status
//                   </button>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>

//         {orders.length === 0 && (
//           <div className="text-center text-[var(--color-muted-foreground)] py-8">No orders found.</div>
//         )}

//         {orders.length > 0 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] text-[var(--color-muted-foreground)]">
//             <div>
//               Page {page} / {totalPages} · Total: {total}
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={!canPrev}
//               >
//                 Prev
//               </button>
//               <button
//                 className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={!canNext}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </motion.div>

//       {/* Status Update Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 w-full max-w-md mx-4">
//             <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
//               Update Order Status
//             </h3>
//             <div className="mb-4">
//               <label className="block text-sm text-[var(--color-muted-foreground)] mb-2">
//                 New Status
//               </label>
//               <select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
//                 className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-background)] text-[var(--color-foreground)]"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="px-4 py-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
//                 disabled={updateOrderStatus.isPending}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmStatusUpdate}
//                 className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50"
//                 disabled={updateOrderStatus.isPending}
//               >
//                 {updateOrderStatus.isPending ? 'Updating...' : 'Update'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardOrders;
