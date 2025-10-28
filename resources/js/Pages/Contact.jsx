import AppLayout from '@/resources/js/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function Contact() {
    return (
        <AppLayout>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white flex flex-col md:grid md:grid-cols-2 items-center"
                style={{ backgroundImage: "url('/images/hero_section_bg.avif')" }}
            >
                <div className="absolute inset-0 bg-black opacity-35"></div>

                {/* Left side content */}
                <div className="relative px-8 md:px-16 py-12 h-auto md:h-[360px] flex flex-col justify-center">
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl">Contact</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">The Fresh Connection</h1>
                        <p className="text-md md:text-lg mt-8">
                            Your trusted partner for fresh and quality produce delivered straight to your door.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-4xl mx-auto py-16 px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h2>

                <div className="bg-white rounded-lg shadow-lg p-8 text-left">
                    <p className="text-gray-700 mb-4">
                        If you have any concerns regarding the Privacy Policy, you can reach us through the following:
                    </p>

                    <ul className="text-gray-800 space-y-3">
                        <li>
                            <strong>Email:</strong> <a href="mailto:thefreshconnectionopd@gmail.com" className="text-green-700 hover:underline">thefreshconnectionopd@gmail.com</a>
                        </li>
                        <li>
                            <strong>Address:</strong> Trinity University of Asia
                        </li>
                        <li>
                            <strong>Phone:</strong> <a href="tel:09123456789" className="text-green-700 hover:underline">0912 345 6789</a>
                        </li>
                    </ul>
                </div>
            </section>
        </AppLayout>
    );
}
