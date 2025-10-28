import Navbar from '@/resources/js/Components/Navbar';
import Sidebar from '@/resources/js/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { Toaster } from "react-hot-toast";


export default function AppLayout({ children }) {
    const { auth } = usePage().props; // Access the shared auth object

    console.log('Auth:', auth); // Debugging
    console.log('User Role:', auth?.user?.role); // Debugging

    return (
        <div className="min-h-screen bg-gray-100 flex text-gray-800">
            {/* Render Sidebar only if the user's role is admin */}
            {auth?.user?.role === 'admin' && <Sidebar />}
            <div className="flex-grow">
                <Navbar />


                <main className="mt-16 w-full mx-auto bg-gray-50 px-8">{children}</main>

            </div>


            <Toaster position="bottom-right" reverseOrder={false} /> {/* Added Toaster */}
        </div>
    );
}
