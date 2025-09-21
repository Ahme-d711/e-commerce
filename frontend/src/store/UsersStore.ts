// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/authType/authType';

interface AuthState {
  users: IUser[] | [];
  setUsers: (user: IUser[]) => void;
}

export const useUsersStore = create<AuthState>()(
  persist(
    (set) => ({
      users:[],
      setUsers: (users) => set({ users }),
    }),
    {
      name: 'auth-storage',
    }
  )
);