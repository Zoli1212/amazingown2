import { ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Menu() {
  return (
    <div className="flex justify-end px-4">
      <nav className="flex gap-6 items-center">
        <Link href="/user" className="flex items-center gap-2">
          <UserIcon className="h-6 w-6" />
          <span className='font-bold'>Sign In</span>
        </Link>
        <Link href="/cart" className="flex items-center gap-2">
          <ShoppingCartIcon className='h-6 w-6'/>
          <span className='font-bold'>Cart</span>
        </Link>
      </nav>
    </div>
  );
}
