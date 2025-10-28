import AppLayout from "../../../../resources/js/Layouts/AppLayout";
import ErrorBoundary from "@/resources/js/Components/ErrorBoundary";
import { router } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function Promotion({ promotions }) {
    console.log('Received promotions:', promotions); // Debug log
    console.log('Promotions type:', typeof promotions); // Check the type
    console.log('Is array?', Array.isArray(promotions)); // Check if it's an array
    
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code: '',
        discount_type: 'percentage', // 'percentage' or 'fixed'
        discount_value: '',
        minimum_purchase: '0',
        start_date: '',
        end_date: '',
        usage_limit: '',
        status: 'active', // Set default status to active
    });
    
    const sections = [
        {
            title: "Promotions",
            description: "Manage promotional banners and special offers",
            link: "#",
            icon: "🎯"
        },
        {
            title: "Vouchers",
            description: "Create and manage discount vouchers",
            link: "/admin/vouchers",  // Using direct path instead of route helper
            icon: "🎫"
        }
    ];

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Implement search functionality if needed
    };

    const renderSections = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {sections.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{section.icon}</span>
                            <CardTitle>{section.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{section.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            variant="outline" 
                            className="w-full justify-center hover:bg-primary hover:text-primary-foreground"
                            onClick={() => section.link !== "#" && router.visit(section.link)}
                        >
                            Manage {section.title}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    const handleAddPromotion = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post('/admin/promotions', formData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                setFormData({
                    name: '',
                    description: '',
                    code: '',
                    discount_type: 'percentage',
                    discount_value: '',
                    start_date: '',
                    end_date: '',
                });
            },
            onError: (errors) => {
                console.error('Create failed:', errors);
            },
            onFinish: () => setIsLoading(false),
        });
    };

    // Status badge color based on status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <ErrorBoundary>
                <Breadcrumb className="mt-18 p-4 bg-white shadow-sm rounded-md mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/"><HomeIcon className=" w-4 h-4" /></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Promotion Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div>
                    <Card className="p-4 mb-4">
                        <div className="flex flex-row gap-x-2">
                            {/* Search Bar */}
                            <div className="items-center flex-grow justify-center">
                                <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-60 relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="outline-none bg-transparent w-full text-sm"
                                    />
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 absolute right-3"></div>
                                    ) : (
                                        <Search className="text-gray-500 absolute right-3" size={18} />
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={handleAddPromotion}
                                className="tooltip-trigger"
                                variant="outline"
                                title="Add New Promotion"
                            >
                                <PlusIcon className="w-6 h-6" />
                                <span className="sr-only">Add New Promotion</span>
                            </Button>
                        </div>

                        <Table>
                            <TableCaption>List of promotions</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">Name</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">Description</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">Promotion Code</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">Start and End Date</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {console.log('Rendering table with promotions:', promotions)}
                                {promotions && promotions.length > 0 ? (
                                    promotions.map((promotion) => (
                                        <TableRow key={promotion.id}>
                                            <TableCell>
                                                <p className="font-medium">{promotion.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {promotion.discount_type || 'No discount type'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium truncate max-w-xs">{promotion.description}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{promotion.code || 'No code'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {promotion.discount_type === 'percentage' 
                                                        ? `${promotion.discount_value}%` 
                                                        : `₱${promotion.discount_value}`}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{formatDate(promotion.start_date)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(promotion.end_date)}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(promotion.status)}`}>
                                                    {promotion.status}
                                                </span>
                                            </TableCell>
                                            
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6">
                                            No promotions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* Create Promotion Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="sticky top-0 z-50 bg-white pb-4">
                            <DialogTitle>Create New Promotion</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Promotion Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="code">Promotion Code</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    required
                                    placeholder="e.g., SUMMER2025"
                                />
                            </div>

                            <div>
                                <Label htmlFor="discount_type">Discount Type</Label>
                                <Select
                                    value={formData.discount_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select discount type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage Off (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="discount_value">
                                    {formData.discount_type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                                </Label>
                                <Input
                                    id="discount_value"
                                    type="number"
                                    min="0"
                                    max={formData.discount_type === 'percentage' ? "100" : undefined}
                                    value={formData.discount_value}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                                    required
                                    placeholder={formData.discount_type === 'percentage' ? "e.g., 10 for 10% off" : "e.g., 100 for ₱100 off"}
                                />
                            </div>

                            <div>
                                <Label htmlFor="minimum_purchase">Minimum Purchase Amount (₱)</Label>
                                <Input
                                    id="minimum_purchase"
                                    type="number"
                                    min="0"
                                    value={formData.minimum_purchase}
                                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_purchase: e.target.value }))}
                                    required
                                    placeholder="e.g., 1000"
                                />
                            </div>

                            <div>
                                <Label htmlFor="usage_limit">Usage Limit (leave empty for unlimited)</Label>
                                <Input
                                    id="usage_limit"
                                    type="number"
                                    min="1"
                                    value={formData.usage_limit}
                                    onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                                    placeholder="e.g., 100"
                                />
                            </div>

                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="datetime-local"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="datetime-local"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="sticky bottom-0 bg-white pt-4 mt-6">
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Creating...' : 'Create Promotion'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </ErrorBoundary>
        </AppLayout>
    )
}