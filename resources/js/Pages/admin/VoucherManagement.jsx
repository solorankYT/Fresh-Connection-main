import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from "../../Layouts/AppLayout";
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VoucherManagement({ vouchers = [] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_spend: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/admin/vouchers', formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '',
          minimum_spend: '',
          usage_limit: '',
          valid_from: '',
          valid_until: '',
          is_active: true,
        });
        toast.success('Voucher created successfully');
      },
      onError: (errors) => {
        console.error('Create failed:', errors);
        toast.error(errors.message || 'Failed to create voucher');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedVoucher) return;
    setIsSubmitting(true);

    router.put(`/admin/vouchers/${selectedVoucher.id}`, formData, {
      onSuccess: () => {
        setIsEditOpen(false);
        setSelectedVoucher(null);
        toast.success('Voucher updated successfully');
      },
      onError: (errors) => {
        console.error('Update failed:', errors);
        toast.error(errors.message || 'Failed to update voucher');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleDelete = () => {
    if (!selectedVoucher || isSubmitting) return;
    setIsSubmitting(true);

    router.delete(`/admin/vouchers/${selectedVoucher.id}`, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedVoucher(null);
        toast.success('Voucher deleted successfully');
      },
      onError: (errors) => {
        console.error('Delete failed:', errors);
        toast.error(errors.message || 'Failed to delete voucher');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Voucher Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Vouchers</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                  Create Voucher
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min. Spend</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-medium">{voucher.code}</TableCell>
                      <TableCell>{voucher.description}</TableCell>
                      <TableCell>{voucher.discount_type}</TableCell>
                      <TableCell>
                        {voucher.discount_type === 'percentage' 
                          ? `${voucher.discount_value}%` 
                          : `₱${voucher.discount_value}`}
                      </TableCell>
                      <TableCell>₱{voucher.minimum_spend}</TableCell>
                      <TableCell>
                        {voucher.times_used}/{voucher.usage_limit || '∞'}
                      </TableCell>
                      <TableCell>
                        {new Date(voucher.valid_from).toLocaleDateString()} - 
                        {new Date(voucher.valid_until).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          voucher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {voucher.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-500 transition-colors"
                            onClick={() => {
                              setSelectedVoucher(voucher);
                              setFormData({
                                code: voucher.code,
                                description: voucher.description,
                                discount_type: voucher.discount_type,
                                discount_value: voucher.discount_value,
                                minimum_spend: voucher.minimum_spend,
                                usage_limit: voucher.usage_limit,
                                valid_from: voucher.valid_from,
                                valid_until: voucher.valid_until,
                                is_active: voucher.is_active,
                              });
                              setIsEditOpen(true);
                            }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="h-4 w-4"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              <path d="m15 5 4 4"/>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={() => {
                              setSelectedVoucher(voucher);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Create/Edit Form Dialog */}
              <Dialog 
                open={isCreateOpen || isEditOpen} 
                onOpenChange={() => {
                  if (isCreateOpen) setIsCreateOpen(false);
                  if (isEditOpen) setIsEditOpen(false);
                }}
              >
                <DialogContent className="max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isCreateOpen ? 'Create Voucher' : 'Edit Voucher'}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Voucher Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
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
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimum_spend">Minimum Spend</Label>
                      <Input
                        id="minimum_spend"
                        type="number"
                        min="0"
                        value={formData.minimum_spend}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimum_spend: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="usage_limit">Usage Limit (leave empty for unlimited)</Label>
                      <Input
                        id="usage_limit"
                        type="number"
                        min="0"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="valid_from">Valid From</Label>
                      <Input
                        id="valid_from"
                        type="datetime-local"
                        value={formData.valid_from}
                        onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="valid_until">Valid Until</Label>
                      <Input
                        id="valid_until"
                        type="datetime-local"
                        value={formData.valid_until}
                        onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (isCreateOpen) setIsCreateOpen(false);
                          if (isEditOpen) setIsEditOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isCreateOpen ? 'Create' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="max-w-[400px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this voucher? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}