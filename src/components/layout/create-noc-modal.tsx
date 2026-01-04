'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Home } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CreateNocModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateNocModal({ open, onOpenChange }: CreateNocModalProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial' | ''>('');

    const handleCategorySelect = (category: 'residential' | 'commercial') => {
        setSelectedCategory(category);
        // NOC is only for rent properties - navigate directly with purpose=rent
        router.push(`/properties/new?category=${category}&purpose=rent&startNoc=true`);
        onOpenChange(false);
        // Reset state for next time
        setSelectedCategory('');
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state
        setSelectedCategory('');
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden bg-white border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Select Property Type
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Choose the type of property for the NOC (Rental Properties)
                        </p>
                    </DialogHeader>
                </div>

                {/* Content - Category Selection Only */}
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleCategorySelect('residential')}
                            className={cn(
                                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-[#00B7FF] hover:bg-[#00B7FF]/5",
                                selectedCategory === 'residential'
                                    ? "border-[#00B7FF] bg-[#00B7FF]/10"
                                    : "border-gray-200"
                            )}
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                                <Home className="w-7 h-7 text-[#00B7FF]" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Residential</span>
                        </button>

                        <button
                            onClick={() => handleCategorySelect('commercial')}
                            className={cn(
                                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-[#00B7FF] hover:bg-[#00B7FF]/5",
                                selectedCategory === 'commercial'
                                    ? "border-[#00B7FF] bg-[#00B7FF]/10"
                                    : "border-gray-200"
                            )}
                        >
                            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                                <Building2 className="w-7 h-7 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Commercial</span>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

