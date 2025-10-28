import { useState, useRef, useEffect } from 'react'; // Import useRef
import AppLayout from '@/resources/js/Layouts/AppLayout';
import { PencilSquareIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { router as Inertia, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import Footer from '../Components/Footer';
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { QRCodeSVG } from 'qrcode.react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Profile({
    user,
    flash,
    orders = [], // Add default value
    products = [], // Add default value
    qrCodeUrl: initialQrCodeUrl
}) {
    const [showVerification, setShowVerification] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCodeUrl || null);
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [editingSection, setEditingSection] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        country: user.country || '',
        postal_code: user.postal_code || '',
        city: user.city || '',
        state: user.state || '',
        barangay: user.barangay || '',
        street_address: user.street_address || '',
        user_image: user.user_image || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [showLoginHistory, setShowLoginHistory] = useState(false);
    const [loginHistory, setLoginHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const fileInputRef = useRef(null); // Create a ref for the file input

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['phone_number', 'postal_code'].includes(name) ? String(value) : value,
        });
    };

    const handleSave = () => {
        const updatedFormData = new FormData();

        if (editingSection === 'security') {
            ['current_password', 'new_password', 'new_password_confirmation'].forEach(key => {
                if (formData[key]) {
                    updatedFormData.append(key, formData[key]);
                }
            });

            // Use a different endpoint for password updates
            Inertia.post('/profile/password', updatedFormData, {
                onSuccess: () => {
                    setEditingSection(null);
                    setFormData({
                        ...formData,
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: ''
                    });
                    toast.success('Password updated successfully!');
                },
                onError: (errors) => {
                    console.error('Error updating password:', errors);
                    toast.error(errors.message || 'Failed to update password');
                }
            });
            return;
        }

        // Only include relevant fields based on which section is being edited
        if (editingSection === 'personal_info') {
            // Include only personal info fields
            ['first_name', 'last_name', 'email', 'phone_number'].forEach(key => {
                updatedFormData.append(key, formData[key]);
            });
        } else if (editingSection === 'address_details') {
            // Include only address fields
            ['country', 'postal_code', 'city', 'state', 'street_address', 'barangay'].forEach(key => {
                updatedFormData.append(key, formData[key]);
            });
        }

        Inertia.post('/profile', updatedFormData, {
            onSuccess: () => {
                setEditingSection(null);
                toast.success('Profile updated successfully!');
            },
            onError: (errors) => {
                console.error('Error updating profile:', errors);
                toast.error('Failed to update profile');
            },
            forceFormData: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-HTTP-Method-Override': 'PUT'
            },
        });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.[0]) {
                setFormData({
                    ...formData,
                    user_image: acceptedFiles[0],
                });
                setEditingSection('user_image');
            }
        },
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/jpg": [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleSaveProfileImage = () => {
        if (!formData.user_image || !(formData.user_image instanceof File)) {
            console.error('Invalid user_image file');
            return;
        }

        const updatedFormData = new FormData();
        updatedFormData.append('user_image', formData.user_image);

        Inertia.post('/profile', updatedFormData, {
            onSuccess: () => [setEditingSection(null),
            toast.success('Profile image updated successfully!'),
            ],
            onError: (errors) => console.error('Error updating profile image:', errors),
            forceFormData: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-HTTP-Method-Override': 'PUT'
            },
        });
    };

    const getImageUrl = () => {
        if (formData.user_image instanceof File) {
            return URL.createObjectURL(formData.user_image);
        }
        return user.user_image ? `/storage/${user.user_image}` : '/placeholder-image.png';
    };

    // Update the ordersWithImages constant with null checking
    const ordersWithImages = (orders || []).map(order => ({
        ...order,
        images: order.order_items.map(item => {
            const product = products?.find(product => product?.product_id === item.product_id);
            return product && product.product_image
                ? `/storage/${product.product_image}`
                : '/placeholder-image.png';
        }),
    }));

    const filteredOrders = selectedStatus === 'All'
        ? ordersWithImages
        : ordersWithImages.filter(order => {
            const statusToMatch = selectedStatus.toLowerCase();
            return order.status.toLowerCase() === statusToMatch;
        });

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const handleToggle2FA = () => {
        Inertia.post('/profile/2fa', {
            enable: !user.two_factor_enabled
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                console.log('2FA Response:', response); // Debug response

                if (!user.two_factor_enabled) {
                    // Try to get QR code URL from different possible locations
                    const qrCodeUrl = response?.props?.qrCodeUrl ||
                        response?.props?.flash?.qrCodeUrl ||
                        response?.qrCodeUrl;

                    if (qrCodeUrl) {
                        console.log('Setting QR Code URL:', qrCodeUrl); // Debug QR code
                        setQrCodeUrl(qrCodeUrl);
                        setShowVerification(true);
                    } else {
                        console.error('No QR code URL found in response');
                    }
                } else {
                    setShowVerification(false);
                    setQrCodeUrl(null);
                }

                // Handle success message
                const message = response?.props?.flash?.message ||
                    response?.props?.message ||
                    'Two-factor authentication status updated';
                toast.success(message);
            },
            onError: (errors) => {
                toast.error('Failed to update 2FA settings');
                console.error('2FA Error:', errors);
            }
        });
    };

    const handleVerification = () => {
        Inertia.post('/profile/2fa/verify', {
            code: verificationCode
        }, {
            preserveScroll: true,
            preserveState: true, // Add this to prevent page reload
            onSuccess: (response) => {
                if (response.props.flash?.error) {
                    setError(response.props.flash.error);
                    setVerificationCode('');
                    return;
                }

                if (response.props.user.two_factor_enabled) {
                    setShowVerification(false);
                    setVerificationCode('');
                    toast.success('2FA has been enabled');

                    if (response.props.flash?.recoveryCodes) {
                        console.log('Recovery codes:', response.props.flash.recoveryCodes);
                    }
                }
            },
            onError: (errors) => {
                setError(errors.message || 'Invalid verification code');
                setVerificationCode('');
            }
        });
    };

    // Check props
    console.log('Component props:', { user, flash, qrCodeUrl });

    const fetchLoginHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await fetch('/profile/login-history');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setLoginHistory(data);
        } catch (error) {
            console.error('Error fetching login history:', error);
            toast.error('Failed to load login history');
            setLoginHistory([]); // Set empty array on error
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (showLoginHistory) {
            fetchLoginHistory();
        }
    }, [showLoginHistory]);

    return (
        <AppLayout>
            <div className='lg:flex mt-16 p-4 gap-4 items-start'>
                {/* Profile section */}
                <div className='px-4 py-2 lg:w-1/3 w-full'>
                    {flash?.message && <div className="mb-4 text-green-600">{flash.message}</div>}
                    <div className='flex p-4 rounded-lg border border-gray-300 items-center'>
                        <div
                            className='relative h-24 w-24 rounded-full border bg-white group'
                            {...getRootProps()}
                        >
                            <img
                                src={getImageUrl()}
                                alt="Profile"
                                className='h-full w-full rounded-full object-cover'
                            />
                            <input {...getInputProps()} ref={fileInputRef} /> {/* Use the ref here */}
                            {/* Icon overlay */}
                            <div
                                className="absolute bottom-0 right-0 bg-white p-1 rounded-full border cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the Dropzone
                                    if (editingSection === 'user_image') {
                                        handleSaveProfileImage(); // Save the profile image
                                    } else {
                                        setEditingSection('user_image'); // Enable editing mode
                                        fileInputRef.current.click(); // Trigger file input using the ref
                                    }
                                }}
                            >
                                {editingSection === 'user_image' ? (
                                    <CheckIcon className="h-4 w-4 text-green-700" />
                                ) : (
                                    <PencilIcon className="h-4 w-4 text-gray-700" />
                                )}
                            </div>
                        </div>
                        <div className='px-4 py-2'>
                            <p className='font-bold'>{formData.first_name} {formData.last_name}</p>
                            <p>{user.role}</p>
                            <p className='font-light'>{formData.city || '---'},{formData.state || '---'}</p>
                        </div>
                    </div>
                    <div className='mt-4 border border-gray-300 rounded-lg px-4 py-2'>
                        <div className='flex items-center pb-2'>
                            <h3 className='font-bold'>Personal Information</h3>
                            <button
                                className={`ml-auto py-2 flex items-center ${editingSection === 'personal_info' ? 'underline hover:text-green-700' : 'hover:underline'}`}
                                onClick={() => (editingSection === 'personal_info' ? handleSave() : setEditingSection('personal_info'))}
                            >
                                {editingSection === 'personal_info' ? 'Save' : <PencilSquareIcon className='h-5 w-5' />}
                            </button>
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>First name</p>
                            {editingSection === 'personal_info' ? (
                                <Input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.first_name || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Last name</p>
                            {editingSection === 'personal_info' ? (
                                <Input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.last_name || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Email Address</p>
                            {editingSection === 'personal_info' ? (
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.email || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Phone number</p>
                            {editingSection === 'personal_info' ? (
                                <Input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.phone_number || '---'}</p>
                            )}
                        </div>
                    </div>
                    <div className='mt-4 border border-gray-300 rounded-lg px-4 py-2'>
                        <div className='flex items-center pb-2'>
                            <h3 className='font-bold'>Address Details</h3>
                            <button
                                className={`ml-auto py-2 flex items-center ${editingSection === 'address_details' ? 'underline hover:text-green-700' : 'hover:underline'}`}
                                onClick={() => (editingSection === 'address_details' ? handleSave() : setEditingSection('address_details'))}
                            >
                                {editingSection === 'address_details' ? 'Save' : <PencilSquareIcon className='h-5 w-5' />}
                            </button>
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Country</p>
                            {editingSection === 'address_details' ? (
                                <Input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.country || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Postal Code</p>
                            {editingSection === 'address_details' ? (
                                <Input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.postal_code || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>City, State</p>
                            {editingSection === 'address_details' ? (
                                <>
                                    <Input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className='w-full mb-2'
                                    />
                                    <Input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className='w-full'
                                    />
                                </>
                            ) : (
                                <p>{formData.city || '---'}, {formData.state || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Barangay</p>
                            {editingSection === 'address_details' ? (
                                <Input
                                    type="text"
                                    name="barangay"
                                    value={formData.barangay}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.barangay || '---'}</p>
                            )}
                        </div>
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Street Address</p>
                            {editingSection === 'address_details' ? (
                                <Input
                                    type="text"
                                    name="street_address"
                                    value={formData.street_address}
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>{formData.street_address || '---'}</p>
                            )}
                        </div>
                    </div>
                    {/* Password & Security section */}
                    <div className='mt-4 border border-gray-300 rounded-lg px-4 py-2'>
                        <div className='flex items-center pb-2'>
                            <h3 className='font-bold'>Password & Security</h3>
                            <button
                                className={`ml-auto py-2 flex items-center ${editingSection === 'security' ? 'underline hover:text-green-700' : 'hover:underline'}`}
                                onClick={() => (editingSection === 'security' ? handleSave() : setEditingSection('security'))}
                            >
                                {editingSection === 'security' ? 'Save' : <PencilSquareIcon className='h-5 w-5' />}
                            </button>
                        </div>

                        {/* Password Change Section */}
                        <div className='py-2'>
                            <p className='text-sm text-gray-500'>Current Password</p>
                            {editingSection === 'security' ? (
                                <Input
                                    type="password"
                                    name="current_password"
                                    onChange={handleInputChange}
                                    className='w-full'
                                />
                            ) : (
                                <p>••••••••</p>
                            )}
                        </div>

                        {editingSection === 'security' && (
                            <>
                                <div className='py-2'>
                                    <p className='text-sm text-gray-500'>New Password</p>
                                    <Input
                                        type="password"
                                        name="new_password"
                                        onChange={handleInputChange}
                                        className='w-full'
                                    />
                                </div>
                                <div className='py-2'>
                                    <p className='text-sm text-gray-500'>Confirm New Password</p>
                                    <Input
                                        type="password"
                                        name="new_password_confirmation"
                                        onChange={handleInputChange}
                                        className='w-full'
                                    />
                                </div>
                            </>
                        )}

                        {/* Two-Factor Authentication */}
                        <div className='py-2 border-t mt-4'>
                            <div className='flex items-center justify-between py-2'>
                                <div>
                                    <p className='font-medium'>Two-Factor Authentication</p>
                                    <p className='text-sm text-gray-500'>Add an extra layer of security to your account</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleToggle2FA}
                                >
                                    {user.two_factor_enabled ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>

                        {/* Login History */}
                        <div className='py-2 border-t'>
                            <div className='flex items-center justify-between py-2'>
                                <div>
                                    <p className='font-medium'>Recent Login Activity</p>
                                    <p className='text-sm text-gray-500'>Last login: {formatDate(user.last_login_at)}</p>
                                </div>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                        setShowLoginHistory(true);
                                        fetchLoginHistory();
                                    }}
                                >
                                    View All
                                </Button>
                            </div>
                        </div>

                        {/* Connected Devices */}
                        {/* <div className='py-2 border-t'>
                            <div className='flex items-center justify-between py-2'>
                                <div>
                                    <p className='font-medium'>Connected Devices</p>
                                    <p className='text-sm text-gray-500'>Manage devices that are logged into your account</p>
                                </div>
                                <Button variant="link" size="sm">
                                    Manage
                                </Button>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Order section */}
                <div className='lg:w-2/3 w-full flex-grow px-4 lg:pl-0'>
                    <div className='flex py-4 px-4 gap-6 items-center flex-grow text-sm text-gray-500'>
                        {['All', 'Placed', 'Shipped', 'Delivered', 'Completed'].map(status => (
                            <h3
                                key={status}
                                className={`flex-auto cursor-pointer ${selectedStatus === status ? 'font-bold text-black' : ''}`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {status}
                            </h3>
                        ))}
                        <div className="flex items-center border border-gray-300 rounded-sm px-3 py-1 bg-gray-50">
                            <input type="text" placeholder="Search..." className="outline-none bg-transparent" />
                            <Search className="text-gray-500" size={18} />
                        </div>
                    </div>
                    {filteredOrders.map(order => (
                        <div key={order.id} className='border rounded-lg border-gray-300 mb-4'>
                            <div className='px-4 py-4 flex items-center'>
                                <p className='font-bold'>Order {order.status}</p>
                                <div className='flex gap-4 px-4 items-end ml-auto'>
                                    {/* <Link href={`/orders/${order.id}`} className='px-4 py-1 border border-gray-300 rounded-lg text-center'>View details</Link> */}
                                    <Link href={`/tracking?order_id=${order.id}`} className='px-4 py-1 bg-green-900 rounded-lg text-center border border-green-900 text-white'>Track order</Link>
                                </div>
                            </div>
                            <hr className="border-gray-300"></hr>
                            <div className='flex flex-wrap gap-4 px-4 pb-2 pt-8'>
                                {(order.images || []).map((image, index) => (
                                    <div
                                        key={index}
                                        className='relative h-16 w-16 rounded-lg border border-gray-300 flex items-center justify-center'
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Product"
                                                className='h-full w-full object-cover rounded-lg'
                                            />
                                        ) : (
                                            <span className="text-gray-500">No Image</span>
                                        )}
                                        <div className="absolute -top-2 -right-2 bg-green-900 text-white text-xs font-light w-6 h-6 flex items-center justify-center rounded-full">
                                            {order.order_items[index]?.quantity || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='flex px-4 py-4 justify-between'>
                                <p className='text-sm text-gray-500'>Order ID: <span className='text-base text-black'>{order.id}</span></p>
                                <p className='text-sm text-gray-500'>{order.order_items.length} items: <span className='text-base text-black'>{order.formatted_total}</span></p>
                                <p className='text-sm text-gray-500'>Delivery: <span className='text-base text-black'>{order.delivery_fee ? order.formatted_delivery_fee : '---'}</span></p>
                                <p className='text-sm text-gray-500'>Order time: <span className='text-base text-black'>{formatDate(order.created_at)}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {/* Verification Dialog */}
            {showVerification && (
                <Dialog open={showVerification} onOpenChange={setShowVerification}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
                            <DialogDescription>
                                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </DialogDescription>
                        </DialogHeader>

                        <div className="my-4 flex justify-center">
                            {qrCodeUrl && (
                                <QRCodeSVG
                                    value={qrCodeUrl}
                                    size={200}
                                    level="M"
                                    className="border p-2 rounded"
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <Input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className={error ? 'border-red-500' : ''}
                            />
                            {error && (
                                <p className="text-red-500 text-sm flex items-center gap-2">
                                    <span>⚠️</span>
                                    {error}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setShowVerification(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleVerification}>
                                Verify
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Login History Dialog */}
            <Dialog
                open={showLoginHistory}
                onOpenChange={setShowLoginHistory} >
                <DialogContent className="w-full max-w-4xl sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Login History</DialogTitle>
                        <DialogDescription>
                            Recent login activities for your account
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {isLoadingHistory ? (
                            <div className="flex justify-center py-4">
                                <p>Loading history...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Device</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loginHistory.map((login, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{formatDate(login.created_at)}</TableCell>
                                            <TableCell>{login.ip_address}</TableCell>
                                            <TableCell>{login.user_agent || 'Unknown'}</TableCell>
                                            <TableCell>{login.location || 'Unknown'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${login.status === 'success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {login.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowLoginHistory(false)} variant="outline">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}