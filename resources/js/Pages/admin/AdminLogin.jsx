import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login'); // Inertia handles the request and redirection
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="max-w-md w-full bg-white p-4 border border-gray-300 shadow-sm rounded-lg">
                    <p className="text-xs">The Fresh Connection</p>
                    <div className="m-4 p-8">
                        <h3 className="font-bold text-green-900">Welcome to The Fresh Connection</h3>
                        <p className="font-light">Login to Continue</p>

                        {/* form */}
                        <div>
                            <form className="mt-4" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-900 focus:border-green-900"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-900 focus:border-green-900"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                <button
                                    type="submit"
                                    className="w-full mt-4 bg-green-900 text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:ring-offset-2 cursor-pointer"
                                    disabled={processing}
                                >
                                    {processing ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
