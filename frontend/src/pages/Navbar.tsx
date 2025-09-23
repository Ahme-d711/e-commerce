import { Link } from "react-router-dom";
import NavigationMenuDemo from "../lib/radix/Navigation";
import ImageLink from "../lib/radix/imageLink";
import { useAuthStore } from "../store/AuthStore";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/CartStore";

export default function Navbar() {
  const {user} = useAuthStore();
  const {cart} = useCartStore();
  
  return(
    <div className="flex gap-14 justify-between items-center shadow-[0_.1px_4px] shadow-blackA4 p-4">
      <Link to="/" className="flex">
        <svg
          aria-hidden
          width="38"
          height="38"
          viewBox="0 0 25 25"
          fill="white"
        >
          <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
          <path d="M12 0H4V8H12V0Z"></path>
          <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
        </svg>
        <h1 className="text-3xl text-gray-500 flex gap-1">Elgedawy <span className="text-3xl text-rose-500">Market</span></h1>
      </Link>
      {user ? (
        <>
          <NavigationMenuDemo />
          <div className="flex gap-3 items-center min-w-72 justify-end">
            <div className="relative">
              <Link to="/cart">
                <ShoppingCart size={30} className="text-gray-300 cursor-pointer animate-bounce"/>
              </Link>
              <span className="absolute -top-5 text-red-300 rounded-full text-center animate-bounce  px-1.5 border-none -right-2.5">{cart?.items?.length || 0}</span>
            </div>
            <ImageLink />
          </div>
        </>
      ) : (
        <div className="flex gap-4 items-center ml-auto">
          <Link to="/login" className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/20">
            Sign In
          </Link>
          <Link to="/signup" className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  )
}
