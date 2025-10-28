import AppLayout from '@/resources/js/Layouts/AppLayout';

export default function About() {
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
                        <h2 className="text-3xl md:text-4xl">About</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">The Fresh Connection</h1>
                        <p className="text-md md:text-lg mt-8">
                            Your trusted partner for fresh and quality produce delivered straight to your door.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Content */}
            <section className="max-w-7xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Commitment to Quality</h2>
                <div className="space-y-8 text-gray-700">
                    {/* Product Quality Guarantee */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">I. Product Quality Guarantee</h3>
                        <p>
                            Hello, we are The Fresh Connection—Online Produce Delivery. We are committed to providing the freshest fruits, vegetables, meat, seafood and other produce. All products are carefully selected and packed to ensure quality and freshness upon delivery. If you receive a product that does not meet your expectations, please contact us within 24 hours of delivery with photos for review.
                        </p>
                    </div>

                    {/* Ordering and Availability */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">II. Ordering and Availability</h3>
                        <p>
                            We offer same-day or next-day delivery based on your location and the time your order is placed. Deliveries are processed through batch purchasing to ensure efficiency and freshness. Please note that all items are subject to availability. If a product is marked as out of stock, we recommend checking back later, as it will be restocked soon. Detailed product information—including price, description, available quantity, and expiration date—can be viewed by clicking on the individual product listing.
                        </p>
                    </div>

                    {/* Pricing and Payment */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">III. Pricing and Payment</h3>
                        <p>
                            All product prices are displayed in Philippine Peso (PHP) and may change without prior notice depending on fluctuations in supplier pricing. We accept multiple payment options, including GCash, PayMaya, Bank Transfer, and Cash on Delivery (COD). For advance payments, your order will only be confirmed once we receive and verify your proof of payment to ensure the transaction was successful. If you choose Cash on Delivery (COD), your order will be processed immediately without requiring payment confirmation. Delivery fees are calculated based on your location and will be added to your total during checkout.
                        </p>
                    </div>

                    {/* Delivery Policy */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">IV. Delivery Policy</h3>
                        <p>
                            Our deliveries are scheduled between 9:00 AM and 6:00 PM, from Monday to Saturday. Delivery charges vary depending on your location and will be reflected during checkout. To ensure smooth delivery, please make sure someone is present at the delivery address to receive the order. If our delivery team is unable to complete the drop-off due to an unavailable recipient, additional charges may apply for rescheduling or reattempting the delivery.
                        </p>
                    </div>

                    {/* Returns and Refunds */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">V. Returns and Refunds</h3>
                        <p>
                            As our products are fresh and perishable, we are unable to accept returns once items have been delivered. However, if you receive a product that is damaged, spoiled, or does not meet quality standards, please contact us within 24 hours of delivery and provide clear photo or video evidence of the issue. Upon verification, we will either issue a refund or provide a replacement, depending on the situation. Approved refunds are typically processed within 5 business days through your original payment method.
                        </p>
                    </div>

                    {/* Cancellations of Order */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">VI. Cancellations of Order</h3>
                        <p>
                            You may cancel your order within 2 hours of placing it, provided that it has not yet been marked as dispatched. Once an order is dispatched, cancellations are no longer allowed, as the preparation and delivery process is already underway. This policy helps ensure the quality and freshness of our products, as perishable goods cannot be returned or reused once in transit.
                        </p>
                    </div>

                    {/* Privacy Policy */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">VII. Privacy Policy</h3>
                        <p>
                            At The Fresh Connection, your privacy matters to us. We are committed to protecting your personal data and being transparent about how we collect, use, and safeguard your information when you visit our website or place an order.
                        </p>
                        <div className="space-y-4 mt-4">
                            <h4 className="font-semibold">A. Your Information</h4>
                            <p>
                                When you shop with us, we collect essential personal details to complete your order, keep you updated, and improve your shopping experience. This may include:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>Full Name</li>
                                <li>Email Address</li>
                                <li>Phone Number</li>
                                <li>Shipping Address</li>
                                <li>Payment Information</li>
                            </ul>

                            <h4 className="font-semibold mt-4">B. Purpose of Data Collection</h4>
                            <p>
                                We use the information you provide for the following purposes:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>To process, confirm, and deliver your orders</li>
                                <li>To send order confirmations and shipping updates</li>
                                <li>To respond to your inquiries</li>
                                <li>To share special promotions and updates</li>
                            </ul>

                            <h4 className="font-semibold mt-4">C. Third-Party Sharing</h4>
                            <p>
                                We do not sell your personal information. However, in order to fulfill your orders and maintain operations, we may share your data with:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>Logistic Partners: To ship your orders, we share necessary delivery details like name, address, and contact number</li>
                                <li>Legal Authorities: In certain situations, we may be legally obligated to disclose your information in response to official legal requests, such as court directives, government mandates, or law enforcement inquiries</li>
                            </ul>

                            <h4 className="font-semibold mt-4">D. Data Storage and Retention</h4>
                            <p>
                                To enhance your shopping experience, we securely keep your personal information—like your name, contact details, and order history—in our database. For your safety and privacy, if there's no activity on your account for 12 months, your data will be automatically removed from our system unless legal obligations require us to keep it longer. You can also reach out to our page anytime to request the manual deletion of your information.
                            </p>

                            <h4 className="font-semibold mt-4">E. Your Rights</h4>
                            <p>
                                You have the right to control your personal data. Subject to local laws, you may:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>Request access to your personal information</li>
                                <li>Ask for correction or deletion</li>
                                <li>Object to or limit how we use your data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
