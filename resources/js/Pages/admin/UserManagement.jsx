import AppLayout from "../../Layouts/AppLayout";
import ErrorBoundary from "@/resources/js/Components/ErrorBoundary";
import { HomeIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { debounce, over } from "lodash";
import { router } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CartesianGrid, Line, LineChart, XAxis, Bar, BarChart, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious, 
    PaginationEllipsis 
} from "@/components/ui/pagination";
import { AnimatePresence } from "framer-motion";
import AddUser from "../../Components/AddUser";
import { motion } from "framer-motion";


export default function UserManagement({ users: initialUsers, summary: overallSummary, chartData, barChartData, filters }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const searchValueRef = useRef(filters?.search || "");
    const [isLoading, setIsLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: filters?.sort_key || "id",
        direction: filters?.sort_direction || "asc",
    });
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedUsers, setEditedUsers] = useState({});


    const summary = overallSummary;

    const fetchUsers = useCallback(async (sortConfigOverride = null, searchOverride = null) => {
        setIsLoading(true);
        
        const params = new URLSearchParams();
        
        const searchValue = searchOverride !== null ? searchOverride : searchValueRef.current;
        const sort = sortConfigOverride || sortConfig;
        
        if (searchValue) params.append('search', searchValue);
        params.append('sort_key', sort.key || 'id');
        params.append('sort_direction', sort.direction || 'asc');
        params.append('per_page', filters?.per_page || 10);
        
        try {
            await router.get(`/admin/user-management?${params.toString()}`, {}, {
                preserveState: true,
                onSuccess: (page) => {
                    setUsers(page.props.users);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        }
    }, [sortConfig, filters?.per_page]);

    const debouncedSearch = useMemo(() =>
        debounce((value) => {
            searchValueRef.current = value;
            fetchUsers(null, value);
        }, 500),
        [fetchUsers]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleSort = (key) => {
        // If in edit mode, don't allow sorting
        if (isEditMode) {
            toast.error("Please save your changes before sorting");
            return;
        }
        
        // Save current scroll position
        const scrollPosition = window.scrollY;
        
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        const newSortConfig = { key, direction };
        setSortConfig(newSortConfig);
        
        // Fetch with scrollPosition restoration
        fetchUsers(newSortConfig).then(() => {
            // Restore scroll position after data is loaded
            window.scrollTo({
                top: scrollPosition,
                behavior: 'auto' // Use 'auto' to avoid animation
            });
        });
    };

    const filteredAndSortedUsers = useMemo(() => {
        if (users.data && Array.isArray(users.data)) {
            return users.data;
        }
        
        if (Array.isArray(users)) {
            return users;
        }
        
        return [];
    }, [users]);

    const getSortDirectionIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const chartConfig = {
        desktop: {
            label: "Users",
            color: "#14532d",
        },
    };

    const getCurrentMonthRange = () => {
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        return `${monthNames[sixMonthsAgo.getMonth()]} to ${monthNames[now.getMonth()]}`;
    };


    const handleEditModeToggle = () => {
        if (isEditMode) {
            handleSaveChanges();
        } else {
            setIsEditMode(true);
        }
    };

    const handleSaveChanges = async () => {
        if (Object.keys(editedUsers).length === 0) {
            setIsEditMode(false);
            return;
        }
        
        setIsLoading(true);
        try {
            const updates = Object.values(editedUsers);

            await router.put('/admin/user-management/bulk-update', {
                users: updates,
            });

            fetchUsers();

            toast.success("Changes saved successfully!");
            setEditedUsers({});
            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error("Failed to save changes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserEdit = (userId, field, value) => {
        setEditedUsers((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                id: userId,
                [field]: value,
            },
        }));
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
                            <BreadcrumbPage>User Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

               

                <Card className="p-4 mb-4">
                    <div className="flex flex-row gap-x-2">
                        <div className="items-center flex-grow justify-center">
                            <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-60 relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onChange={handleSearch}
                                    value={searchQuery}
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
                        onClick={() => setIsAddingUser(true)}
                        className=""
                        >
                           + Add User
                        </Button>

                        <Button
                            onClick={handleEditModeToggle}
                            className=""
                            variant="outline"
                        >
                            {isEditMode ? "Save" : <PencilSquareIcon className="w-6 h-6" />}
                        </Button>
                        
                                    

                    </div>

                    <Table>
                        <TableCaption>List of Users</TableCaption>
                        <TableHeader className="sticky top-0">
                            <TableRow>
                                <TableHead
                                    onClick={() => handleSort('id')}
                                    className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                    title={isEditMode ? "Finish editing to enable sorting" : "Sort by ID"}
                                >
                                    User ID {getSortDirectionIndicator('id')}
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('name')}
                                    className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                    title={isEditMode ? "Finish editing to enable sorting" : "Sort by Name"}
                                >
                                    Full Name {getSortDirectionIndicator('name')}
                                </TableHead>
                                <TableHead>Full Address</TableHead>
                                <TableHead>Phone number</TableHead>
                                <TableHead
                                    onClick={() => handleSort('role')}
                                    className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                    title={isEditMode ? "Finish editing to enable sorting" : "Sort by Role"}
                                >
                                    Role {getSortDirectionIndicator('role')}
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('status')}
                                    className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                    title={isEditMode ? "Finish editing to enable sorting" : "Sort by Status"}
                                >
                                    Status {getSortDirectionIndicator('status')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredAndSortedUsers.length > 0 ? (
                                filteredAndSortedUsers.map(user => (
                                    <TableRow key={user.id} className="font-medium">
                                        <TableCell className="flex items-center space-x-2">
                                            <img
                                                src={user.user_image ? `/storage/${user.user_image}` : "/images/user.png"}
                                                alt="customer"
                                                className="h-10 w-10 bg-white object-cover rounded-full border border-gray-300"
                                            />
                                            <div>
                                                <p className="">{user.id}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p>{user.first_name} {user.last_name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>
                                                {user.postal_code} {user.city}, {user.barangay}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.street_address}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{user.phone_number || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell>
                                            {isEditMode ? (
                                                <Select
                                                    value={editedUsers[user.id]?.role || user.role}
                                                    onValueChange={(value) => handleUserEdit(user.id, "role", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="supplier">Supplier</SelectItem>
                                                        <SelectItem value="customer">Customer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p>{user.role}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditMode ? (
                                                <Select
                                                    value={editedUsers[user.id]?.status || user.status}
                                                    onValueChange={(value) => handleUserEdit(user.id, "status", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs ${user.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {users.links && users.links.length > 3 && (
                        <Pagination className="mt-4">
                            <PaginationContent>
                                {users.links.map((link, i) => {
                                    if (link.label === '...') {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    
                                    if (i === 0) {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationPrevious
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (link.url) {
                                                            e.preventDefault();
                                                            router.get(link.url, {}, {});
                                                        }
                                                    }}
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    
                                    if (i === users.links.length - 1) {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationNext
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (link.url) {
                                                            e.preventDefault();
                                                            router.get(link.url, {}, {});
                                                        }
                                                    }}
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href={link.url || '#'}
                                                onClick={(e) => {
                                                    if (link.url) {
                                                        e.preventDefault();
                                                        router.get(link.url, {}, {});
                                                    }
                                                }}
                                                isActive={link.active}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    )}
                </Card>

                
            <AnimatePresence>
                {isAddingUser && (
                    <div className="fixed inset-0 flex justify-end z-50">
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative z-10 m-4"
                        >
                            <AddUser onClose={() => setIsAddingUser(false)} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute inset-0 bg-black"
                            onClick={() => setIsAddingUser(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            </ErrorBoundary>
        </AppLayout>
    );
}