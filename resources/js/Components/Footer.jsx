const Footer = () => {
    return (
        <footer className="bg-white py-10 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start">

                {/* Left Section - Logo & Description */}
                <div className="w-2/5 mb-6 pr-6 md:mb-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-500"></div> {/* Placeholder for Logo */}
                        <h2 className="text-lg font-semibold ml-3">The Fresh <br /><span className="text-2xl font-bold">Connection</span></h2>
                    </div>
                    <p className="text-gray-700 text-sm mt-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Middle Section - Links */}
                <div className="w-3/5 pl-6 flex justify-between">
                    {/* Explore Section */}
                    <div className="w-1/3">
                        <h3 className="font-bold mb-2">Explore</h3>
                        <ul className="text-gray-700 text-sm space-y-1">
                            <li>Lorem</li>
                            <li>Ipsum</li>
                            <li>Dolor</li>
                            <li>Sit</li>
                            <li>Amet</li>
                            <li>Consectetur</li>
                        </ul>
                    </div>

                    {/* Information Section */}
                    <div className="w-1/3">
                        <h3 className="font-bold mb-2">Information</h3>
                        <ul className="text-gray-700 text-sm space-y-1">
                            <li>Adipiscing</li>
                            <li>Elt</li>
                            <li>Sed</li>
                            <li>Do eiusmod</li>
                            <li>Tempor</li>
                            <li>Incididunt</li>
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div className="w-1/3">
                        <h3 className="font-bold mb-2">Contact Us</h3>
                        <ul className="text-gray-700 text-sm space-y-1">
                            <li>Ut labore</li>
                            <li>Et dolore</li>
                            <li>Magna</li>
                            <li>Aliqua</li>
                        </ul>
                    </div>
                </div>




            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-gray-400 mt-8 pt-4 text-center text-gray-700 text-sm">
                © 2025, The Fresh Connection
            </div>
        </footer>
    );
};

export default Footer;
