import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, LogOut, User, X } from 'lucide-react';
import { useCurrentUserQuery, useUpdateUser } from '../server/userService';
import { useAuthStore } from '../store/AuthStore';
import { useForm } from 'react-hook-form';
import type { UpdateUser } from '../types/authType/authType';
import { cn } from '../lib/utils';
import { useLogoutMutation } from '../server/authService';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
  },
  transition: { duration: 0.6, ease: "easeOut" },
};

const avatarVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0 0 15px var(--color-ring)' },
  tap: { scale: 0.95 },
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState<boolean>(false)
  const { data: user, isLoading, error } = useCurrentUserQuery();
  
  const updateMutation = useUpdateUser(user?._id || '')
  const logoutMutation = useLogoutMutation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate('/login', { replace: true });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error('Logout error:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      },
    });
  };

  const {handleSubmit, register, reset, setValue } = useForm<UpdateUser>({
    defaultValues:{
      name:"",
      email:"",
      phone:"",
      profilePic:"",
    }
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(()=> {
    if(user) {
      reset({
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilePic: user.profilePic,
      })
    }
  },[reset, user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePic", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEdit(true);
    }
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: UpdateUser) => {
    const formData = new FormData();
  
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
  
    if (data.profilePic instanceof File) {
      formData.append("profilePic", data.profilePic);
    }
  
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setEdit(false);
        setPreviewImage(null);
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-[var(--color-foreground)]"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[88vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <div className="bg-[var(--color-card)] p-8 rounded-[var(--radius-lg)] shadow-xl text-center">
          <p className="text-[var(--color-destructive)]">
            Failed to load profile. Please try logging in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center dark py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full relative space-y-8 bg-[var(--color-card)] p-8 rounded-[var(--radius-lg)] shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div
            className="mx-auto w-60 h-60 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center"
            variants={avatarVariants}
            initial="hidden"
            animate="visible"
            onClick={() => {
              fileInputRef.current?.click();
              setEdit(true);
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-60 h-60 rounded-full object-cover"
              />
            ) : user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-60 h-60 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-[var(--color-primary)] animate-pulse" />
            )}
          </motion.div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mt-4">
            {user.name}
          </h1>
          <p className="text-[var(--color-muted-foreground)]">{user.email}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-[var(--color-foreground)]">
              Profile Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
              <div className="">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className='hidden'/>
              </div>
              <div className="text-[var(--color-muted-foreground)]">
                <label className="font-medium mr-1">Name:</label>
                <input type="text" {...register('name')} readOnly={!edit} className='outline-none'/>
              </div>
              <div className="text-[var(--color-muted-foreground)]">
                <label className="font-medium mr-1">Email:</label> 
                <input type="email" {...register('email')} readOnly={!edit}  className='outline-none'/>
              </div>
                <div className="text-[var(--color-muted-foreground)]">
                  <label className="font-medium mr-1">Phone:</label>
                  <input type="text" {...register('phone')} readOnly={!edit} className='outline-none'/>
                </div>
                <button type='submit'  onClick={() => setEdit(false)}  className={cn(
                  'absolute animate-pulse top-3 left-3 text-blue-100 cursor-default hover:text-blue-300 transition-all',
                  !edit && 'hidden'
                  )}>
                    Save
                </button>
              {edit ?
                <div className="">
                  <X className='absolute top-3 right-3' onClick={handleCancelEdit}/>
                </div>
                :
                <button type='submit'  onClick={() => setEdit(true)}  className='absolute animate-pulse top-3 left-3 text-blue-100 cursor-default hover:text-blue-300 transition-all'>
                  <Edit />
                </button>
              }
            </form>
          </div>

          <motion.button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="btn py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
          >
            {logoutMutation.isPending ? (
              <div className="flex items-center">
                <motion.svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-primary-foreground)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </motion.svg>
                Logging out...
              </div>
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </>
            )}
          </motion.button>

          {logoutMutation.isError && (
            <motion.div
              className="bg-[var(--color-destructive)]/20 border border-[var(--color-destructive)] rounded-[var(--radius-md)] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <svg
                  className="h-5 w-5 text-[var(--color-destructive)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-[var(--color-destructive)]">
                    {logoutMutation.error?.message || 'An error occurred during logout'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;