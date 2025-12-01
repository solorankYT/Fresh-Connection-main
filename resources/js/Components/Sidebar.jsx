import React, { useState } from 'react';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  TagIcon,
  ComputerDesktopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';

const Sidebar = () => {
  const { auth } = usePage().props;
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = auth?.user?.role === 'admin';
  const isSupplier = auth?.user?.role === 'supplier';

  const navItems = [
    { href: '/',       icon: HomeIcon,            label: 'Home' },
    { href: '/admin/dashboard',          icon: ComputerDesktopIcon, label: 'Dashboard' },
    { href: '/admin/manage-products',    icon: CubeIcon,            label: 'Manage products' },
    { href: '/admin/manage-orders',      icon: ShoppingCartIcon,    label: 'Orders' },
    { href: '/admin/user-management',    icon: UsersIcon,           label: 'User Management' },
    { href: '/admin/promotions',         icon: TagIcon,             label: 'Promotions' },
  ];

  const supplierNavItems = [
  { href: '/admin/manage-products',    icon: CubeIcon,            label: 'Manage products' },
  ];
  
  

  return (
    <div className={`
      pt-16 sidebar shadow-sm bg-white h-screen
      flex flex-col justify-between sticky top-0
      transition-all duration-200
      ${collapsed ? 'w-16' : 'min-w-[250px]'}
    `}>
      {/* Collapse Toggle */}
      <div className="flex justify-end px-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200"
        >
          {collapsed
            ? <ChevronRightIcon className="w-6 h-6" />
            : <ChevronLeftIcon className="w-6 h-6" />
          }
        </button>
      </div>

      <hr className="border-gray-300" />

      {/* Navigation Links */}
      <ul className="flex-grow space-y-2 px-2 py-4">
        {isAdmin && navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center transition-all duration-150
              hover:scale-110 hover:bg-green-900 hover:text-white
              cursor-pointer rounded-sm
              space-x-2 px-4 py-2
            `}
          >
            <Icon className="w-6 h-6" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}

        {isSupplier && supplierNavItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center transition-all duration-150
              hover:scale-110 hover:bg-green-900 hover:text-white
              cursor-pointer rounded-sm
              space-x-2 px-4 py-2
            `}
          >
            <Icon className="w-6 h-6" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </ul>

      <hr className="border-gray-300" />

      {/* Footer / User Info */}
      <div className="px-2 py-4 flex items-center space-x-2">
        <UserCircleIcon className="w-8 h-8 text-gray-500" />
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold whitespace-nowrap">{auth.user.first_name}</div>
            <div className="text-xs text-gray-500 whitespace-nowrap">{auth.user.email}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
