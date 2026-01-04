
'use client';

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordList } from '@/components/passwords/password-list';
import { AddPasswordSheet } from '@/components/passwords/add-password-sheet';
import { PasswordDetails } from '@/services/password.service';

export default function PasswordManagerPage() {
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [passwordToEdit, setPasswordToEdit] = useState<PasswordDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEdit = (details: PasswordDetails) => {
        setPasswordToEdit(details);
        setIsAddSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsAddSheetOpen(false);
        setPasswordToEdit(null);
    };

    return (
        <div className="p-8 space-y-10 min-h-screen bg-[#FDFDFF]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-2xl font-bold text-gray-900">Passwords Manager</h1>

                <div className="flex-1 max-w-xl mx-4">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent border-none outline-none text-sm px-4 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-transparent text-gray-400">
                            <Search className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setIsAddSheetOpen(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 h-10 px-6 rounded-lg font-semibold transition-colors border-none shadow-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new
                </Button>
            </div>

            <div className="relative">
                <PasswordList onEdit={handleEdit} searchTerm={searchTerm} />
            </div>

            <AddPasswordSheet
                isOpen={isAddSheetOpen}
                onClose={handleCloseSheet}
                passwordToEdit={passwordToEdit}
            />
        </div>
    );
}
