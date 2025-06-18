import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
// import AdminSearch from '@/components/admin/admin-search';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <header className="w-full border-b">
        <div className="wrapper flex-between">
          <div className="flex-start">
            <Link href="/" className="flex-start">
              <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                height={48}
                width={48}
                priority={true}
              />
              <span className="hidden lg:block font-bold text-2xl ml-3">
                {APP_NAME}
              </span>
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              <Input
                type="search"
                placeholder="Search..."
                className="md:w-[100px] lg:w-[300px] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          </div>
          <Menu />
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}
