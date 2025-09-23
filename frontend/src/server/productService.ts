import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../lib/api";
import type { Product, ProductRequest, ProductResponse } from "../types/productType/productType";
import { useProductStore } from "../store/ProductStore";
import toast from "react-hot-toast";

export const createProduct = async (data: FormData | ProductRequest): Promise<ProductResponse> => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const res = await api.post("/products", data, isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
  return res.data;
};

export const getAllProducts = async (page: number): Promise<ProductResponse> => {
  const res = await api.get(`/products?page=${page}&limit=12`);
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  // Handle potential API shape variation
  return res.data.product; // Adjust based on actual API response
};

export const updateProduct = async (id: string, data: FormData | ProductRequest): Promise<ProductResponse> => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const res = await api.patch(`/products/${id}`, data, isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const useGetAllProduct = (page: number) => {
  const { setProduct } = useProductStore();
  const queryClient = useQueryClient();

  const query = useQuery<ProductResponse>({
    queryKey: ["products", page],
    queryFn: () => getAllProducts(page),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setProduct(query.data.data);
    }
    queryClient.prefetchQuery({
      queryKey: ["products", page + 1],
      queryFn: () => getAllProducts(page + 1),
    });
  }, [query.data, setProduct, page, queryClient]);

  return query;
};

export const useGetProduct = (id: string | undefined) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, FormData | ProductRequest>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("The product was created successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, FormData | ProductRequest>({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("The product was updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("The product was deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
};