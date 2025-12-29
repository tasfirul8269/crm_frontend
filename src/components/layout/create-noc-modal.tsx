'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Home, DollarSign, Key } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateNocModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateNocModal({ open, onOpenChange }: CreateNocModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<'category' | 'purpose'>('category');
    const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial' | ''>('');
    const [selectedPurpose, setSelectedPurpose] = useState<'sell' | 'rent' | ''>('');

    const handleCategorySelect = (category: 'residential' | 'commercial') => {
        setSelectedCategory(category);
        setStep('purpose');
    };

    const handlePurposeSelect = (purpose: 'sell' | 'rent') => {
        setSelectedPurpose(purpose);
        // Redirect to create NOC page with pre-selected options
        router.push(`/properties/new?category=${selectedCategory}&purpose=${purpose}&startNoc=true`);
        onOpenChange(false);
        // Reset state for next time
        setStep('category');
        setSelectedCategory('');
        setSelectedPurpose('');
    };

    const handleBack = () => {
        if (step === 'purpose') {
            setStep('category');
            setSelectedPurpose('');
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state
        setStep('category');
        setSelectedCategory('');
        setSelectedPurpose('');
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden bg-white border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            {step === 'category' ? 'Select Property Type' : 'Select Purpose'}
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === 'category'
                                ? 'Choose the type of property for the NOC'
                                : 'Choose whether the property is for sale or rent'
                            }
                        </p>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {step === 'category' && (
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
                    )}

                    {step === 'purpose' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handlePurposeSelect('sell')}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-[#00B7FF] hover:bg-[#00B7FF]/5",
                                        selectedPurpose === 'sell'
                                            ? "border-[#00B7FF] bg-[#00B7FF]/10"
                                            : "border-gray-200"
                                    )}
                                >
                                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                                        <DollarSign className="w-7 h-7 text-green-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">For Sale</span>
                                </button>

                                <button
                                    onClick={() => handlePurposeSelect('rent')}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-[#00B7FF] hover:bg-[#00B7FF]/5",
                                        selectedPurpose === 'rent'
                                            ? "border-[#00B7FF] bg-[#00B7FF]/10"
                                            : "border-gray-200"
                                    )}
                                >
                                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Key className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">For Rent</span>
                                </button>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="w-full h-10 text-gray-500 hover:text-gray-700"
                            >
                                ← Back to property type
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
