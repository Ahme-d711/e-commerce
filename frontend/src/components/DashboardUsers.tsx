import React, { useState } from 'react';
import { motion, easeOut } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import dayjs from "dayjs";
import { useDeleteUser, useGetAllUsers } from '../server/userService';
import { useUsersStore } from '../store/UsersStore';


const tableVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut, staggerChildren: 0.03 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
};

const DashboardUsers: React.FC = () => {
  const [page, setPage] = useState(1)
  const { isLoading, error, data } = useGetAllUsers(page);
  const deleteMutation = useDeleteUser();
  const { users } = useUsersStore();
  const items = (data?.users ?? users ?? []);
  const total = data?.total ?? items.length;
  const perPage = (data?.results ?? items.length) || 1;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = data?.pages ?? totalPages;
  const canPrev = page > 1;
  
  const canNext = page < pages;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Dashboard / Users</h1>
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
          Failed to load Users.
        </div>
      )}

      {!isLoading && !error && (
        <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <table className="min-w-full text-sm">
            <thead className="text-left text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <motion.tr key={p._id} variants={rowVariants} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 flex gap-3 items-center text-[var(--color-foreground)]">
                    <img src={p.profilePic || 'https://cdn-icons-png.freepik.com/256/15980/15980207.png?semt=ais_white_label'} alt={p.name} className="w-16 h-16 rounded-full object-cover" />
                    <span className="line-clamp-2 leading-snug">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{p.email}</td>
                  <td className="px-4 py-3 text-[var(--color-foreground)]">{p.phone}</td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{dayjs(p.updatedAt).format("DD/MM/YYYY")}</td>
                  <td className="px-4 py-3 text-[var(--color-foreground)]">{p.role}</td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{dayjs(p.createdAt).format("DD/MM/YYYY")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      {/* <Link to={`/products/${p._id}/edit-product`} className="inline-flex items-center gap-2 text-[var(--color-foreground)] hover:opacity-80">
                        <Pencil className="w-4 h-4" /> Edit
                      </Link> */}
                      <button onClick={() => deleteMutation.mutate(p._id)} className="inline-flex items-center gap-2 text-[var(--color-destructive)] hover:opacity-80">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center text-[var(--color-muted-foreground)] py-8">No products found.</div>
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

export default DashboardUsers;


