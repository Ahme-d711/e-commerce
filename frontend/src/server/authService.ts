import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {type IUser, type ILoginRequest, type ISignupApiRequest} from "../types/authType/authType";
import { useAuthStore } from "../store/AuthStore";
import toast from "react-hot-toast";

export const signup = async (data: ISignupApiRequest): Promise<IUser> => {
    const res = await api.post("/auth/signup", data);
    
    return res.data.user;
}

export const login = async (data: ILoginRequest): Promise<IUser> => {
    const res = await api.post("/auth/login", data);

    return res.data.user;
}

export const logout = async (): Promise<void> => {
    await api.post("/auth/logout")
}


export const useSignupMutation = () => {
    const queryClient = useQueryClient();
    const {setAuth} = useAuthStore();

    return useMutation<IUser, Error, ISignupApiRequest>({
        mutationFn: signup,
        onSuccess: (user) => {
            setAuth(user);

            queryClient.invalidateQueries({queryKey:["currentUser"]})
            toast.success("Account Created")
        }
    })
}

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const {setAuth} = useAuthStore();

    return useMutation<IUser, Error, ILoginRequest>({
        mutationFn: login,
        onSuccess: (user) => {
            setAuth(user);
            toast.success("Login Successfully")
            queryClient.invalidateQueries({queryKey:["currentUser"]})
        }
})}

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const { logout: logoutFromStore } = useAuthStore();
  
    return useMutation<void, Error>({
      mutationFn: logout,
      onSuccess: () => {
        logoutFromStore();
        toast.success("Logout Successfully")
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });
};

