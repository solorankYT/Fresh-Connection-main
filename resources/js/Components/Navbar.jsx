import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
    const { auth } = usePage().props; // Get authentication info from Inertia
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isUser = auth?.user?.role !== 'supplier' && auth?.user?.role !== 'admin';
    

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white border-b-1 border-gray-200 fixed w-full top-0 left-0 z-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div>
                        <Link href="/" className="text-2xl font-bold text-green-900">
                            Fresh Connection
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {isUser && (
                    <div className="hidden md:flex space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 inline-block rounded-sm px-4 py-1.5 text-sm leading-normal border border-transparent hover:border-gray-300  transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-gray-700 inline-block rounded-sm px-4 py-1.5 text-sm leading-normal border border-transparent hover:border-gray-300  transition-all"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 inline-block rounded-sm px-4 py-1.5 text-sm leading-normal border border-transparent hover:border-gray-300  transition-all"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 inline-block rounded-sm px-4 py-1.5 text-sm leading-normal border border-transparent hover:border-gray-300  transition-all"
                        >
                            Contact
                        </Link>
                    </div>
                    )}

                    {/* Right Section - Account Dropdown & Cart */}
                    <div className="hidden md:flex space-x-4 items-center">
                        {auth.user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="text-gray-700 hover:text-green-900 focus:outline-none flex items-center"
                                >
                                    Account ⏷
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                                        <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all">
                                            Profile
                                        </Link>
                                        <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-all">
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="text-gray-700 hover:text-green-900 transition-all">
                                Login
                            </Link>
                        )}
                        <Link href="/cart" className="text-gray-700 hover:text-green-900 transition-all">
                            Cart 🛒
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && isUser &&(
                <div className="md:hidden bg-white shadow-md p-4">
                    <Link href="/" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                        Home
                    </Link>
                    <Link href="/products" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                        Products
                    </Link>
                    <Link href="/about" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                        About Us
                    </Link>
                    <Link href="/contact" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                        Contact
                    </Link>
                    
                    {auth.user ? (
                        <>
                            <Link href="/profile" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                                Profile
                            </Link>
                            <Link href="/logout" method="post" as="button" className="block py-2 text-red-600 hover:bg-gray-100 transition-all w-full text-left">
                                Logout
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                            Login
                        </Link>
                    )}

                    <Link href="/cart" className="block py-2 text-gray-700 hover:text-green-900 transition-all">
                        Cart 🛒
                    </Link>
                </div>
            )}
        </nav>
    );
}
