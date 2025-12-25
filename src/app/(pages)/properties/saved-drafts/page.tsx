'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDrafts, deleteDraft, PropertyDraft } from '@/services/property.service';
import { Loader2, Trash2, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function SavedDraftsPage() {
    const queryClient = useQueryClient();

    const { data: drafts, isLoading } = useQuery({
        queryKey: ['drafts'],
        queryFn: getDrafts,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDraft,
        onSuccess: () => {
            toast.success('Draft deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
        onError: () => {
            toast.error('Failed to delete draft');
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#ffffff]">
            <div className="flex-1 p-8 max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[24px] font-semibold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        Saved Drafts <span className="text-[#8F9BB3] font-medium ml-1">({drafts?.length || 0})</span>
                    </h1>
                </div>

                {drafts?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FileEdit className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No drafts found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You don't have any saved drafts. Start creating a property and save it as draft.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {drafts?.map((draft) => (
                            <div key={draft.id} className="bg-white rounded-xl border border-[#EDF1F7] p-5 hover:shadow-md transition-shadow">
                                <div className="flex flex-col h-full">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg line-clamp-1 mb-1" title={draft.data.propertyTitle || 'Untitled Draft'}>
                                            {draft.data.propertyTitle || 'Untitled Draft'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {draft.data.reference ? `Ref: ${draft.data.reference}` : 'No Reference'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                        <span>
                                            Last saved: {format(new Date(draft.updatedAt), 'MMM d, yyyy HH:mm')}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <Link href={`/properties/saved-drafts/${draft.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full border-[#E0F2FE] text-[#0BA5EC] hover:bg-[#E0F2FE]">
                                                <FileEdit className="w-4 h-4 mr-2" />
                                                Resume
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this draft?')) {
                                                    deleteMutation.mutate(draft.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
