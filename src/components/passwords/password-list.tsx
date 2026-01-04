
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPasswords, getPasswordDetails, deletePassword, PasswordDetails } from '@/services/password.service';
import { Lock, Eye, EyeOff, Copy, Trash2, Loader2, Key, Info, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordListProps {
    onEdit?: (details: PasswordDetails) => void;
    searchTerm: string;
}

export function PasswordList({ onEdit, searchTerm }: PasswordListProps) {
    const queryClient = useQueryClient();

    const { data: passwords = [], isLoading } = useQuery({
        queryKey: ['passwords'],
        queryFn: getPasswords,
    });

    const deleteMutation = useMutation({
        mutationFn: deletePassword,
        onSuccess: () => {
            toast.success('Password deleted');
            queryClient.invalidateQueries({ queryKey: ['passwords'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const filteredPasswords = passwords.filter(pw =>
        pw.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-40 bg-gray-50 rounded-[32px] animate-pulse border border-gray-100" />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {filteredPasswords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                    <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6">
                        <Lock className="h-12 w-12 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Safe & Sound</h3>
                    <p className="text-gray-500 max-w-sm px-6">
                        {passwords.length === 0
                            ? "Your shared credentials will appear here once they're added. Everything is encrypted for your security."
                            : "No passwords match your search."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPasswords.map((pw) => (
                        <Card
                            key={pw.id}
                            className="relative overflow-hidden p-5 border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-lg rounded-[24px] transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {pw.logoUrl ? (
                                        <img src={pw.logoUrl} alt={pw.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-indigo-50 text-indigo-600 font-bold text-lg">
                                            {pw.title.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(pw); }}
                                        className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-gray-300"
                                        title="Edit"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this password?')) {
                                                deleteMutation.mutate(pw.id);
                                            }
                                        }}
                                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-300"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-5 truncate pr-2">
                                {pw.title}
                            </h3>

                            <div className="space-y-3">
                                {/* Username Field */}
                                <div className="relative group/field">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="h-4 w-4 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={pw.username}
                                        className="block w-full h-10 pl-9 pr-9 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-indigo-200 transition-colors"
                                    />
                                    <button
                                        onClick={() => handleCopy(pw.username)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* Password Field */}
                                <div className="relative group/field">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-3.5 w-3.5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        readOnly
                                        value={pw.password}
                                        className="block w-full h-10 pl-9 pr-9 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-indigo-200 transition-colors"
                                    />
                                    <button
                                        onClick={() => handleCopy(pw.password)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
