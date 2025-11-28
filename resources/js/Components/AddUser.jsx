import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddUser({ onClose }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: "customer",
        status: "active",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        const validationErrors = {};
        if (!formData.first_name) validationErrors.first_name = "First name is required.";
        if (!formData.last_name) validationErrors.last_name = "Last name is required.";
        if (!formData.email) validationErrors.email = "Email is required.";
        if (!formData.password) validationErrors.password = "Password is required.";
        if (formData.password !== formData.password_confirmation) validationErrors.password_confirmation = "Passwords do not match.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Send request
        router.post("/admin/user-management", formData, {
            onSuccess: () => {
                toast.success("User added successfully!");
                onClose();
            },
            onError: (error) => setErrors(error),
        });
    };

    const roleOptions = ["admin", "supplier", "customer"];
    const statusOptions = ["active", "inactive"];

    return (
        <aside className="bg-white w-[500px] rounded-2xl flex h-full">
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
                <header className="p-4 bg-white flex items-center sticky border-b rounded-t-lg top-0">
                    <ChevronLeftIcon
                        className="w-8 h-8 cursor-pointer p-1 rounded-sm hover:bg-gray-100"
                        onClick={onClose}
                    />
                    <p className="px-4 font-medium">Add New User</p>
                </header>

                <div className="flex flex-col px-4 py-4 flex-grow overflow-y-auto space-y-4">
                    <div>
                        <label className="text-sm font-light">First Name</label>
                        <Input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="John"
                        />
                        {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-light">Last Name</label>
                        <Input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Doe"
                        />
                        {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-light">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-light">Phone Number</label>
                        <Input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="+63 9123456789"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-light">Role</label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-light">Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-light">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-light">Confirm Password</label>
                        <Input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs">{errors.password_confirmation}</p>
                        )}
                    </div>
                </div>

                <footer className="flex px-4 py-4 border-t rounded-b-lg bg-white border-gray-300 sticky bottom-0">
                    <Button type="submit" className="w-full bg-green-900 text-white hover:bg-black">
                        Create User
                    </Button>
                </footer>
            </form>
        </aside>
    );
}
