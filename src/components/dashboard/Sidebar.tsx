"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, Settings, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <User size={20} /> },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings size={20} />,
  },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch {
      // Optionally handle error
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden p-2">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="inline-flex items-center gap-2 p-2 rounded bg-card border border-border shadow-sm">
              <Menu size={20} />
              <span>Menu</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 z-50 flex flex-col gap-4">
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-xl">×</button>
              </Dialog.Close>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6">
                <Button variant="outline" className="w-full flex items-center gap-2 justify-center" onClick={handleSignOut}>
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-background border-r border-gray-200 dark:border-app text-gray-900 dark:text-text-primary  dark:text-app min-h-screen p-4">
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-surface-light transition-colors text-gray-900 dark:text-text-primary dark:text-app"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <Button variant="outline" className="w-full flex items-center gap-2 justify-center" onClick={handleSignOut}>
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
