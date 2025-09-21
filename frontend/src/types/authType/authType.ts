export interface IUser {
    _id: string
    name: string,
    email: string,
    phone: string
    role: "admin" | "user";
    profilePic: string
    createdAt: string,
    updatedAt: string,
}

export interface ISignupRequest {
    name: string,
    email: string,
    phone:string
    password: string,
    confirmPassword: string,
}

export interface UpdateUser {
    name?: string,
    email?: string,
    phone?:string,
    profilePic?: File | string,
}

export interface ISignupApiRequest {
    name: string,
    email: string,
    password: string,
}

export interface ILoginRequest {
    email: string,
    password: string
}

export interface AuthResponse {
    status: string,
    token: string,
    user: IUser
}

export interface UsersResponse {
    status: string,
    results: number,
    total: number,
    page: number,
    pages: number,
    users: IUser[]
}