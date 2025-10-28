import React from 'react';
import { Link } from '@inertiajs/react';

export default function SearchResults({ query, products }) {
    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.product_id}
                            href={`/item/${product.product_id}`}
                            className="border rounded-lg p-4 hover:shadow-lg transition"
                        >
                            <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                                <img
                                    src={product.product_image ? `/storage/${product.product_image}` : '/placeholder-image.png'}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                            <h3 className="mt-2 text-lg font-semibold">{product.product_name}</h3>
                            <p className="text-gray-500">₱{Number(product.final_price).toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No products found.</p>
            )}
        </div>
    );
}