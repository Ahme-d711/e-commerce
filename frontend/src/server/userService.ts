import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {type IUser, type UpdateUser, type UsersResponse } from "../types/authType/authType";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useUsersStore } from "../store/UsersStore";


export const getAllUser = async(page: number): Promise<UsersResponse> => {
  const res = await api.get(`/users?page=${page}`);
  return res.data
}

export const getCurrentUser = async (): Promise<IUser | null> => {
    try {
      const res = await api.get("/users/me");
      return res.data.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return null;
      }
      throw error; 
    }
  }

  export const updateUser = async (id: string, data: FormData | UpdateUser): Promise<IUser> => {
      const res = await api.patch(`/users/${id}`, data,  { headers: { 'Content-Type': 'multipart/form-data' } } );
      return res.data.user;
  }

  export const deleteUser = async(id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  }




export const useGetAllUsers = (page: number) => {
    const {setUsers} = useUsersStore();
    const queryClient = useQueryClient()
  
    const query = useQuery<UsersResponse>({
      queryKey: ["users", page],
      queryFn: () => getAllUser(page),
      staleTime: 5 * 60 * 1000,
    })
    
    useEffect(() => {
      if (query.data) {
        setUsers(query.data.users);
  
        queryClient.prefetchQuery({
          queryKey: ["users", page + 1],
          queryFn: () => getAllUser(page + 1),
        });
      }
    }, [query.data, setUsers, page, queryClient]);
  
  return query;
}

export const useCurrentUserQuery = () => {
  return useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false,
      refetchOnWindowFocus: false,
  });
}

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, FormData | UpdateUser>({
    mutationFn: (data) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });

      toast.success("Your profile has been updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile.");
    }
  });
};

export const useDeleteUser = () => {
  const queryclient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess:() => {
      queryclient.invalidateQueries({queryKey: ["users"]})
      toast.success("The user was deleted successfully.");
    }
  })
}