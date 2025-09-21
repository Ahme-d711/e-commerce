// // src/hooks/useSignup.ts
// import { useMutation } from "@tanstack/react-query";
// import { useAuthStore } from "../store/AuthStore";
// import type { AuthResponse, ISignupRequest } from "../types/authType";


// export const useSignup = () => {
//   const setUser = useAuthStore((s) => s.setUser);

//   return useMutation<AuthResponse, any, ISignupRequest>(
//     (data) => signup(data),
//     {
//       onSuccess: (data) => {
//         if (data.user) setUser(data.user);
//       },
//       onError: (err) => {
//         console.error("Signup error:", err);
//       },
//     }
//   );
// };
